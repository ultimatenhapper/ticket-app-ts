"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import axios from "axios";
import { Status, Ticket, Todo, TodoStatus } from "@prisma/client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";

interface PomodoroProps {
  todo: Todo;
  ticket: Ticket;
}

const Pomodoro: React.FC<PomodoroProps> = ({ todo, ticket }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(todo.timeDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (isWorking) {
        if (isNotificationOn) {
          playSound();
        }
        setIsWorking(false);
        if (completedSteps < parseInt(todo.steps))
          setTimeLeft(parseInt(todo.timeResting) * 60);
      } else {
        if (isNotificationOn) {
          playSound();
        }
        // Move to next step or finish
        const nextStep = currentStep + 1;
        if (nextStep < parseInt(todo.steps)) {
          setCurrentStep(nextStep);
          setIsWorking(true);
          setTimeLeft(todo.timeDuration * 60);
          setCompletedSteps((prev) => prev + 1);
          // registerTimeLog(todo.timeDuration * 60);
          // updateTicketTime();
        } else {
          // All steps completed
          setIsFinished(true);
          setIsRunning(false);
          setCompletedSteps((prev) => prev + 1);
        }
        registerTimeLog(todo.timeDuration * 60);
        updateTicketTime();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorking, currentStep, todo, isNotificationOn]);

  const toggleTimer = () => {
    if (isFinished) {
      resetTimer();
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(todo.timeDuration * 60);
    setCurrentStep(0);
    setCompletedSteps(0);
    setIsFinished(false);
  };

  const goBack = async () => {
    try {
      await axios.patch(`/api/todos/${todo.id}`, {
        ...todo,
        status: TodoStatus.DONE,
      });
      resetTimer();
      router.back();
    } catch (err) {
      console.error("Error updating todo state..." + err);
    }
  };

  const registerTimeLog = async (duration: number) => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - duration * 1000);
    await axios.post("/api/timelogs", {
      ticketId: todo.ticketId,
      startTime,
      endTime,
      duration: duration, // duration in seconds
    });
  };

  const updateTicketTime = async () => {
    if (todo.ticketId) {
      try {
        await axios.patch("/api/tickets/" + todo.ticketId, {
          status:
            ticket.status !== Status.STARTED ? Status.STARTED : ticket.status,
          TTS: ticket.TTS + (completedSteps + 1) * todo.timeDuration,
        });
      } catch (error) {
        console.error("Error updating ticket time:", error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const percentage = isWorking
    ? ((todo.timeDuration * 60 - timeLeft) / (todo.timeDuration * 60)) * 100
    : ((parseInt(todo.timeResting) * 60 - timeLeft) /
        (parseInt(todo.timeResting) * 60)) *
      100;

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Error playing sound: ", error);
      });
    }
  };

  const toggleNotification = () => {
    setIsNotificationOn((prev) => !prev);
  };

  return (
    <div className="p-6 border rounded-md shadow-lg max-w-md mx-auto bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">{todo.name}</h2>
      {todo.ticketId && (
        <p className="mb-4 text-center text-gray-600">
          Associated Ticket: {ticket.title}
        </p>
      )}
      {!isFinished ? (
        <>
          <p className="mb-4 text-center text-lg">
            Step {currentStep + 1} of {parseInt(todo.steps)}
            {/* <span className="font-semibold">{todo.steps[currentStep]}</span> */}
          </p>
          <div className="mb-6 flex justify-center">
            <CircularProgressbar
              value={percentage}
              text={formatTime(timeLeft)}
              styles={buildStyles({
                textColor: "#333",
                pathColor: isWorking ? "#023f4f" : "#4bb534",
                trailColor: "#f5f5f5",
              })}
            />
          </div>
          <p className="mb-6 text-center text-xl">
            {isWorking ? "Working" : "Resting"}
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={toggleTimer}>
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer}>Reset</Button>
            <Button onClick={toggleNotification}>
              {isNotificationOn ? "Disable Sound" : "Enable Sound   "}
            </Button>
          </div>
          <div className="mt-6">
            <Progress value={(completedSteps / parseInt(todo.steps)) * 100} />
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">All Steps Completed!</p>
          <Button onClick={goBack}>Complete</Button>
        </div>
      )}
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />
    </div>
  );
};

export default Pomodoro;
