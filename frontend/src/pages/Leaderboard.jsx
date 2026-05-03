import React from "react";
import { useSelector } from "react-redux";
import { Trophy, Crown, Award, Medal } from "lucide-react";
import Spinner from "../custom-components/Spinner";

const Leaderboard = () => {
  const { loading, leaderboard } = useSelector((state) => state.user);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="text-yellow-400 w-5 h-5" />;
      case 1:
        return <Medal className="text-indigo-400 w-5 h-5" />;
      case 2:
        return <Award className="text-rose-700 w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <section className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 lg:pl-[320px]">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Trophy className="text-yellow-500 w-12 h-12" />
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Bidders Leaderboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Top 100 Most Active Auction Participants
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-2xl">
            <table className="w-full bg-white dark:bg-gray-800">
              <thead className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">
                    Rank
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">
                    Profile
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">
                    Username
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">
                    Bid Expenditure
                  </th>
                  <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">
                    Auctions Won
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 100).map((element, index) => (
                  <tr
                    key={element._id}
                    className={`
                                            border-b border-gray-200 dark:border-gray-700 
                                            transition-all duration-300 
                                            hover:bg-blue-50 dark:hover:bg-gray-700
                                            ${
                                              index % 2 === 0
                                                ? "bg-white dark:bg-gray-800"
                                                : "bg-gray-50 dark:bg-gray-900/50"
                                            }
                                        `}
                  >
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`
                                                        w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm
                                                        ${
                                                          index === 0
                                                            ? "bg-yellow-400 text-white"
                                                            : index === 1
                                                            ? "bg-gray-300 text-gray-800"
                                                            : index === 2
                                                            ? "bg-yellow-700 text-white"
                                                            : "bg-blue-100 text-blue-800"
                                                        }
                                                    `}
                        >
                          {index + 1}
                        </div>
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <img
                        src={element.profileImage?.url}
                        alt={element.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 dark:border-purple-700"
                      />
                    </td>
                    <td className="py-2 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {element.userName}
                    </td>
                    <td className="py-2 px-4 text-green-600 dark:text-green-400 font-semibold">
                      $ {element.moneySpent.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-blue-600 dark:text-blue-400 font-semibold">
                      {element.auctionWon}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default Leaderboard;
