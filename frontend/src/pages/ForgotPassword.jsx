// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { FaEnvelope } from "react-icons/fa";
// import { toast } from "react-toastify";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:4000/api/v1/user/forgot-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Password reset link sent to your email");
//       } else {
//         toast.error(data.message || "Failed to send reset link");
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
//       <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] flex items-center justify-center min-h-[calc(100vh-6rem)]">
//         <div className="relative w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
//           {/* Decorative elements */}
//           <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-3xl" />

//           {/* Content */}
//           <div className="relative">
//             <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
//               Forgot Password
//             </h1>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaEnvelope className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   required
//                 />
//               </div>

//               <div className="flex justify-center">
//                 <button
//                   type="submit"
//                   className="px-24 py-3 text-black bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
//                     hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d] border-[#9CA3AF] border-2
//                     dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
//                     dark:hover:from-[#10B981] dark:hover:via-[#3B82F6]
//                     dark:hover:to-[#1E3A8A] dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
//                       Sending...
//                     </div>
//                   ) : (
//                     "Send Reset Link"
//                   )}
//                 </button>
//               </div>
//             </form>

//             {/* Decorative line */}
//             <div className="mt-2 text-center">
//               <div className="inline-block">
//                 <div className="h-1 w-12 bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280] dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981] rounded-full mx-auto" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ForgotPassword;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/forgot-password",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage({
        text:
          response.data.message ||
          "Password reset link has been sent to your email!",
        type: "success",
      });

      // Redirect after a delay
      setTimeout(() => {
        navigateTo("/login");
      }, 5000);
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="relative w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative">
            <Link
              to="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" /> Back to Login
            </Link>

            <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              Forgot Password
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-24 py-3 text-black bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                            hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d] border-[#9CA3AF] border-2
                            dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                            dark:hover:from-[#10B981] dark:hover:via-[#3B82F6]
                            dark:hover:to-[#1E3A8A] dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>

            {/* Additional decorative element */}
            <div className="mt-2 text-center">
              <div className="inline-block">
                <div className="h-1 w-12 bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280] dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981] rounded-full mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
