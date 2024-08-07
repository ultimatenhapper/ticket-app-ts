"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { amountToTime } from "@/helpers/helpers";
import { TimeLog } from "@prisma/client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface Props {
  timeLogs: TimeLog[];
}

const TimeLogGraph = ({ timeLogs }: Props) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const ticketTimes: { [key: string]: number } = {};
      let total = 0;

      timeLogs.forEach((log: TimeLog) => {
        const duration = parseFloat(log.duration.toString());
        if (ticketTimes[log.ticketId]) {
          ticketTimes[log.ticketId] += duration / 60;
        } else {
          ticketTimes[log.ticketId] = duration / 60;
        }
        total += duration;
      });

      setChartData({
        labels: Object.keys(ticketTimes),
        datasets: [
          {
            label: "Time Spent (minutes)",
            data: Object.values(ticketTimes),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });

      setTotalTime(total);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Total Time Spent Today: {amountToTime(totalTime)}</h2>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default TimeLogGraph;
