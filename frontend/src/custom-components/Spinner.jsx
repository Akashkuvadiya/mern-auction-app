import React, { useState, useEffect } from "react";

const Spinner = () => {
    const [zoomingIn, setZoomingIn] = useState(true); // State to manage zoom direction

    useEffect(() => {
        const interval = setInterval(() => {
            setZoomingIn(prev => !prev); // Toggle zooming state
        }, 1500); // Zoom every 3 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative animate-zoom-container">
                <div className="relative w-32 h-32">
                    <div
                        className={`absolute inset-0 w-[8rem] h-[8rem] border-8 rounded-full animate-spin-with-pause
                            ${zoomingIn ? "border-t-transparent border-l-blue-300 border-r-blue-500 border-b-blue-400 dark:border-l-indigo-300 dark:border-r-indigo-500 dark:border-b-indigo-400" : "border-t-transparent border-l-[#185D72] border-r-[#0E98BA] border-b-[#11728C] dark:border-l-[#36B15F] dark:border-r-green-300 dark:border-b-[#50C878]"}`}
                    ></div>

                    <div
                        className={`absolute inset-5 w-[5.5rem] h-[5.5rem] border-8 rounded-full animate-spin-reverse-with-pause
                            ${zoomingIn ? "border-t-transparent border-l-blue-300 border-r-blue-500 border-b-blue-400 dark:border-l-indigo-300 dark:border-r-indigo-500 dark:border-b-indigo-400" : "border-t-transparent border-l-[#185D72] border-r-[#0E98BA] border-b-[#11728C] dark:border-l-[#36B15F] dark:border-r-green-300 dark:border-b-[#50C878]"}`}
                    ></div>

                    <div
                        className={`absolute inset-10 w-[3rem] h-[3rem] border-8 rounded-full animate-spin-with-pause
                            ${zoomingIn ? "border-t-transparent border-l-blue-300 border-r-blue-500 border-b-blue-400 dark:border-l-indigo-300 dark:border-r-indigo-500 dark:border-b-indigo-400" : "border-t-transparent border-l-[#185D72] border-r-[#0E98BA] border-b-[#11728C] dark:border-l-[#36B15F] dark:border-r-green-300 dark:border-b-[#50C878]"}`}
                    ></div>
                </div>
            </div>

            <style>
                {`
                @keyframes spin-reverse {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }

                @keyframes spin-with-pause {
                    0% { transform: rotate(0deg); }
                    90% { transform: rotate(360deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes zoom-in-out {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }

                .animate-spin-reverse {
                    animation: spin-reverse 1.5s linear infinite;
                }

                .animate-spin-with-pause {
                    animation: spin-with-pause 1.5s linear infinite;
                }

                .animate-spin-reverse-with-pause {
                    animation: spin-with-pause 1.5s linear infinite reverse;
                }

                .animate-zoom-container {
                    animation: zoom-in-out 3s ease-in-out infinite;
                }
                `}
            </style>
        </div>
    );
};

export default Spinner;
