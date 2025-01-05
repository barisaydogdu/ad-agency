import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Calculator,
    Users,
    Building2,
    Radio,
    Megaphone,
    UserCircle,
    Medal,
    ChevronRight,
    ArrowLeft,
} from 'lucide-react';

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    const roles = [
        {
            id: 'campaign_manager',
            title: 'Campaign Manager',
            icon: Briefcase,
            description: 'Manage campaigns, clients, staff, and advertisements',
            color: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600',
            modules: [
                {
                    title: 'Client Management',
                    icon: Building2,
                    description: 'Manage client information and relationships',
                    path: '/clients',
                    color: 'bg-indigo-500',
                },
                {
                    title: 'Staff',
                    icon: Users,
                    description: 'Oversee staff assignments and management',
                    path: '/staff',
                    color: 'bg-purple-500',
                },
                {
                    title: 'Campaigns',
                    icon: Megaphone,
                    description: 'Create and manage marketing campaigns',
                    path: '/campaigns',
                    color: 'bg-pink-500',
                },
                {
                    title: 'Advertisements',
                    icon: Radio,
                    description: 'Handle campaign advertisements',
                    path: '/adverts',
                    color: 'bg-rose-500',
                },
            ],
        },
        {
            id: 'accountant',
            title: 'Accountant',
            icon: Calculator,
            description: 'Manage staff grades and personnel information',
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            modules: [
                {
                    title: 'Staff Management',
                    icon: Users,
                    description: 'Manage employee information',
                    path: '/staff',
                    color: 'bg-emerald-500',
                },
                {
                    title: 'Staff Grades',
                    icon: Medal,
                    description: 'Handle staff grades and pay rates',
                    path: '/staff-grades',
                    color: 'bg-teal-500',
                },
            ],
        },
    ];

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId);
    };

    const handleBack = () => {
        setSelectedRole(null);
    };

    const handleModuleClick = (path) => {
        navigate(path);
    };

    if (!selectedRole) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="max-w-4xl w-full">
                        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            Select Your Role
                        </h1>
                        <div className="grid md:grid-cols-2 gap-6">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role.id)}
                                    className={`${role.color} text-white p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center text-center ${role.hoverColor} cursor-pointer`}
                                >
                                    <role.icon className="w-16 h-16 mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">{role.title}</h2>
                                    <p className="text-white/90">{role.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const selectedRoleData = roles.find((r) => r.id === selectedRole);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Role Selection
            </button>

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome, {selectedRoleData.title}
                </h1>
                <p className="text-gray-600 mb-8">Select a module to get started</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {selectedRoleData.modules.map((module, index) => (
                        <div
                            key={index}
                            className={`${module.color} group relative overflow-hidden text-white p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                            onClick={() => handleModuleClick(module.path)}
                        >
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 transform -skew-y-12 bg-white/10"></div>
                            </div>

                            <div className="relative z-10">
                                <module.icon className="w-12 h-12 mb-4" />
                                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                                <p className="text-white/90 mb-4">{module.description}</p>
                                <button className="inline-flex items-center text-white font-medium hover:underline">
                                    Access Module <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>

                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
