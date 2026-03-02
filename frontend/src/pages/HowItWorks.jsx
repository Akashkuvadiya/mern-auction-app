import React from "react";
import WorkImage from "../assets/Images/Works.avif";
import {
    FaUser,
    FaGavel,
    FaEnvelope,
    FaDollarSign,
    FaFileInvoice,
    FaRedo,
} from "react-icons/fa";

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaUser />,
            title: "User Registration",
            description:
                "Users must register or log in to perform operations such as posting auctions, bidding on items, accessing the dashboard, and sending payment proof.",
        },
        {
            icon: <FaGavel />,
            title: "Role Selection",
            description:
                'Users can register as either a "Bidder" or "Auctioneer." Bidders can bid on items, while Auctioneers can post items.',
        },
        {
            icon: <FaEnvelope />,
            title: "Winning Bid Notification",
            description:
                "After winning an item, the highest bidder will receive an email with the Auctioneer's payment method information, including bank transfer, Easypaisa, and PayPal.",
        },
        {
            icon: <FaDollarSign />,
            title: "Commission Payment",
            description:
                "If the Bidder pays, the Auctioneer must pay 5% of that payment to the platform. Failure to pay results in being unable to post new items, and a legal notice will be sent.",
        },
        {
            icon: <FaFileInvoice />,
            title: "Proof of Payment",
            description:
                "The platform receives payment proof as a screenshot and the total amount sent. Once approved by the Administrator, the unpaid commission of the Auctioneer will be adjusted accordingly.",
        },
        {
            icon: <FaRedo />,
            title: "Reposting Items",
            description:
                "If the Bidder does not pay, the Auctioneer can republish the item without any additional cost.",
        },
    ];

    return (
        <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] lg:mt-0 sm:mt-6">
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-3xl" />

                    {/* Header Section with Background Image */}
                    <div className="relative mb-12">
                        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-8">
                            {/* Background Image */}
                            <img
                                src={WorkImage}
                                alt="Background"
                                className="absolute w-full h-full object-cover"
                            />
                            {/* Gradient Overlay - Light Mode */}
                            {/* Light Mode Overlay - More transparent */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/60 to-purple-600/60 dark:opacity-0" />

                            {/* Dark Mode Overlay - More transparent */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 opacity-0 dark:opacity-100" />

                            {/* Title Content */}
                            <div className="relative h-full flex flex-col items-center justify-center p-6">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text [text-shadow:_2px_2px_20px_rgb(255_255_255_/_20%)]">
                                    Discover How PrimeBid Operates
                                </h1>
                                <div className="w-24 h-1 bg-white/80 mx-auto rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="group relative bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[5px_5px_20px_rgba(255,255,255,0.2),-5px_5px_20px_rgba(255,255,255,0.2),0_5px_20px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-600 dark:to-gray-800"
                            >
                                {/* Step number */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-300" />

                                <div className="flex items-start gap-4 relative">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-xl">{step.icon}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Step number */}
                                    <span className="absolute top-0 right-0 text-4xl font-bold text-gray-200 dark:text-gray-600">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Section */}
                    <div className="mt-12 text-center">
                        <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl">
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Ready to start your auction journey? Join PrimeBid today and experience
                                the future of online auctions!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;