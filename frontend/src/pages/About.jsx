import React from 'react';
import AuctionImage from "../assets/Images/Auction.jpg";

const About = () => {
    const values = [
        {
            id: 1,
            title: "Integrity",
            description: "We prioritize honesty and transparency in all our dealings, ensuring a fair and ethical auction experience for everyone.",
            icon: "🤝"
        },
        {
            id: 2,
            title: "Innovation",
            description: "We continually enhance our platform with cutting-edge technology and features to provide users with a seamless and efficient auction process.",
            icon: "💡"
        },
        {
            id: 3,
            title: "Community",
            description: "We foster a vibrant community of buyers and sellers who share a passion for finding and offering exceptional items.",
            icon: "👥"
        },
        {
            id: 4,
            title: "Customer Focus",
            description: "We are committed to providing exceptional customer support and resources to help users navigate the auction process with ease.",
            icon: "⭐"
        },
    ];

    return (
        <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
            <div className="max-w-[83rem] mx-auto px-6 lg:pl-[320px] lg:mt-0 sm:mt-6">
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)]">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-300/20 to-emerald-300/20 rounded-full blur-2xl" />

                    {/* Header Section */}
                    <div className="relative">
                        <img
                            src={AuctionImage}
                            alt="PrimeBid Logo"
                            className="mx-auto mb-6 w-24 h-24 rounded-full 
                            shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)] dark:shadow-[5px_5px_20px_rgba(255,255,255,0.1),-5px_5px_20px_rgba(255,255,255,0.1),0_5px_20px_rgba(255,255,255,0.1)]"
                        />
                        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            About Us
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-justify">
                            Welcome to PrimeBid, the ultimate destination for online auctions
                            and bidding excitement. Founded in 2026, we are dedicated to
                            providing a dynamic and user-friendly platform for buyers and
                            sellers to connect, explore, and transact in a secure and seamless
                            environment.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                            Our Mission
                        </h3>
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                                At PrimeBid, our mission is to revolutionize the way people buy and
                                sell items online. We strive to create an engaging and trustworthy
                                marketplace that empowers individuals and businesses to discover
                                unique products, make informed decisions, and enjoy the thrill of
                                competitive bidding.
                            </p>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                            Our Values
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 text-justify">
                            {values.map((element) => (
                                <div
                                    key={element.id}
                                    className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-[5px_5px_20px_rgba(0,0,0,0.4),-5px_5px_20px_rgba(0,0,0,0.4),0_5px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[5px_5px_20px_rgba(255,255,255,0.2),-5px_5px_20px_rgba(255,255,255,0.2),0_5px_20px_rgba(255,255,255,0.2)] transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-gradient-to-r dark:from-gray-600 dark:to-gray-800"
                                >
                                    <div className="flex items-center mb-4">
                                        <span className="text-3xl mr-4">{element.icon}</span>
                                        <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                            {element.title}
                                        </h4>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {element.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Story Section */}
                    <div className="mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                            Our Story
                        </h3>
                        <div className="relative overflow-hidden rounded-xl">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                                Founded by SoftTech., PrimeBid was born out of a passion for
                                connecting people with unique and valuable items. With years of
                                experience in the auction industry, our team is committed to
                                creating a platform that offers an unparalleled auction experience
                                for users worldwide.
                            </p>
                        </div>
                    </div>

                    {/* Join Us Section */}
                    <div className="mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                            Join Us
                        </h3>
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-justify">
                                Whether you're looking to buy, sell, or simply explore, PrimeBid
                                invites you to join our growing community of auction enthusiasts.
                                Discover new opportunities, uncover hidden gems, and experience the
                                thrill of winning your next great find.
                            </p>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div className="text-center">
                        <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Thank you for choosing PrimeBid. We look forward to being a part of
                            your auction journey!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;