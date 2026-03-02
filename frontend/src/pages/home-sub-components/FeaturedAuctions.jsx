import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineFeaturedPlayList } from "react-icons/md";

const calculateTimeLeft = (endTime) => {
  const difference = new Date(endTime) - new Date();
  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return "Ended";
};

const calculateInitialTimeLeft = (auctions) => {
  const timeLeftObj = {};
  auctions.forEach((auction) => {
    timeLeftObj[auction._id] = {
      start: calculateTimeLeft(auction.startTime),
      end: calculateTimeLeft(auction.endTime),
    };
  });
  return timeLeftObj;
};

const FeaturedAuctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const [timeLeft, setTimeLeft] = useState({});

  // Initialize timeLeft as soon as allAuctions is available
  useEffect(() => {
    if (allAuctions.length > 0) {
      setTimeLeft(calculateInitialTimeLeft(allAuctions));
    }
  }, [allAuctions]);

  // Update timeLeft every second
  useEffect(() => {
    if (allAuctions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateInitialTimeLeft(allAuctions));
    }, 1000);

    return () => clearInterval(timer);
  }, [allAuctions]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-10 shadow-2xl mt-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-600 text-white group-hover:scale-110 transition-transform duration-300 mr-4">
              <MdOutlineFeaturedPlayList className="w-6 h-6" />
            </span>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Featured Auctions
            </h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {allAuctions.slice(0, 9).map((auction, index) => (
          <Link
            key={auction._id}
            to={`/auction/item/${auction._id}`}
            className="group relative bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-600 dark:to-gray-800"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-300" />

            <div className="flex flex-col items-start gap-4 relative h-full">
              <div className="relative w-full overflow-hidden rounded-lg">
                <img
                  src={auction.image?.url}
                  alt={auction.title}
                  className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="p-3">
                    <h3 className="text-white text-lg font-semibold truncate px-2">
                      {auction.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full">
                {timeLeft[auction._id]?.end === "Ended" ? (
                  <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-r-lg text-red-700 dark:text-red-300 font-medium animate-pulse">
                    <div>
                      • Thank you for participating! Unfortunately, the auction
                      has ended, but we appreciate your interest.
                    </div>
                    <div>• Winner Determined</div>
                  </div>
                ) : timeLeft[auction._id]?.start === "Ended" ? (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-lg text-blue-700 dark:text-blue-300 font-medium animate-pulse">
                      <div>• Auction is currently ongoing!</div>
                      <div>• Place your bids now</div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                      <p>
                        <span className="font-semibold text-black dark:text-white">
                          Starting Bid:
                        </span>
                        <span className="text-green-600">
                          {" "}
                          ₹{auction.startingBid}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-black dark:text-white">
                          End Time:
                        </span>
                        <span className="dark:text-[#a7c7e7]">
                          {" "}
                          {new Date(auction.endTime).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-black dark:text-white">
                          Auction Closes In:
                        </span>
                        <span className="text-red-500">
                          {" "}
                          {timeLeft[auction._id]?.end}
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                    <p>
                      <span className="font-semibold text-black dark:text-white">
                        Starting Bid:
                      </span>
                      <span className="text-green-600">
                        {" "}
                        ₹{auction.startingBid}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-black dark:text-white">
                        Start Time:
                      </span>
                      <span className="dark:text-[#a7c7e7]">
                        {" "}
                        {new Date(auction.startTime).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-black dark:text-white">
                        Auction Begins In:
                      </span>
                      <span className="text-red-500">
                        {" "}
                        {timeLeft[auction._id]?.start}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-black dark:text-white">
                        End Time:
                      </span>
                      <span className="dark:text-[#a7c7e7]">
                        {" "}
                        {new Date(auction.endTime).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-black dark:text-white">
                        Auction Closes In:
                      </span>
                      <span className="text-red-500">
                        {" "}
                        {timeLeft[auction._id]?.end}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <span className="absolute top-0 right-0 text-4xl font-bold text-gray-200">
                {(index + 1).toString().padStart(2, "0")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedAuctions;
