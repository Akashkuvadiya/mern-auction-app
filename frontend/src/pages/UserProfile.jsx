import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Wallet,
  Phone,
  MapPin,
  User,
  Mail,
  Building,
  UserCircle,
} from "lucide-react";
import { BiDetail } from "react-icons/bi";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-br border-gray-100 dark:border-gray-600 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900/40 dark:via-blue-600/40 dark:to-purple-400/40 rounded-t-xl">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div
    className={`p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-b-xl ${className}`}
  >
    {children}
  </div>
);

const Label = ({ children, className = "" }) => (
  <label
    className={`block text-sm font-medium text-gray-600 dark:text-gray-300 ${className}`}
  >
    {children}
  </label>
);

const Input = ({ value, className = "", ...props }) => (
  <input
    value={value}
    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
        rounded-[10px] text-gray-900 dark:text-gray-100 disabled:opacity-75 disabled:cursor-not-allowed 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
    {...props}
  />
);

const Badge = ({ children, className = "" }) => {
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
      case "auctioneer":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      case "bidder":
        return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <span
      className={`
            px-4 py-1.5 
            text-sm font-medium 
            rounded-full
            shadow-sm
            border-2
            backdrop-blur-sm
            ${getRoleColor(children)}
            ${className}
        `}
    >
      {children}
    </span>
  );
};

const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}
  ></div>
);

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  // Debug log when user data changes
  useEffect(() => {
    console.log("User data in component:", user);
    if (user?.role === "Auctioneer" && !user?.paymentMethods) {
      console.error("Auctioneer user missing paymentMethods:", user);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full min-h-screen p-6 lg:pl-[320px] pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-40 h-40 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  const InputField = ({ icon: Icon, label, value }) => (
    <div className="space-y-2.5">
      <Label className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        {label}
      </Label>
      <Input
        value={value}
        disabled
        className="bg-opacity-50 dark:bg-opacity-50"
      />
    </div>
  );

  return (
    <section className="w-full min-h-screen p-6 lg:pl-[320px] pt-14 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <img
                src={user.profileImage?.url}
                alt={user.userName}
                className="w-40 h-40 rounded-full object-cover ring-4 ring-blue-300 dark:ring-blue-500"
              />
              <Badge className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                {user.role}
              </Badge>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-6">
              {user.userName}
            </h2>
          </div>
        </div>

        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UserCircle className="w-6 h-6 text-blue-500" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField icon={User} label="Username" value={user.userName} />
            <InputField icon={Mail} label="Email" value={user.email} />
            <InputField icon={Phone} label="Phone" value={user.phone} />
            <InputField icon={MapPin} label="Address" value={user.address} />
            <InputField icon={Building} label="Role" value={user.role} />
            <InputField
              icon={Calendar}
              label="Joined On"
              value={user.createdAt?.substring(0, 10)}
            />
          </CardContent>
        </Card>

        

        {/* Payment Details for Auctioneer */}
        {user.role === "Auctioneer" && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Wallet className="w-6 h-6 text-green-500" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                icon={Building}
                label="Bank Name"
                value={user.paymentMethods?.bankTransfer?.bankName || "Not provided"}
              />
              <InputField
                icon={Wallet}
                label="Bank Account Number"
                value={user.paymentMethods?.bankTransfer?.bankAccountNumber || "Not provided"}
              />
              <InputField
                icon={User}
                label="Bank Account Name"
                value={user.paymentMethods?.bankTransfer?.bankAccountName || "Not provided"}
              />
              <InputField
                icon={Wallet}
                label="Razorpay Account Number"
                value={user.paymentMethods?.razorpay?.razorpayAccountNumber || "Not provided"}
              />
              <InputField
                icon={Mail}
                label="Paypal Email"
                value={user.paymentMethods?.paypal?.paypalEmail || "Not provided"}
              />
            </CardContent>
          </Card>
        )}

        {/* Other Details */}
        {user.role !== "Super Admin" && (
          <Card>
            <CardHeader>
              <CardTitle>
                <BiDetail className="w-6 h-6 text-purple-500" />
                Auxiliary Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.role === "Auctioneer" && (
                <InputField
                  icon={Wallet}
                  label="Unpaid Commissions"
                  value={user.unpaidCommission || 0}
                />
              )}
              {user.role === "Bidder" && (
                <>
                  <InputField
                    icon={Wallet}
                    label="Auctions Won"
                    value={user.auctionWon || 0}
                  />
                  <InputField
                    icon={Wallet}
                    label="Money Spent"
                    value={user.moneySpent || 0}
                  />
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default UserProfile;
