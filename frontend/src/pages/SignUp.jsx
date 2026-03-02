import { register } from "../store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LiaFileUploadSolid } from "react-icons/lia";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [razorpayAccountNumber, setRazorpayAccountNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("profileImage", profileImage);
    role === "Auctioneer" &&
      (formData.append("bankAccountName", bankAccountName),
        formData.append("bankAccountNumber", bankAccountNumber),
        formData.append("bankName", bankName),
        formData.append("razorpayAccountNumber", razorpayAccountNumber),
        formData.append("paypalEmail", paypalEmail));
    dispatch(register(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, loading, isAuthenticated]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
  };

  return (
    <>
      <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="relative w-full max-w-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative">
              <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                Register
              </h1>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Personal Details Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Personal Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Phone
                      </label>
                      <input
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="" disabled hidden>
                          Select Role
                        </option>
                        <option
                          value="Auctioneer"
                          className="bg-gray-100 dark:bg-gray-700"
                        >
                          Auctioneer
                        </option>
                        <option
                          value="Bidder"
                          className="bg-gray-100 dark:bg-gray-700"
                        >
                          Bidder
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Profile Image Section */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Profile Image
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={profileImagePreview || "/imageHolder.jpg"}
                        alt="profileImagePreview"
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      />
                      <div className="relative flex items-center gap-2">
                        <label
                          htmlFor="fileUpload"
                          className="inline-flex items-center px-4 py-1  text-black  bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2 dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] dark:text-white font-medium rounded-[5px] cursor-pointer transition-all duration-200"
                        >
                          <LiaFileUploadSolid className="w-5 h-5 mr-2" />
                          {profileImage ? profileImage.name : "Choose File"}
                        </label>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {profileImage ? "" : "No file chosen"}
                        </span>
                        <input
                          id="fileUpload"
                          type="file"
                          onChange={imageHandler}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details Section */}
                {role === "Auctioneer" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Payment Details
                    </h2>

                    {/* Bank Details */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Bank Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="" disabled hidden>
                            Select Your Bank
                          </option>
                          <option
                            value="SBI"
                            className="bg-gray-100 dark:bg-gray-700"
                          >
                            SBI
                          </option>
                          <option
                            value="Bank of India"
                            className="bg-gray-100 dark:bg-gray-700"
                          >
                            Bank of India
                          </option>
                          <option
                            value="ICICI Bank"
                            className="bg-gray-100 dark:bg-gray-700"
                          >
                            ICICI Bank
                          </option>
                          <option
                            value="HDFC Bank"
                            className="bg-gray-100 dark:bg-gray-700"
                          >
                            HDFC Bank
                          </option>
                          <option
                            value="Axis Bank"
                            className="bg-gray-100 dark:bg-gray-700"
                          >
                            Axis Bank
                          </option>
                        </select>
                        <input
                          type="text"
                          value={bankAccountNumber}
                          placeholder="IFSC"
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="text"
                          value={bankAccountName}
                          placeholder="Bank Account Username"
                          onChange={(e) => setBankAccountName(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Digital Payment Details */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Digital Payment Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="number"
                          value={razorpayAccountNumber}
                          placeholder="Razorpay Account Number"
                          onChange={(e) =>
                            setRazorpayAccountNumber(e.target.value)
                          }
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="email"
                          value={paypalEmail}
                          placeholder="PayPal Email"
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="px-24 py-3 text-black  bg-gradient-to-r from-[#83888d] via-[#d1d5db] to-[#6b7280]
                                        hover:bg-gradient-to-r hover:from-[#6b7280] hover:via-[#d1d5db] hover:to-[#83888d]  border-[#9CA3AF] border-2 dark:from-[#1E3A8A] dark:via-[#3B82F6] dark:to-[#10B981]
                                        dark:hover:from-[#10B981] dark:hover:via-[#3B82F6] 
                                        dark:hover:to-[#1E3A8A] dark:text-white  font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                        Registering...
                      </div>
                    ) : (
                      "Register"
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
  );
};

export default SignUp;
