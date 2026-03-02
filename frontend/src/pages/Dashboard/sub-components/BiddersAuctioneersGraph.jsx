import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BiddersAuctioneersGraph = () => {
  const { totalAuctioneers, totalBidders } = useSelector(
    (state) => state.superAdmin
  );
  
  // Make sure we have valid arrays
  const validBidders = Array.isArray(totalBidders) ? totalBidders : Array(12).fill(0);
  const validAuctioneers = Array.isArray(totalAuctioneers) ? totalAuctioneers : Array(12).fill(0);

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Bidders",
        data: validBidders,
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Auctioneers",
        data: validAuctioneers,
        borderColor: "rgba(244, 63, 94, 1)",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        pointBackgroundColor: "rgba(244, 63, 94, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(244, 63, 94, 1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          boxWidth: 16,
          boxHeight: 16,
          padding: 20,
          font: {
            family: "Inter, sans-serif",
            size: 12,
            weight: "500",
          },
          color: document.documentElement.classList.contains("dark")
            ? "#E5E7EB"
            : "#374151",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleFont: {
          family: "Inter, sans-serif",
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          family: "Inter, sans-serif",
          size: 13,
        },
        padding: 12,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} users`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
          color: document.documentElement.classList.contains("dark")
            ? "#9CA3AF"
            : "#6B7280",
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(243, 244, 246, 0.1)"
            : "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
        },
        max: 30,
        ticks: {
          stepSize: 5,
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
          color: document.documentElement.classList.contains("dark")
            ? "#9CA3AF"
            : "#6B7280",
          padding: 10,
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      line: {
        borderJoinStyle: "round",
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  };

  return (
    <div className="relative h-[400px] w-full">
      <Line
        data={data}
        options={options}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
      />
    </div>
  );
};

export default BiddersAuctioneersGraph;
