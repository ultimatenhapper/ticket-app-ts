"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Ticket } from "@prisma/client";

interface Props {
  ticket: Ticket;
}
const Clock = ({ ticket }: Props) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    let interval = undefined;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = async () => {
    setIsActive(false);
    setIsPaused(true);
    await axios.patch("/api/tickets/" + ticket.id, { TTS: ticket.TTS + time });
    setTime(0);
  };

  const formatTime = (time = 0) => {
    const getSeconds = `0${time % 60}`.slice(-2);
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
