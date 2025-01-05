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

const StaffApp = () => {
    const [staff, setStaff] = useState([]);
    const [grades, setGrades] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        grade_id: '',
        start_date: new Date().toISOString().split('T')[0],
        starting_grade: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:8000';

    useEffect(() => {
        fetchStaff();
        fetchGrades();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/staff`);
            const data = await response.json();
            setStaff(data || []);
        } catch (err) {
            console.error('Error fetching staff:', err);
            setError('Failed to fetch staff');
            setStaff([]);
        }
        setLoading(false);
    };

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${API_URL}/grades`);
            const data = await response.json();
            setGrades(data || []);
        } catch (err) {
            console.error('Error fetching grades:', err);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.name === 'grade_id' ? parseInt(e.target.value) : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleAddStaff = async () => {
        try {
            // Convert date to ISO format with time
            const formattedData = {
                ...formData,
                start_date: new Date(formData.start_date).toISOString()
            };

            const response = await fetch(`${API_URL}/staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                setSuccess('Staff member added successfully');
                setIsAddModalOpen(false);
                setFormData({
                    name: '',
                    role: '',
                    grade_id: '',
                    start_date: new Date().toISOString().split('T')[0],
                    starting_grade: ''
                });
                fetchStaff();
            } else {
                setError('Failed to add staff member');
            }
        } catch (err) {
            setError('Failed to add staff member');
        }
    };

    const handleEditStaff = async () => {
        if (!selectedStaff) return;

        try {
            // Convert date to ISO format with time
            const formattedData = {
                ...formData,
                start_date: new Date(formData.start_date).toISOString()
            };

            const response = await fetch(`${API_URL}/staff/${selectedStaff.staff_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                setSuccess('Staff member updated successfully');
                setIsEditModalOpen(false);
                setSelectedStaff(null);
                setFormData({ name: '', role: '', grade_id: '', starting_grade: '' });
                fetchStaff();
            } else {
                setError('Failed to update staff member');
            }
        } catch (err) {
            setError('Failed to update staff member');
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const response = await fetch(`${API_URL}/staff/${staffId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Staff member deleted successfully');
                fetchStaff();
            } else {
                setError('Failed to delete staff member');
            }
        } catch (err) {
            setError('Failed to delete staff member');
        }
    };

    const openEditModal = (staffMember) => {
        setSelectedStaff(staffMember);
        setFormData({
            name: staffMember.name,
            role: staffMember.role,
            grade_id: staffMember.grade_id,
            start_date: staffMember.start_date ? new Date(staffMember.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            starting_grade: staffMember.starting_grade || ''
        });
        setIsEditModalOpen(true);
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage your staff members and their roles</p>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <PlusCircle className="w-5 h-5" />
                            Add New Staff
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
                                placeholder="Search staff..."
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
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Grade</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {filteredStaff.map((member) => (
                                    <tr key={member.staff_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{member.role}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {grades.find(g => g.grade_id === member.grade_id)?.grade_name || member.grade_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{member.starting_grade}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{formatDate(member.start_date)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(member)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStaff(member.staff_id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {filteredStaff.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-sm">No staff members found</p>
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
                title="Add New Staff Member"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter staff name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter role"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <select
                            name="grade_id"
                            value={formData.grade_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a grade</option>
                            {grades.map((grade) => (
                                <option key={grade.grade_id} value={grade.grade_id}>
                                    {grade.grade_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Starting Grade</label>
                        <input
                            type="text"
                            name="starting_grade"
                            value={formData.starting_grade}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter starting grade"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddStaff}>
                            Add Staff Member
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Staff Member"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter staff name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter role"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <select
                            name="grade_id"
                            value={formData.grade_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a grade</option>
                            {grades.map((grade) => (
                                <option key={grade.grade_id} value={grade.grade_id}>
                                    {grade.grade_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Starting Grade</label>
                        <input
                            type="text"
                            name="starting_grade"
                            value={formData.starting_grade}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter starting grade"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditStaff}>
                            Update Staff Member
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StaffApp;