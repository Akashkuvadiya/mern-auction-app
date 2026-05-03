import { useState, useRef, useEffect } from "react";
import { createAuction } from "../store/slices/auctionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LiaFileUploadSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import {
  ChevronDown,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Custom DatePicker Component
const CustomDatePicker = ({
  selected,
  onChange,
  label,
  minDate,
  timeSelect = true,
  showTimeInput = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(selected || new Date());
  const [time, setTime] = useState({
    hours: selected ? selected.getHours() : 1, // Default to 1 AM
    minutes: selected ? selected.getMinutes() : 0,
    ampm: selected ? (selected.getHours() >= 12 ? "PM" : "AM") : "AM", // Default to AM
  });
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    const startingDay = firstDayOfMonth.getDay();

    const prevMonthLastDay = new Date(year, month, 0);
    for (let i = 0; i < startingDay; i++) {
      const prevDate = new Date(
        prevMonthLastDay.getFullYear(),
        prevMonthLastDay.getMonth(),
        prevMonthLastDay.getDate() - startingDay + i + 1
      );
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    const totalDays = days.length;
    const remainingDays = 42 - totalDays;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (!minDate || selectedDate >= today) {
      const selectedDateTime = new Date(date);
      let hours = Number.parseInt(time.hours);

      if (time.ampm === "PM" && hours !== 12) {
        hours += 12;
      } else if (time.ampm === "AM" && hours === 12) {
        hours = 0;
      }

      selectedDateTime.setHours(hours);
      selectedDateTime.setMinutes(Number.parseInt(time.minutes));
      selectedDateTime.setSeconds(0);
      selectedDateTime.setMilliseconds(0);

      onChange(selectedDateTime);
      setIsOpen(false);
    }
  };

  const handleTimeChange = (type, value) => {
    const newTime = { ...time, [type]: value };
    setTime(newTime);

    if (selected) {
      const newDate = new Date(selected);
      let hours = Number.parseInt(newTime.hours);

      if (newTime.ampm === "PM" && hours !== 12) {
        hours += 12;
      } else if (newTime.ampm === "AM" && hours === 12) {
        hours = 0;
      }

      newDate.setHours(hours);
      newDate.setMinutes(Number.parseInt(newTime.minutes));
      onChange(newDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Select Date";

    const baseFormat = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (timeSelect) {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${baseFormat}, ${displayHours}:${minutes} ${ampm}`;
    }

    return baseFormat;
  };

  return (
    <div className="relative w-full" ref={datePickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 cursor-pointer hover:border-blue-500 transition-all duration-200"
      >
        <span
          className={
            selected
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-500 dark:text-gray-400"
          }
        >
          {selected ? formatDate(selected) : "Select Date"}
        </span>
        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700">
            <button
              onClick={() => changeMonth(-1)}
              className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2 bg-gray-50 dark:bg-black">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 p-2">
            {generateCalendarDays().map(({ date, isCurrentMonth }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const currentDate = new Date(date);
              currentDate.setHours(0, 0, 0, 0);
              const isToday = currentDate.getTime() === today.getTime();
              const isSelected =
                selected &&
                currentDate.getTime() ===
                  new Date(selected).setHours(0, 0, 0, 0);
              const isDisabled =
                !isCurrentMonth ||
                (minDate &&
                  currentDate < new Date(minDate).setHours(0, 0, 0, 0));

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => selectDate(date)}
                  disabled={isDisabled}
                  className={`
                                        w-full p-2 text-sm rounded-lg transition-colors duration-200
                                        ${
                                          !isCurrentMonth
                                            ? "text-gray-300 dark:text-gray-600"
                                            : ""
                                        }
                                        ${
                                          isToday
                                            ? "border-2 border-blue-500"
                                            : ""
                                        }
                                        ${
                                          isSelected
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-blue-100 dark:hover:bg-gray-700"
                                        }
                                        ${
                                          isDisabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }
                                    `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {timeSelect && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700">
              <div className="flex items-center space-x-2">
                <select
                  value={time.hours}
                  onChange={(e) => handleTimeChange("hours", e.target.value)}
                  className="p-1 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span>:</span>
                <select
                  value={time.minutes}
                  onChange={(e) => handleTimeChange("minutes", e.target.value)}
                  className="p-1 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                  {/* {[...Array(4)].map((_, i) => (
                    <option key={i * 15} value={i * 15}>
                      {(i * 15).toString().padStart(2, "0")}
                    </option>
                  ))} */
                    [...Array(60)].map((_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))
                  }

                </select>
                <select
                  value={time.ampm}
                  onChange={(e) => handleTimeChange("ampm", e.target.value)}
                  className="p-1 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Custom Dropdown Component
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 cursor-pointer hover:border-blue-500 transition-all duration-200"
      >
        <span
          className={
            value
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-500 dark:text-gray-400"
          }
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between ${
                value === option ? "bg-blue-50 dark:bg-blue-900/30" : ""
              }`}
            >
              {option}
              {value === option && (
                <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main CreateAuction Component
const CreateAuction = () => {
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const auctionCategories = [
    "Electronics",
    "Furniture",
    "Art & Antiques",
    "Jewelry & Watches",
    "Automobiles",
    "Music",
    "Real Estate",
    "Collectibles",
    "Fashion & Accessories",
    "Sports Memorabilia",
    "Books & Manuscripts",
    "Other",
  ];

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(file);
        setImagePreview(reader.result);
      };
    }
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Auctioneer") {
      navigateTo("/");
    }
  }, [isAuthenticated, user, navigateTo]);

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    try {
      // Check for image specifically and show toast if missing
      if (!image) {
        toast.error("Auction item image required");
        return;
      }

      // Validate other inputs
      if (
        !title ||
        !description ||
        !category ||
        !condition ||
        !startingBid ||
        !startTime ||
        !endTime
      ) {
        throw new Error("Please fill in all fields");
      }

      // Validate end time is after start time
      if (endTime <= startTime) {
        throw new Error("End time must be after start time");
      }
      
      // Format the dates to the desired format
      const formatDateToIndianStandard = (date) => {
        // Format: Sun, Apr 06, 2025, 5:54:00 PM GMT+05:30 (Indian Standard Time)
        const formattedDate = date.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
          timeZoneName: 'short'
        });
        
        return formattedDate + " (Indian Standard Time)";
      };

      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("startingBid", startingBid);
      formData.append("startTime", formatDateToIndianStandard(startTime));
      formData.append("endTime", formatDateToIndianStandard(endTime));
      
      console.log("Creating auction with start time:", formatDateToIndianStandard(startTime));
      console.log("Creating auction with end time:", formatDateToIndianStandard(endTime));

      await dispatch(createAuction(formData));
      navigateTo("/create-auction");
    } catch (error) {
      console.error("Error creating auction:", error);
      toast.error(error.message || "Failed to create auction");
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="relative w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              Create Auction
            </h1>

            <form onSubmit={handleCreateAuction} className="space-y-6">
              {/* Basic Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Basic Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <CustomDropdown
                    options={auctionCategories}
                    value={category}
                    onChange={setCategory}
                    label="Category"
                    placeholder="Select Category"
                  />

                  <CustomDropdown
                    options={["New", "Used"]}
                    value={condition}
                    onChange={setCondition}
                    label="Condition"
                    placeholder="Select Condition"
                  />

                  <div className="space-y-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Starting Bid
                    </label>
                    <input
                      type="number"
                      value={startingBid}
                      onChange={(e) => setStartingBid(e.target.value)}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Time Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Auction Timeline
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomDatePicker
                    selected={startTime}
                    onChange={setStartTime}
                    label="Start Time"
                    minDate={new Date()}
                  />

                  <CustomDatePicker
                    selected={endTime}
                    onChange={setEndTime}
                    label="End Time"
                    minDate={startTime || new Date()}
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Item Image
                </h2>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt={title}
                          className="w-44 h-auto rounded-lg object-cover max-h-48"
                        />
                      ) : (
                        <>
                          <LiaFileUploadSolid className="w-12 h-12 mb-4 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={imageHandler}
                      accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-24 py-3 text-black bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 hover:from-gray-500 hover:via-gray-300 hover:to-gray-400 border-gray-400 border-2 dark:from-blue-800 dark:via-blue-600 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:via-blue-600 dark:hover:to-blue-800 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2" />
                      Creating Auction...
                    </div>
                  ) : (
                    "Create Auction"
                  )}
                </button>
              </div>
            </form>

            {/* Decorative line */}
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

export default CreateAuction;
