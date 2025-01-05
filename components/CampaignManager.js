import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, X, Search } from 'lucide-react';

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Button = ({ children, variant = 'primary', ...props }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center gap-2";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]}`} {...props}>
            {children}
        </button>
    );
};

const CampaignManagerApp = () => {
    const [managers, setManagers] = useState([]);
    const [staff, setStaff] = useState([]); // For staff selection dropdown
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);
    const [formData, setFormData] = useState({
        staff_id: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:8000';

    // Fetch both managers and staff data
    useEffect(() => {
        fetchManagers();
        fetchStaff();
    }, []);

    const fetchManagers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/campaign-manager`);
            const data = await response.json();
            setManagers(data || []);
        } catch (err) {
            console.error('Error fetching managers:', err);
            setError('Failed to fetch campaign managers');
            setManagers([]);
        }
        setLoading(false);
    };

    const fetchStaff = async () => {
        try {
            const response = await fetch(`${API_URL}/staff`);
            const data = await response.json();
            setStaff(data || []);
        } catch (err) {
            console.error('Error fetching staff:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddManager = async () => {
        try {
            // Convert staff_id to integer before sending
            const dataToSend = {
                staff_id: parseInt(formData.staff_id, 10)
            };

            const response = await fetch(`${API_URL}/campaign-manager`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                setSuccess('Campaign manager added successfully');
                setIsAddModalOpen(false);
                setFormData({ staff_id: '' });
                fetchManagers();
            } else {
                setError('Failed to add campaign manager');
            }
        } catch (err) {
            setError('Failed to add campaign manager');
        }
    };

    const handleDeleteManager = async (managerId) => {
        if (!window.confirm('Are you sure you want to remove this campaign manager?')) return;

        try {
            const response = await fetch(`${API_URL}/campaign-manager/${managerId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Campaign manager removed successfully');
                fetchManagers();
            } else {
                setError('Failed to remove campaign manager');
            }
        } catch (err) {
            setError('Failed to remove campaign manager');
        }
    };

    // Filter managers based on search term
    const filteredManagers = managers.filter(manager => {
        const staffMember = staff.find(s => s.staff_id === manager.staff_id);
        return staffMember && staffMember.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Campaign Manager Management</h1>
                            <p className="mt-1 text-sm text-gray-500">Assign and manage campaign managers</p>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <PlusCircle className="w-5 h-5" />
                            Add New Manager
                        </Button>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <X className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search managers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Manager ID</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                                    <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {filteredManagers.map((manager) => {
                                    const staffMember = staff.find(s => s.staff_id === manager.staff_id);
                                    return (
                                        <tr key={manager.manager_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900">{manager.manager_id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {staffMember ? staffMember.name : 'Unknown Staff'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDeleteManager(manager.manager_id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            {managers.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-sm">No campaign managers found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <Modal
                show={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Campaign Manager"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff</label>
                        <select
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a staff member</option>
                            {staff.map((staffMember) => (
                                <option key={staffMember.staff_id} value={staffMember.staff_id}>
                                    {staffMember.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddManager}>
                            Add Manager
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CampaignManagerApp;