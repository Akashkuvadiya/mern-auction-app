import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdTimer } from "react-icons/md";
import { GavelIcon, Calendar, Clock, Tag } from "lucide-react";

const calculateTimeLeft = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    const difference = start - now;
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return {
        timeString: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        status: "upcoming",
        remainingMs: difference,
      };
    }
  } else if (now >= start && now < end) {
    const difference = end - now;
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return {
        timeString: `${days}d ${hours}h ${minutes}m ${seconds}s`,
        status: "ongoing",
        remainingMs: difference,
      };
    }
  }

  const timeSinceEnd = now - end;
  const minutesSinceEnd = Math.floor(timeSinceEnd / (1000 * 60));
  const hoursSinceEnd = Math.floor(timeSinceEnd / (1000 * 60 * 60));

  let recentEndText = "Recently Ended";
  if (minutesSinceEnd < 60) {
    recentEndText = `Ended ${minutesSinceEnd} minutes ago`;
  } else if (hoursSinceEnd < 24) {
    recentEndText = `Ended ${hoursSinceEnd} hours ago`;
  }

  return {
    timeString: recentEndText,
    status: "ended",
    remainingMs: Infinity,
  };
};

const UpcomingAuctions = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const [activeFilter, setActiveFilter] = useState("today");
  const [timeLeft, setTimeLeft] = useState({});
  const [displayedAuctions, setDisplayedAuctions] = useState([]);

  const filterAndSortAuctions = (auctions, filterType) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let filtered = [];

    if (filterType === "today") {
      filtered = auctions.filter((item) => {
        const startDate = new Date(item.startTime);
        const endDate = new Date(item.endTime);

        const startsToday = startDate >= today && startDate < tomorrow;
        const isOngoing = now >= startDate && now < endDate;
        const endsToday = endDate >= today && endDate < tomorrow;

        return startsToday || isOngoing || endsToday;
      });
    } else if (filterType === "upcoming") {
      filtered = auctions.filter((item) => {
        const startDate = new Date(item.startTime);
        return startDate > now;
      });
    }

    // Calculate time left for sorting
    const withTimes = filtered.map((auction) => ({
      ...auction,
      timeRemaining: calculateTimeLeft(auction.startTime, auction.endTime)
        .remainingMs,
    }));

    // Sort by remaining time
    return withTimes.sort((a, b) => a.timeRemaining - b.timeRemaining);
  };

  // Effect for initial filtering and filter changes
  useEffect(() => {
    const filtered = filterAndSortAuctions(allAuctions, activeFilter);
    setDisplayedAuctions(filtered);
  }, [activeFilter, allAuctions]);

  // Effect for time updates
  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeftObj = {};
      displayedAuctions.forEach((auction) => {
        timeLeftObj[auction._id] = calculateTimeLeft(
          auction.startTime,
          auction.endTime
        );
      });
      setTimeLeft(timeLeftObj);

      // Re-sort auctions based on updated times
      const updatedAuctions = filterAndSortAuctions(allAuctions, activeFilter);
      setDisplayedAuctions(updatedAuctions);
    }, 1000);

    return () => clearInterval(timer);
  }, [displayedAuctions, activeFilter, allAuctions]);

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    const filtered = filterAndSortAuctions(allAuctions, newFilter);
    setDisplayedAuctions(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-10 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-200 via-cyan-400 to-cyan-600 text-white group-hover:scale-110 transition-transform duration-300 mr-4">
              <GavelIcon />
            </span>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Bidders' Corner
            </h2>
          </div>
          <div className="flex space-x-2 p-1">
            {["today", "upcoming"].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`
                                    px-6 py-2 rounded-full text-sm font-semibold 
                                    transition-all duration-300 ease-in-out 
                                    transform hover:scale-105 focus:outline-none 
                                    focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-700
                                    ${
                                      activeFilter === filter
                                        ? "bg-gradient-to-br from-purple-300 via-indigo-300 to-pink-300 text-black shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30"
                                        : "text-gray-600 dark:text-gray-300 " +
                                          "bg-gradient-to-br from-emerald-100/50 via-teal-100/30 to-cyan-100/50 " +
                                          "dark:from-emerald-900/50 dark:via-teal-900/30 dark:to-cyan-900/50 " +
                                          "hover:from-gray-200 hover:to-gray-300 " +
                                          "dark:hover:from-gray-700 dark:hover:to-gray-600 " +
                                          "hover:text-gray-800 dark:hover:text-gray-100"
                                    }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedAuctions.slice(0, 9).map((auction) => (
          <div
            key={auction._id}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
          >
            <div className="absolute top-4 right-4 z-10">
              <div
                className={`flex items-center rounded-full px-3 py-1 ${
                  timeLeft[auction._id]?.status === "ended"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                }`}
              >
                <MdTimer className="mr-2" />
                <span className="text-sm font-semibold">
                  {timeLeft[auction._id]?.timeString}
                </span>
              </div>
            </div>

            <div className="relative h-48 w-full">
              <img
                src={auction.image?.url}
                alt={auction.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-xl font-bold text-white truncate">
                  {auction.title}
                </h3>
              </div>
            </div>

            {timeLeft[auction._id]?.status === "ended" ? (
              <div className="flex-1 p-6 bg-orange-50 dark:bg-orange-900/30 flex flex-col justify-center min-h-[120px]">
                <p className="text-center text-xl font-bold text-orange-600 dark:text-orange-400">
                  Recently Ended
                </p>
                <p className="text-center text-sm text-orange-500 dark:text-orange-300 mt-2">
                  Final Price: ₹{auction.currentBid || auction.startingBid}
                </p>
              </div>
            ) : (
              <div className="flex-1 p-6 bg-gradient-to-br from-emerald-50 via-cyan-100 to-blue-100 dark:from-emerald-900/30 dark:via-cyan-900/30 dark:to-blue-900/30 shadow-inner min-h-[120px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Tag className="mr-2 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300 mr-2">
                      Starting Bid:
                    </span>
                    <span className="text-green-600 font-bold">
                      ₹{auction.startingBid}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="mr-2 text-blue-500" />
                  <span className="mr-2">
                    {timeLeft[auction._id]?.status === "upcoming"
                      ? "Begins:"
                      : "Ends:"}
                  </span>
                  <span>
                    {timeLeft[auction._id]?.status === "upcoming"
                      ? new Date(auction.startTime).toLocaleString()
                      : new Date(auction.endTime).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAuctions;
