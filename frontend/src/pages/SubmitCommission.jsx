import { postCommissionProof } from '../store/slices/commissionSlice';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { LiaFileUploadSolid } from 'react-icons/lia';

const SubmitCommission = () => {
    const [proof, setProof] = useState("");
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");

    const proofHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProof(file);
        }
    };

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.commission);
    const handlePaymentProof = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("proof", proof);
        formData.append("amount", amount);
        formData.append("comment", comment);
        dispatch(postCommissionProof(formData));
    };

    return (
        <>
            <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
                <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] flex items-center justify-center min-h-[calc(100vh-6rem)] lg:mt-0 sm:mt-6">
                    <div className="relative w-full max-w-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-3xl" />

                        {/* Content */}
                        <div className="relative">
                            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                                Upload Payment Proof
                            </h1>

                            <form onSubmit={handlePaymentProof} className="space-y-6">
                                {/* Amount Input */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Payment Details</h2>

                                    <div className="space-y-1">
                                        <label className="text-sm text-gray-600 dark:text-gray-400">Amount</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Payment Proof Upload */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Payment Proof</h2>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 dark:text-gray-400">Screenshot</label>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={proof ? URL.createObjectURL(proof) : "/imageHolder.jpg"}
                                                alt="Payment Proof Preview"
                                                className="w-14 h-14 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
                                            />
                                            <div className="relative flex items-center gap-2">
                                                <label
                                                    htmlFor="fileUploadProof"
                                                    className="inline-flex items-center px-4 py-1  text-black  bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2  dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] dark:text-white font-medium rounded-[5px] cursor-pointer transition-all duration-200"
                                                >
                                                    <LiaFileUploadSolid className="w-5 h-5 mr-2" />
                                                    {proof ? proof.name : "Choose File"}
                                                </label>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {proof ? "" : "No file chosen"}
                                                </span>
                                                <input
                                                    id="fileUploadProof"
                                                    type="file"
                                                    onChange={proofHandler}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comment Section */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Additional Information</h2>

                                    <div className="space-y-1">
                                        <label className="text-sm text-gray-600 dark:text-gray-400">Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={4}
                                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        className="px-24 py-3  text-black  bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2  dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                                                Uploading...
                                            </div>
                                        ) : (
                                            "Upload Payment Proof"
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Decorative line */}
                            <div className="mt-2 text-center">
                                <div className="inline-block">
                                    <div className="h-1 w-12 bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]  dark:from-[#1E3A8A] dark:via-[#3B82F6]  dark:to-[#10B981] rounded-full mx-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SubmitCommission
