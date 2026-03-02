// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Card, CardContent, CircularProgress, Grid, Paper } from '@mui/material';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// import { Bar, Pie } from 'react-chartjs-2';
// import axios from 'axios';

// // Register ChartJS components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// const CommissionGraphs = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [commissionResponse, dashboardResponse] = await Promise.all([
//           axios.get('http://localhost:5000/api/v1/dashboard/commission-stats', { withCredentials: true }),
//           axios.get('http://localhost:5000/api/v1/dashboard/stats', { withCredentials: true })
//         ]);

//         setStats({
//           commission: commissionResponse.data,
//           dashboard: dashboardResponse.data
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         setError(err.response?.data?.message || 'Failed to load dashboard data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, textAlign: 'center' }}>
//         <Typography color="error" variant="h6">{error}</Typography>
//       </Box>
//     );
//   }

//   // Monthly commission data for bar chart
//   const monthlyCommissionData = {
//     labels: stats.commission.monthlyCommissions.map(item => {
//       const [year, month] = item.month.split('-');
//       return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
//     }),
//     datasets: [
//       {
//         label: 'Commission (₹)',
//         data: stats.commission.monthlyCommissions.map(item => item.amount),
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Monthly payment data
//   const monthlyDataFromDashboard = stats.dashboard.monthlyData;
//   const monthlyPaymentData = {
//     labels: monthlyDataFromDashboard.map(item => {
//       const [year, month] = item.month.split('-');
//       return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
//     }),
//     datasets: [
//       {
//         label: 'Transaction Volume (₹)',
//         data: monthlyDataFromDashboard.map(item => item.volume),
//         backgroundColor: 'rgba(54, 162, 235, 0.6)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Commission (₹)',
//         data: monthlyDataFromDashboard.map(item => item.commission),
//         backgroundColor: 'rgba(255, 99, 132, 0.6)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Summary pie chart data
//   const transactionStats = stats.dashboard.transactionStats;
//   const pieChartData = {
//     labels: ['Total Transaction Volume', 'Total Commission'],
//     datasets: [
//       {
//         data: [
//           transactionStats.totalVolume - transactionStats.totalCommission,
//           transactionStats.totalCommission
//         ],
//         backgroundColor: [
//           'rgba(54, 162, 235, 0.6)',
//           'rgba(255, 99, 132, 0.6)',
//         ],
//         borderColor: [
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 99, 132, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <Box sx={{ py: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Commission & Payment Analytics
//       </Typography>

//       <Grid container spacing={4}>
//         {/* Summary Cards */}
//         <Grid item xs={12} md={6} lg={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
//                 Total Commission
//               </Typography>
//               <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
//                 ₹{stats.commission.totalCommission.toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6} lg={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
//                 Total Transactions
//               </Typography>
//               <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
//                 {stats.commission.totalTransactions}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6} lg={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
//                 Total Transaction Volume
//               </Typography>
//               <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
//                 ₹{stats.dashboard.transactionStats.totalVolume.toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6} lg={3}>
//           <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="h6" component="div" color="text.secondary" gutterBottom>
//                 Commission Rate
//               </Typography>
//               <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
//                 5%
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Charts */}
//         <Grid item xs={12} lg={8}>
//           <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               Monthly Payments and Commission
//             </Typography>
//             <Box sx={{ height: 400 }}>
//               <Bar
//                 data={monthlyPaymentData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       title: {
//                         display: true,
//                         text: 'Amount (₹)'
//                       }
//                     },
//                     x: {
//                       title: {
//                         display: true,
//                         text: 'Month'
//                       }
//                     }
//                   },
//                   plugins: {
//                     legend: {
//                       position: 'top',
//                     },
//                     title: {
//                       display: false,
//                       text: 'Monthly Payments and Commission'
//                     },
//                   },
//                 }}
//               />
//             </Box>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} lg={4}>
//           <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               Revenue Breakdown
//             </Typography>
//             <Box sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//               <Pie
//                 data={pieChartData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: {
//                       position: 'bottom',
//                     },
//                     tooltip: {
//                       callbacks: {
//                         label: function(context) {
//                           const label = context.label || '';
//                           const value = context.raw || 0;
//                           return `${label}: ₹${value.toLocaleString()}`;
//                         }
//                       }
//                     }
//                   },
//                 }}
//               />
//             </Box>
//           </Paper>
//         </Grid>

//         <Grid item xs={12}>
//           <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               Monthly Commission Trend
//             </Typography>
//             <Box sx={{ height: 400 }}>
//               <Bar
//                 data={monthlyCommissionData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       title: {
//                         display: true,
//                         text: 'Commission Amount (₹)'
//                       }
//                     },
//                     x: {
//                       title: {
//                         display: true,
//                         text: 'Month'
//                       }
//                     }
//                   },
//                   plugins: {
//                     legend: {
//                       position: 'top',
//                     },
//                     title: {
//                       display: false,
//                       text: 'Monthly Commission Trend'
//                     },
//                   },
//                 }}
//               />
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default CommissionGraphs;

import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CommissionGraphs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chartRef = useRef(null);

  // Check dark mode on mount and when it changes
  useEffect(() => {
    const checkDarkMode = () => {
      const darkModeOn =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(darkModeOn);
    };

    // Initial check
    checkDarkMode();

    // Set up listeners for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    // Observer for class changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mediaQuery.removeEventListener("change", checkDarkMode);
      observer.disconnect();
    };
  }, []);

  // Update chart when dark mode changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commissionResponse, dashboardResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/v1/dashboard/commission-stats", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/v1/dashboard/stats", {
            withCredentials: true,
          }),
        ]);

        setStats({
          commission: commissionResponse.data,
          dashboard: dashboardResponse.data,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  // Format month labels consistently
  const formatMonthLabel = (dateStr) => {
    const [year, month] = dateStr.split("-");
    return `${new Date(year, month - 1).toLocaleString("default", {
      month: "short",
    })} ${year}`;
  };

  // Monthly payment data
  const monthlyDataFromDashboard = stats.dashboard.monthlyData;
  const monthlyPaymentData = {
    labels: monthlyDataFromDashboard.map((item) =>
      formatMonthLabel(item.month)
    ),
    datasets: [
      {
        label: "Transaction Volume (₹)",
        data: monthlyDataFromDashboard.map((item) => item.volume),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        hoverBackgroundColor: "rgba(79, 70, 229, 1)",
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
      },
      {
        label: "Commission (₹)",
        data: monthlyDataFromDashboard.map((item) => item.commission),
        backgroundColor: "rgba(236, 72, 153, 0.8)",
        hoverBackgroundColor: "rgba(219, 39, 119, 1)",
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
      },
    ],
  };

  // Chart options
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
          color: isDarkMode ? "#E5E7EB" : "#374151",
          padding: 20,
        },
      },
      title: {
        display: false,
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
        displayColors: false,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            return `${label}: ₹${context.parsed.y.toLocaleString()}`;
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
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode
            ? "rgba(243, 244, 246, 0.1)"
            : "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
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
        bottom: 10,
        left: 10,
      },
    },
    barPercentage: 0.6,
    categoryPercentage: 0.8,
  };

  return (
    <div className="py-6 w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
        Commission & Payment Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 px-4">
        {/* Summary Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500"></div>
          <div className="pl-2">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Commission
            </h3>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              ₹{stats.commission.totalCommission.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-pink-500"></div>
          <div className="pl-2">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Transactions
            </h3>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {stats.commission.totalTransactions.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
          <div className="pl-2">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Transaction Volume
            </h3>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              ₹{stats.dashboard.transactionStats.totalVolume.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>
          <div className="pl-2">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Commission Rate
            </h3>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              5%
            </p>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Monthly Payments and Commission
          </h2>
          <div className="h-[320px] w-full">
            <Bar data={monthlyPaymentData} options={options} ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionGraphs;
