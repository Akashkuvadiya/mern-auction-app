import {
  deletePaymentProof,
  updatePaymentProof,
} from "../../../store/slices/superAdminSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userId }) => {
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
              Delete Payment Proof
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete payment proof for user "{userId}
                "? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
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

const PaymentProofs = () => {
  const { paymentProofs } = useSelector((state) => state.superAdmin);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const dispatch = useDispatch();

  const handleDeleteClick = (id, userId) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deletePaymentProof(selectedDeleteId));
    setShowDeleteModal(false);
    setSelectedDeleteId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedDeleteId(null);
  };

  const handleFetchPaymentDetail = (element) => {
    setSelectedPaymentProof(element);
    setOpenDrawer(true);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl bg-gray-50 dark:bg-gray-800">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500">
            <tr>
              <th className="py-3 px-6 text-left text-white font-semibold">
                User ID
              </th>
              <th className="py-3 px-6 text-left text-white font-semibold">
                Status
              </th>
              <th className="py-3 px-6 text-left text-white font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-200">
                    {element.userId}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        element.status === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : element.status === "Rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          : element.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                      }`}
                    >
                      {element.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleFetchPaymentDetail(element)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-[10px] transition-all duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(element._id, element.userId)
                        }
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-[10px] transition-all duration-200"
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
                  No payment proofs found
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
        userId={paymentProofs.find((p) => p._id === selectedDeleteId)?.userId}
      />

      {/* Update Drawer */}
      {openDrawer && (
        <Drawer
          setOpenDrawer={setOpenDrawer}
          openDrawer={openDrawer}
          singlePaymentProof={selectedPaymentProof}
        />
      )}
    </>
  );
};

export const Drawer = ({ setOpenDrawer, openDrawer, singlePaymentProof }) => {
  const { loading } = useSelector((state) => state.superAdmin);
  const [amount, setAmount] = useState(singlePaymentProof?.amount || "");
  const [status, setStatus] = useState(singlePaymentProof?.status || "");
  const dispatch = useDispatch();

  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
    setOpenDrawer(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={() => setOpenDrawer(false)}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl rounded-l-3xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Update Payment Proof
                </h2>
              </div>

              <div className="mt-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={singlePaymentProof?.userId || ""}
                      disabled
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Settled">Settled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comment
                    </label>
                    <textarea
                      rows={3}
                      value={singlePaymentProof?.comment || ""}
                      disabled
                      className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <Link
                      to={singlePaymentProof?.proof?.url || ""}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      target="_blank"
                    >
                      View Payment Proof
                    </Link>
                    <button
                      type="button"
                      onClick={handlePaymentProofUpdate}
                      disabled={loading}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      {loading ? "Updating..." : "Update Payment Proof"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProofs;
