import React, { useState } from 'react';
import {
    Users,
    Medal,
    UserCircle,
    UserCog,
    Megaphone,
    Radio,
    ArrowRight,
    Building2,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate(); // useNavigate hook'unu tanımlıyoruz
    const [activeSection, setActiveSection] = useState(0);

    const modules = [
        {
            title: "Client Management",
            icon: Building2,
            description: "Start by managing your client portfolio",
            color: "bg-blue-500",
            textColor: "text-blue-500",
            route: "/clients"
        },
        {
            title: "Staff Grades",
            icon: Medal,
            description: "Define staff grades and hierarchies",
            color: "bg-purple-500",
            textColor: "text-purple-500",
            route: "/staff-grades"
        },
        {
            title: "Staff Management",
            icon: Users,
            description: "Manage your team members",
            color: "bg-green-500",
            textColor: "text-green-500",
            route: "/staff"
        },
        {
            title: "Campaign Managers",
            icon: UserCog,
            description: "Assign campaign leadership",
            color: "bg-orange-500",
            textColor: "text-orange-500",
            route: "/campaign-managers"
        },
        {
            title: "Campaigns",
            icon: Megaphone,
            description: "Create and track marketing campaigns",
            color: "bg-red-500",
            textColor: "text-red-500",
            route: "/campaigns"
        },
        {
            title: "Adverts",
            icon: Radio,
            description: "Manage campaign advertisements",
            color: "bg-teal-500",
            textColor: "text-teal-500",
            route: "/adverts"
        }
    ];

    // Yönlendirme fonksiyonu
    const handleNavigation = (route) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                            Welcome to Campaign Management System
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 animate-fade-in-delay">
                            A comprehensive solution for managing your marketing operations
                        </p>
                        <button
                            onClick={() => navigate("/role")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-lg relative overflow-hidden group">
                            Get Started
                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Module Flow Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Your Journey Starts Here
                    </h2>
                    <p className="text-gray-600">
                        Follow our recommended setup flow for optimal results
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 ${
                                activeSection === index ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onMouseEnter={() => setActiveSection(index)}
                        >
                            <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                <module.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {module.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {module.description}
                            </p>
                            <button
                                onClick={() => handleNavigation(module.route)}
                                className={`flex items-center ${module.textColor} font-medium`}
                            >
                                Get Started <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>


            {/* Process Flow */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
                        Setup Process Flow
                    </h2>
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
                        <div className="relative flex justify-between">
                            {modules.map((module, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className={`${module.color} w-12 h-12 rounded-full flex items-center justify-center mb-4 relative z-10`}>
                                        <module.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 text-center w-24">
                    {module.title}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-blue-100 mb-8">
                        Begin with client management and work your way through our intuitive system
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all transform hover:scale-105 inline-flex items-center">
                        Start Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>© 2024 Campaign Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;