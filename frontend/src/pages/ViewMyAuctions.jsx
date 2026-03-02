import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdGavel } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import Spinner from "../custom-components/Spinner";
import { getMyAuctionItems } from "../store/slices/auctionSlice";
import CardTwo from "../custom-components/CardTwo"; // Using your enhanced CardTwo component

const ViewMyAuctions = () => {
  const { myAuctions, loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
    }
    dispatch(getMyAuctionItems());
  }, [dispatch, isAuthenticated, navigateTo, user?.role]);

  const activeAuctionsCount = myAuctions.filter((auction) => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);
    return now >= start && now <= end;
  }).length;

  return (
    <article className="min-h-screen w-full px-4 lg:px-8 py-8 lg:pl-[320px]">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 mr-4">
                  <MdGavel className="w-8 h-8" />
                </span>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    My Auctions
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Manage and track your auction listings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                  <FaFire className="w-4 h-4 mr-2" />
                  {activeAuctionsCount} Active Auctions
                </span>
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {myAuctions.length > 0 ? (
              myAuctions.map((auction) => (
                <CardTwo
                  key={auction._id}
                  id={auction._id}
                  title={auction.title}
                  startingBid={auction.startingBid}
                  endTime={auction.endTime}
                  startTime={auction.startTime}
                  imgSrc={auction.image?.url}
                />
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-blue-600 dark:text-blue-400 text-xl font-semibold">
                    No Auctions Found
                  </h3>
                  <p className="text-blue-600/80 dark:text-blue-400/80 mt-2">
                    You haven't posted any auctions yet. Start creating your
                    first auction listing!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default ViewMyAuctions;
