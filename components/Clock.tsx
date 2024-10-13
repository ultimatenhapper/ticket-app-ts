"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Status, Ticket } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  ticket: Ticket;
}

const Clock = ({ ticket }: Props) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      } else {
        startTimeRef.current = Date.now() - accumulatedTimeRef.current;
      }

      interval = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedTime = Date.now() - startTimeRef.current;
          setTime(elapsedTime / 1000);
        }
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
      accumulatedTimeRef.current = 0;
      startTimeRef.current = null;
    } else if (isPaused) {
      if (interval) clearInterval(interval);
      if (startTimeRef.current !== null) {
        accumulatedTimeRef.current = Date.now() - startTimeRef.current;
        pausedTimeRef.current = Date.now();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = async () => {
    if (!isActive) return;
    if (isPaused) pausedTimeRef.current = Date.now();
    if (!isPaused && startTimeRef.current !== null) {
      const currentTime = Date.now();
      const referenceTime =
        pausedTimeRef.current !== null
          ? pausedTimeRef.current
          : startTimeRef.current;
      const duration = currentTime - referenceTime!;
      await registerTimeLog(duration);
    }
    setIsPaused(!isPaused);
  };

  const handleReset = async () => {
    if (isActive && !isPaused && startTimeRef.current !== null) {
      const duration = Date.now() - startTimeRef.current;
      await registerTimeLog(duration);
    }
    setIsActive(false);
    setIsPaused(true);
    await axios.patch("/api/tickets/" + ticket.id, {
      status: ticket.status !== Status.STARTED ? Status.STARTED : ticket.status,
      TTS: ticket.TTS + time,
    });
    setTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    pausedTimeRef.current = null;
    router.refresh();
  };

  const registerTimeLog = async (duration: number) => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - duration);
    await axios.post("/api/timelogs", {
      ticketId: ticket.id,
      startTime,
      endTime,
      duration: duration / 1000, // duration in seconds
    });
  };

  const formatTime = (time = 0) => {
    const getSeconds = `0${Math.floor(time % 60)}`.slice(-2);
    const minutes = Math.floor(time / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="text-3xl mb-4">{formatTime(time)}</div>
      <div className="flex gap-4">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          disabled={isActive}
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Clock;
