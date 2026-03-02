import { deleteAuctionItem } from "../../../store/slices/superAdminSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity rounded-[15px]" />
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all w-full max-w-md p-6">
          <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <FaExclamationTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-2">
              Delete Auction Item
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete "{itemTitle}"? This action
                cannot be undone.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-3 text-sm font-semibold text-white hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuctionItemDelete = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      dispatch(deleteAuctionItem(selectedItem._id));
    }
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl bg-gray-50 dark:bg-gray-800 mb-10">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500">
            <tr>
              <th className="py-3 px-6 text-left text-white font-semibold">
                Image
              </th>
              <th className="py-3 px-6 text-left text-white font-semibold">
                Title
              </th>
              <th className="py-3 px-6 text-left text-white font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {allAuctions.length > 0 ? (
              allAuctions.map((element) => (
                <tr
                  key={element._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <img
                      src={element.image?.url}
                      alt={element.title}
                      className="h-12 w-20 object-cover rounded-[5px] ring-2 ring-offset-2 ring-blue-500 shadow-md"
                    />
                  </td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-200">
                    {element.title}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <Link
                        to={`/auction/details/${element._id}`}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-[10px] transition-all duration-200"
                      >
                        View
                      </Link>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-[10px] transition-all duration-200"
                        onClick={() => handleDeleteClick(element)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="py-4 px-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No Auctions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemTitle={selectedItem?.title}
      />
    </>
  );
};

export default AuctionItemDelete;
