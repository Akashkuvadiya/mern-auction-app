import React, { useState } from "react";
import { RiAuctionFill } from "react-icons/ri";
import {
  MdLeaderboard,
  MdDashboard,
  MdOutlineLightMode,
  MdOutlineDarkMode,
} from "react-icons/md";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaFileInvoiceDollar, FaEye } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { TbLogin2 } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 text-white text-3xl p-2 rounded-xl bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 hover:from-gray-700 hover:via-gray-600 hover:to-gray-500 lg:hidden z-10 shadow-lg"
      >
        <GiHamburgerMenu />
      </div>
      
      {/* Wallet Balance Display for Auctioneer */}
      {isAuthenticated && user && user.role === "Auctioneer" && (
        <div className="fixed right-5 lg:right-8 top-5 z-10 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 dark:from-indigo-700 dark:via-indigo-600 dark:to-indigo-500 text-white py-2 px-4 rounded-xl shadow-lg flex items-center gap-2 font-medium">
          <FaWallet className="text-white text-lg" />
          <span>₹{user.wallet?.balance || 0}</span>
        </div>
      )}
      
      <div
        className={`sidedrawer w-full sm:w-[300px] h-full fixed top-0 ${
          show ? "left-0" : "-left-full"
        } transition-all duration-300 flex flex-col justify-between lg:left-0 z-10 bg-gray-50/95 dark:bg-gray-800/80 backdrop-blur-lg shadow-[5px_5px_20px_rgba(0,0,0,0.15)] dark:shadow-[5px_5px_20px_rgba(0,0,0,0.4)]`}
      >
        <div className="relative p-3 space-y-6">
          <div className="flex flex-col items-center">
            <Link
              to={"/"}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <h4 className="text-3xl font-bold bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                <span className="font-extrabold text-gray-700 dark:text-blue-400">
                  Prime
                </span>
                <span className="italic font-light text-gray-500 dark:text-indigo-400">
                  Bid
                </span>
              </h4>
            </Link>
            <div className="w-full h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 mt-2 rounded-full"></div>
          </div>

          <ul className="flex flex-col gap-4">
            <li>
              <Link
                to={"/auctions"}
                className="group relative flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-300"
              >
                <RiAuctionFill className="text-xl text-gray-700 dark:text-blue-400" />
                <span className="font-medium">Auctions</span>
                <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 transition-all duration-300 group-hover:w-[110px] bottom-[-4px]"></span>
              </Link>
            </li>
            <li>
              <Link
                to={"/leaderboard"}
                className="group relative flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-300"
              >
                <MdLeaderboard className="text-xl text-gray-600 dark:text-purple-400" />
                <span className="font-medium">Leaderboard</span>
                <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-purple-400 dark:via-purple-500 dark:to-purple-600 transition-all duration-300 group-hover:w-[140px] bottom-[-4px]"></span>
              </Link>
            </li>

            {isAuthenticated && user && user.role === "Auctioneer" && (
              <>
                <li>
                  <Link
                    to={"/submit-commission"}
                    className="group relative flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-300"
                  >
                    <FaFileInvoiceDollar className="text-xl text-gray-700 dark:text-indigo-400" />
                    <span className="font-medium">Submit Commission</span>
                    <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-indigo-400 dark:via-indigo-500 dark:to-indigo-600 transition-all duration-300 group-hover:w-[195px] bottom-[-4px]"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/create-auction"}
                    className="group relative flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-300"
                  >
                    <IoIosCreate className="text-xl text-gray-600 dark:text-indigo-400" />
                    <span className="font-medium">Create Auction</span>
                    <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-indigo-400 dark:via-indigo-500 dark:to-indigo-600 transition-all duration-300 group-hover:w-[160px] bottom-[-4px]"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/view-my-auctions"}
                    className="group relative flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-300"
                  >
                    <FaEye className="text-xl text-gray-700 dark:text-purple-400" />
                    <span className="font-medium">View My Auctions</span>
                    <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-purple-400 dark:via-purple-500 dark:to-purple-600 transition-all duration-300 group-hover:w-[180px] bottom-[-4px]"></span>
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user && user.role === "Bidder" && (
              <li>
                <Link
                  to={"/winning-bids"}
                  className="group relative flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-300"
                >
                  <FaTrophy className="text-xl text-gray-700 dark:text-purple-400" />
                  <span className="font-medium">Winning Auctions</span>
                  <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-purple-400 dark:via-purple-500 dark:to-purple-600 transition-all duration-300 group-hover:w-[180px] bottom-[-4px]"></span>
                </Link>
              </li>
            )}

            {isAuthenticated && user && user.role === "Super Admin" && (
              <li>
                <Link
                  to={"/dashboard"}
                  className="group relative flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-300"
                >
                  <MdDashboard className="text-xl text-gray-600 dark:text-indigo-400" />
                  <span className="font-medium">Dashboard</span>
                  <span className="absolute left-0 h-[2px] w-0 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 dark:from-indigo-400 dark:via-indigo-500 dark:to-indigo-600 transition-all duration-300 group-hover:w-[125px] bottom-[-4px]"></span>
                </Link>
              </li>
            )}
          </ul>

          {!isAuthenticated ? (
            <div className="flex gap-3">
              <Link
                to={"/sign-up"}
                className="flex-1 py-2 px-4 rounded-xl font-semibold  text-black  bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2  dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <FaUserPlus /> Sign Up
              </Link>
              <Link
                to={"/login"}
                className="flex-1 py-2 px-4 rounded-xl font-semibold  text-black  bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2  dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <TbLogin2 /> Login
              </Link>
            </div>
          ) : (
            <div className="flex justify-center" onClick={handleLogout}>
              <button
                className="w-full py-2 px-4 rounded-xl font-semibold text-black dark:text-white bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2  dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <TbLogout2 className="text-xl" />
                Logout
              </button>
            </div>
          )}

          <div className="w-full h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 rounded-full"></div>

          <ul className="flex flex-col gap-4">
            {isAuthenticated && (
              <li>
                <Link
                  to={"/me"}
                  className="group flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200  dark:hover:from-blue-500/10 dark:hover:via-purple-500/10 dark:hover:to-indigo-500/10 transition-all duration-300"
                >
                  <FaUserCircle className="text-xl text-gray-700 dark:text-blue-400" />
                  <span className="font-medium">Profile</span>
                </Link>
              </li>
            )}

            <li>
              <Link
                to={"/how-it-works-info"}
                className="group flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200  dark:hover:from-blue-500/10 dark:hover:via-purple-500/10 dark:hover:to-indigo-500/10 transition-all duration-300"
              >
                <SiGooglesearchconsole className="text-xl text-gray-700 dark:text-blue-400" />
                <span className="font-medium">How it works</span>
              </Link>
            </li>

            <li>
              <Link
                to={"/about"}
                className="group flex items-center gap-3 rounded-xl text-gray-700 dark:text-gray-200  dark:hover:from-blue-500/10 dark:hover:via-purple-500/10 dark:hover:to-indigo-500/10 transition-all duration-300"
              >
                <BsFillInfoSquareFill className="text-xl text-gray-600 dark:text-purple-400" />
                <span className="font-medium">About Us</span>
              </Link>
            </li>
          </ul>

          <IoMdCloseCircleOutline
            onClick={() => setShow(!show)}
            className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer sm:hidden"
          />
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={toggleDarkMode}
            className="w-full py-2 px-4 rounded-xl font-semibold  text-black  bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2  dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] dark:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            {isDarkMode ? (
              <MdOutlineLightMode className="text-xl" />
            ) : (
              <MdOutlineDarkMode className="text-xl" />
            )}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-gradient-to-tr from-green-400 to-green-600 hover:from-green-600 hover:to-green-400 text-white text-xl shadow-lg transition-all duration-300"
            >
              <BsWhatsapp />
            </Link>
            <Link
              to="/"
              className="p-2 rounded-xl bg-gradient-to-tr from-blue-400 to-blue-700 hover:from-blue-700 hover:to-blue-400 text-white text-xl shadow-lg transition-all duration-300"
            >
              <FaFacebook />
            </Link>
            <Link
              to="/"
              className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 text-white text-xl shadow-lg transition-all duration-300"
            >
              <RiInstagramFill />
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              to={"/contact"}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300"
            >
              Contact Us
            </Link>
            <p className="text-gray-500 dark:text-gray-400">
              &copy; PrimeBid, LLC.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
