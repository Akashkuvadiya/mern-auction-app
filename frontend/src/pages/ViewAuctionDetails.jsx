import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { RiAuctionFill } from "react-icons/ri";
import { getAuctionDetail } from "../store/slices/auctionSlice";
import Spinner from "../custom-components/Spinner";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id, dispatch, navigateTo]);

  const isAuctionActive =
    Date.now() >= new Date(auctionDetail.startTime) &&
    Date.now() <= new Date(auctionDetail.endTime);
  const isAuctionPending = Date.now() < new Date(auctionDetail.startTime);
  const isAuctionUpcoming = Date.now() < new Date(auctionDetail.startTime);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-8">
      <div className="max-w-full mx-auto px-6 lg:pl-[320px]">
        {/* Breadcrumb Navigation */}
        <div className="w-full mb-8">
          <div className="relative flex items-center">
            <div className="absolute h-1 w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent"></div>
            <div className="relative flex items-center space-x-2">
              <Link
                to="/"
                className="group flex items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl
                     p-2 hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <HiHome className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                <span
                  className="ml-2 font-medium bg-gradient-to-r from-blue-600 to-indigo-600
                           bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700"
                >
                  Home
                </span>
              </Link>

              <div className="w-8 h-8 flex items-center justify-center">
                <div
                  className="w-3 h-3 border-t-2 border-r-2 border-gray-300 dark:border-gray-600
                          transform rotate-45"
                ></div>
              </div>

              <Link
                to={user.role === "Bidder" ? "/winning-bids" : "/view-my-auctions"}
                className="group flex items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl
                     p-2 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <RiAuctionFill className="w-5 h-5 text-purple-500 group-hover:text-purple-600" />
                <span
                  className="ml-2 font-medium bg-gradient-to-r from-purple-600 to-pink-600
                           bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700"
                >
                  {user.role === "Bidder" ? "My Winning Bids" : "My Auctions"}
                </span>
              </Link>

              <div className="w-8 h-8 flex items-center justify-center">
                <div
                  className="w-3 h-3 border-t-2 border-r-2 border-gray-300 dark:border-gray-600
                          transform rotate-45"
                ></div>
              </div>

              <div className="flex items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2">
                <div className="max-w-[200px]">
                  <p className="font-medium text-gray-600 dark:text-gray-300 truncate">
                    {auctionDetail.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Item Details Section */}
            <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-8 shadow-xl overflow-hidden">
              <div
                className="flex flex-col gap-6 h-[calc(100vh-200px)] overflow-y-auto pr-4
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-gray-100
                dark:[&::-webkit-scrollbar-track]:bg-gray-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
                [&::-webkit-scrollbar-thumb]:from-blue-500
                [&::-webkit-scrollbar-thumb]:to-purple-500
                [&::-webkit-scrollbar-thumb]:hover:from-blue-600
                [&::-webkit-scrollbar-thumb]:hover:to-purple-600
                [&::-webkit-scrollbar-thumb]:border-2
                [&::-webkit-scrollbar-thumb]:border-white
                dark:[&::-webkit-scrollbar-thumb]:border-gray-800"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="rounded-xl p-4 flex items-center justify-center w-full md:w-[80%] mx-auto">
                    <img
                      src={auctionDetail.image?.url || "/placeholder.svg"}
                      alt={auctionDetail.title}
                      className="max-w-full max-h-full object-contain rounded-[10px] ring-2 ring-offset-2 ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {auctionDetail.title}
                  </h1>
                  <div className="space-y-2">
                    <p className="text-xl">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Condition:{" "}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                        {auctionDetail.condition}
                      </span>
                    </p>

                    <p className="text-xl">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Category:{" "}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                        {auctionDetail.category}
                      </span>
                    </p>

                    <p className="text-xl">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Starting Bid:{" "}
                      </span>
                      <span className="text-green-600 dark:text-green-300 font-semibold">
                        $ {auctionDetail.startingBid}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Description
                  </h2>
                  <hr className="border-1 border-gray-400 dark:border-gray-600" />
                  <div className="space-y-2">
                    {auctionDetail.description
                      ?.split(". ")
                      .map((element, index) => (
                        <p
                          key={index}
                          className="text-gray-600 dark:text-gray-300 text-lg"
                        >
                          • {element}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Bidding Section */}
            <div className="space-y-6 h-[calc(100vh-200px)]">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-full">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Bidders</h2>
                  {isAuctionActive && (
                    <span className="text-xl font-semibold text-white">
                      Current Bid : $ {auctionDetail.currentBid}
                    </span>
                  )}
                </div>

                <div className="px-6 pt-4 pb-6 h-[calc(100%-80px)] flex flex-col justify-center">
                  {auctionBidders && isAuctionActive ? (
                    auctionBidders.length > 0 ? (
                      <div className="relative h-full">
                        <div className="space-y-3 overflow-y-auto pr-4 max-h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-blue-500 [&::-webkit-scrollbar-thumb]:to-purple-500 [&::-webkit-scrollbar-thumb]:hover:from-blue-600 [&::-webkit-scrollbar-thumb]:hover:to-purple-600 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-white dark:[&::-webkit-scrollbar-thumb]:border-gray-800">
                          {auctionBidders.map((bidder, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 transform hover:translate-x-1"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <img
                                    src={
                                      bidder.profileImage || "/placeholder.svg"
                                    }
                                    alt={bidder.userName}
                                    className="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-blue-500 object-cover transition-transform duration-300 hover:scale-105"
                                  />
                                  {index === 0 && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                                      <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {bidder.userName}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Bid Amount: $ {bidder.amount}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-semibold ${
                                  index === 0
                                    ? "bg-green-500"
                                    : index === 1
                                    ? "bg-blue-500"
                                    : index === 2
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                                }`}
                              >
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <img
                          src="/PlaceBid.avif"
                          alt="No bids"
                          className="w-32 h-32 mb-4 opacity-50"
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
                          No bids yet.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <img
                        src={
                          isAuctionUpcoming
                            ? "/notStarted.png"
                            : "/auctionEnded.png"
                        }
                        alt={
                          isAuctionUpcoming
                            ? "Auction not started"
                            : "Auction ended"
                        }
                        className="max-w-full max-h-[300px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewAuctionDetails;
