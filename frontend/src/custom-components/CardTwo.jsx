import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAuction, republishAuction } from "../store/slices/auctionSlice";
import {
  FaClock,
  FaTrash,
  FaEye,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  Calendar,
  Check,
  ChevronDown,
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
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [time, setTime] = useState({
    hours: selected ? selected.getHours() : 1,
    minutes: selected ? selected.getMinutes() : 0,
    ampm: selected ? (selected.getHours() >= 12 ? "PM" : "AM") : "AM",
  });
  const datePickerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const updateDropdownPosition = () => {
      if (datePickerRef.current && dropdownRef.current) {
        const inputRect = datePickerRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - inputRect.bottom;
        const spaceAbove = inputRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    if (isOpen) {
      updateDropdownPosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

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
      let selectedDateTime = new Date(date);
      let hours = parseInt(time.hours);

      if (time.ampm === "PM" && hours !== 12) {
        hours += 12;
      } else if (time.ampm === "AM" && hours === 12) {
        hours = 0;
      }

      selectedDateTime.setHours(hours);
      selectedDateTime.setMinutes(parseInt(time.minutes));
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
      let hours = parseInt(newTime.hours);

      if (newTime.ampm === "PM" && hours !== 12) {
        hours += 12;
      } else if (newTime.ampm === "AM" && hours === 12) {
        hours = 0;
      }

      newDate.setHours(hours);
      newDate.setMinutes(parseInt(newTime.minutes));
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
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            width: datePickerRef.current?.offsetWidth,
            left: datePickerRef.current?.getBoundingClientRect().left,
            ...(dropdownPosition === "top"
              ? {
                bottom:
                  window.innerHeight -
                  datePickerRef.current?.getBoundingClientRect().top,
              }
              : {
                top: datePickerRef.current?.getBoundingClientRect().bottom,
              }),
          }}
          className="z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden"
        >
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
              const cellDate = new Date(date);
              cellDate.setHours(0, 0, 0, 0);
              const isToday = cellDate.getTime() === today.getTime();
              const isSelected =
                selected &&
                cellDate.getTime() ===
                new Date(selected).setHours(0, 0, 0, 0);
              const isDisabled =
                !isCurrentMonth ||
                (minDate &&
                  cellDate < new Date(minDate).setHours(0, 0, 0, 0));

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => selectDate(date)}
                  disabled={isDisabled}
                  className={`
                    w-full p-2 text-sm rounded-lg transition-colors duration-200
                    ${!isCurrentMonth ? "text-gray-300 dark:text-gray-600" : ""}
                    ${isToday ? "border-2 border-blue-500" : ""}
                    ${isSelected
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100 dark:hover:bg-gray-700"
                    }
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
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
                  {[...Array(4)].map((_, i) => (
                    <option key={i * 15} value={i * 15}>
                      {(i * 15).toString().padStart(2, "0")}
                    </option>
                  ))}
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

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all w-full max-w-md p-6">
          <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <FaExclamationTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-2">
              Delete Auction
            </h3>
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete "{title}"? This action cannot be undone.
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

// Drawer Component with date formatting for MongoDB
const Drawer = ({ setOpenDrawer, openDrawer, id }) => {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const { loading } = useSelector((state) => state.auction);

  const formatDateForMongo = (date) => {
    if (!date) return "";
    
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

  const handleRepbulishAuction = () => {
    const formData = new FormData();
    formData.append("startTime", formatDateForMongo(startTime));
    formData.append("endTime", formatDateForMongo(endTime));
    dispatch(republishAuction(id, formData));
    setOpenDrawer(false);
  };

  return (
    <section
      className={`fixed ${openDrawer && id ? "bottom-0" : "-bottom-full"
        } left-0 w-full transition-all duration-300 h-full bg-black/50 backdrop-blur-sm flex items-end z-20`}
    >
      <div className="bg-[#e5e4e2] dark:bg-gray-800 h-fit transition-all duration-300 w-full rounded-t-3xl">
        <div className="w-full px-6 py-8 sm:max-w-[640px] sm:m-auto">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Republish Auction
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Republish this auction with the same details but new timing.
          </p>

          <form className="flex flex-col gap-5 mt-8">
            <div className="space-y-4">
              <CustomDatePicker
                selected={startTime}
                onChange={setStartTime}
                label="New Start Time"
                minDate={new Date()}
              />

              <CustomDatePicker
                selected={endTime}
                onChange={setEndTime}
                label="New End Time"
                minDate={startTime || new Date()}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                onClick={handleRepbulishAuction}
                disabled={!startTime || !endTime || loading}
              >
                {loading ? "Republishing..." : "Republish"}
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                onClick={() => setOpenDrawer(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// Main Card Component
const CardTwo = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDifference = new Date(startTime) - now;
    const endDifference = new Date(endTime) - now;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Starts In:",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      timeLeft = {
        type: "Ends In:",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `(${days} Days) ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteAuction(id));
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex-grow basis-full bg-white dark:bg-gray-800/50 rounded-3xl group hover:border-purple-500 dark:hover:border-purple-500/50 hover:shadow-purple-500/10 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="relative p-6">
          <div className="flex flex-col items-start gap-4 relative h-full">
            {/* Image Container */}
            <div className="group relative w-full overflow-hidden rounded-2xl aspect-video">
              <img
                src={imgSrc}
                alt={title}
                className="w-full h-full object-cover brightness-90 transition-all duration-500 group-hover:brightness-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-semibold line-clamp-2">
                    {title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Info Container */}
            <div className="w-full space-y-4">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 dark:text-gray-300">
                    Starting Bid
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    $ {startingBid}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    <FaClock className="inline mr-2" />
                    {timeLeft.type}
                  </span>
                  <span className="text-blue-500 font-semibold">
                    {Object.keys(timeLeft).length > 1
                      ? formatTimeLeft(timeLeft)
                      : "Time's up!"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to={`/auction/details/${id}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  <FaEye className="w-4 h-4" />
                  View Details
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300"
                >
                  <FaTrash className="w-4 h-4" />
                  Delete
                </button>
                <button
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 col-span-full"
                  disabled={new Date(endTime) > Date.now()}
                  onClick={() => setOpenDrawer(true)}
                >
                  <FaRedo className="w-4 h-4" />
                  Republish Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={title}
      />

      {/* Republish Drawer */}
      <Drawer id={id} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
};

export default CardTwo;
