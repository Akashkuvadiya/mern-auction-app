import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Trophy, Medal, User } from "lucide-react";

const Leaderboard = () => {
  const { leaderboard } = useSelector((state) => state.user);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 shadow-2xl mt-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Trophy className="text-yellow-500 w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Top 10 Bidders
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Celebrating our most active auction participants
            </p>
          </div>
        </div>
        <Link
          to="/leaderboard"
          className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          <Medal className="mr-2" />
          Full Leaderboard
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mt-4">
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
                Total Spent
              </th>
              <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold">
                Auctions Won
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.slice(0, 10).map((user, index) => (
              <tr
                key={user._id}
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
                <td className="py-4 px-6">
                  <div
                    className={`
                                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
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
                </td>
                <td className="py-2 px-4">
                  <img
                    src={user.profileImage?.url}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 dark:border-purple-700"
                  />
                </td>
                <td className="py-2 px-4 font-medium text-gray-800 dark:text-gray-200">
                  {user.userName}
                </td>
                <td className="py-2 px-4 text-green-600 dark:text-green-400 font-semibold">
                  $ {user.moneySpent.toLocaleString()}
                </td>
                <td className="py-2 px-4 text-blue-600 dark:text-blue-400 font-semibold">
                  {user.auctionWon}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Leaderboard;
