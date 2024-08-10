"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "react-datepicker/dist/react-datepicker.css";

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

interface TimeLog {
  id: number;
  ticketId: number;
  startTime: string;
  endTime: string;
  duration: number;
  ticket: {
    title: string;
  };
}

const TimeLogPeriodGraph: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/timelogs?start=${startDate.toLocaleDateString()}&end=${endDate.toLocaleDateString()}`
      );
      const timeLogs: TimeLog[] = await response.json();

      const dailyTimes: { [key: string]: number } = {};
      timeLogs.forEach((log) => {
        const date = new Date(log.startTime).toLocaleDateString();
        const duration = parseFloat(log.duration.toString()) / 1000 / 60;
        if (dailyTimes[date]) {
          dailyTimes[date] += duration;
        } else {
          dailyTimes[date] = duration;
        }
      });

      setChartData({
        labels: Object.keys(dailyTimes),
        datasets: [
          {
            label: "Time Spent (hours)",
            data: Object.values(dailyTimes),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div>
      <h2>Select Period</h2>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date || new Date())}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date || new Date())}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default TimeLogPeriodGraph;
