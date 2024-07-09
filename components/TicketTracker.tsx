"use client";

import { useState } from "react";

import { IoPlayCircleOutline } from "react-icons/io5";
import Clock from "./Clock";
import { Ticket } from "@prisma/client";

const TicketTracker = ({ ticket }: { ticket: Ticket }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <div className="flex justify-start align-items">
        <button onClick={() => setIsAssigning(!isAssigning)}>
          <IoPlayCircleOutline style={{ height: 100, width: 100 }} />
        </button>
        <div className="ml-3">{isAssigning && <Clock ticket={ticket} />}</div>
      </div>
    </>
  );
};

export default TicketTracker;
