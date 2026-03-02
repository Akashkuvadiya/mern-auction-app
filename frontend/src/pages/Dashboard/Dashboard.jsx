import React, { useState, useEffect } from "react";
import { BarChart3, Users, Receipt, ShoppingBag, Wallet } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../custom-components/Spinner";
import {
  getAllPaymentProofs,
  getMonthlyRevenue,
  getAllUsers,
  clearAllSuperAdminSliceErrors,
} from "../../store/slices/superAdminSlice";
import PaymentGraph from "./sub-components/PaymentGraph";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";
// import UserWalletManagement from "./sub-components/UserWalletManagement";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
} from "@mui/material";
import CommissionGraphs from "../../components/Dashboard/CommissionGraphs";
import { useNavigate } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [dashboardTab, setDashboardTab] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.superAdmin);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    } else if (user && user.role !== "Super Admin") {
      // Only super admin can access this page
      navigate("/");
    } else {
      dispatch(getMonthlyRevenue());
      dispatch(getAllUsers());
      dispatch(getAllPaymentProofs());
      dispatch(clearAllSuperAdminSliceErrors());
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleTabChange = (event, newValue) => {
    setDashboardTab(newValue);
  };

  if (loading) return <Spinner />;

  const tabs = [
    {
      id: "payments",
      label: "Monthly Payments",
      icon: <BarChart3 className="w-5 h-5" />,
      content: <PaymentGraph />,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      id: "users",
      label: "User Statistics",
      icon: <Users className="w-5 h-5" />,
      content: <BiddersAuctioneersGraph />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "proofs",
      label: "Payment Proofs",
      icon: <Receipt className="w-5 h-5" />,
      content: <PaymentProofs />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "auctions",
      label: "Auction Items",
      icon: <ShoppingBag className="w-5 h-5" />,
      content: <AuctionItemDelete />,
      color: "from-orange-500 to-amber-500",
    },
    // {
    //   id: "wallet",
    //   label: "Wallet Manage",
    //   icon: <Wallet className="w-5 h-5" />,
    //   content: <UserWalletManagement />,
    //   color: "from-green-500 to-lime-500",
    // },
    {
      id: "commissions",
      label: "Commission Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      content: <CommissionGraphs />,
      color: "from-red-400 to-pink-400",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-[#f0f2f5] dark:bg-gray-900 py-12">
      <div className="max-w-[90rem] mx-auto px-6 lg:pl-[320px] lg:mt-0 sm:mt-6">
        {/* Glass Card Container */}
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Header Section */}
          <div className="relative mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 text-transparent bg-clip-text">
              Admin Dashboard
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Monitor, analyze, and manage your auction platform
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 mx-auto rounded-full" />
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-3 p-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r " + tab.color + " text-white shadow-lg"
                    : "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-white/20"
                      : "bg-gradient-to-r " + tab.color + " text-white"
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="font-semibold">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-20 blur animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-emerald-500/5 rounded-2xl" />
            <div className="relative">
              {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
