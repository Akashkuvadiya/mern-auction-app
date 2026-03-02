import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const PaymentGraph = () => {
  const { 
    monthlyTransactionAmounts,
    monthlyPaymentProofAmounts
  } = useSelector((state) => state.superAdmin);

  const months = [
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
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Transaction Value",
        data: monthlyTransactionAmounts,
        backgroundColor: "rgba(234, 179, 8, 0.8)",
        hoverBackgroundColor: "rgba(234, 179, 8, 1)",
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 1,
        borderColor: "rgba(234, 179, 8, 1)",
      },
      {
        label: "Payment Proof Value",
        data: monthlyPaymentProofAmounts,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        hoverBackgroundColor: "rgba(79, 70, 229, 1)",
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 1,
        borderColor: "rgba(79, 70, 229, 1)",
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Inter, sans-serif",
            weight: "medium",
          },
          color: document.documentElement.classList.contains("dark")
            ? "#E5E7EB"
            : "#374151",
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Monthly Transaction & Payment Proof Data',
        font: {
          family: "Inter, sans-serif",
          size: 16,
          weight: 'bold'
        },
        color: document.documentElement.classList.contains("dark")
          ? "#E5E7EB"
          : "#374151",
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        padding: 12,
        titleFont: {
          family: "Inter, sans-serif",
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          family: "Inter, sans-serif",
          size: 13,
        },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toLocaleString()}`;
            }
            return label;
          }
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
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(243, 244, 246, 0.1)"
            : "rgba(107, 114, 128, 0.1)",
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
          padding: 10,
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
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

  // Calculate total values for the year
  const totalYearlyTransactions = monthlyTransactionAmounts.reduce(
    (sum, amount) => sum + amount, 
    0
  );
  
  const totalYearlyPaymentProofs = monthlyPaymentProofAmounts.reduce(
    (sum, amount) => sum + amount, 
    0
  );

  return (
    <div className="space-y-4">
      {/* Summary box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Yearly Payment Summary
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="border-r border-gray-200 dark:border-gray-700 pr-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Transaction Value
            </p>
            <p className="text-3xl font-bold text-amber-500">
              ₹{totalYearlyTransactions.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Avg Monthly: ₹{(totalYearlyTransactions / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
          <div className="pl-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Payment Proof Value
            </p>
            <p className="text-3xl font-bold text-indigo-500">
              ₹{totalYearlyPaymentProofs.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Avg Monthly: ₹{(totalYearlyPaymentProofs / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[400px] w-full">
        <Bar
          data={data}
          options={options}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
        />
      </div>
    </div>
  );
};

export default PaymentGraph;
