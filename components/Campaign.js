import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, X, Search, DollarSign, Calendar, CheckCircle,UserCircle } from 'lucide-react';

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

const CampaignApp = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [clients, setClients] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [managers, setManagers] = useState([]);

    const [budgetInfo, setBudgetInfo] = useState(null);
    const [formData, setFormData] = useState({
        client_id: '',
        title: '',
        start_date: '',
        end_date: '',
        estimated_cost: '',
        actual_cost: '',
        completion_status: false,
        current_state: 'not started',
        manager_id: '',
        budget: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:8000';

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/campaigns`);
            const data = await response.json();
            setCampaigns(data || []);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            setError('Failed to fetch campaigns');
            setCampaigns([]);
        }
        setLoading(false);
    };

    const fetchClients = async () => {
        try {
            const response = await fetch(`${API_URL}/clients`);
            const data = await response.json();
            setClients(data || []);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to fetch clients');
            setClients([]);
        }
    };
// Manager'ları çeken fonksiyon
    const fetchManagers = async () => {
        try {
            const response = await fetch(`${API_URL}/campaign-manager`);
            const data = await response.json();
            setManagers(data || []);
        } catch (err) {
            console.error('Error fetching managers:', err);
            setError('Failed to fetch managers');
            setManagers([]);
        }
    };
    useEffect(() => {
        fetchCampaigns();
        fetchClients();
        fetchManagers();
    }, []);

    const handleInputChange = (e) => {
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        // Convert numeric fields to appropriate types
        if (['client_id', 'manager_id', 'budget'].includes(e.target.name)) {
            value = value === '' ? '' : parseInt(value, 10);
        } else if (['estimated_cost', 'actual_cost'].includes(e.target.name)) {
            value = value === '' ? '' : parseFloat(value);
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleAddCampaign = async () => {
        try {
            // Validate required fields
            if (!formData.client_id || !formData.title || !formData.start_date || !formData.end_date) {
                setError('Please fill in all required fields');
                return;
            }

            const campaignData = {
                client_id: parseInt(formData.client_id),
                title: formData.title,
                start_date: formData.start_date,
                end_date: formData.end_date,
                estimated_cost: parseFloat(formData.estimated_cost) || 0,
                actual_cost: parseFloat(formData.actual_cost) || 0,
                completion_status: formData.completion_status,
                current_state: formData.current_state,
                manager_id: parseInt(formData.manager_id) || null,
                budget: parseInt(formData.budget) || 0
            };

            const response = await fetch(`${API_URL}/campaigns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(campaignData),
            });

            if (response.ok) {
                setSuccess('Campaign added successfully');
                setIsAddModalOpen(false);
                setFormData({
                    client_id: '',
                    title: '',
                    start_date: '',
                    end_date: '',
                    estimated_cost: '',
                    actual_cost: '',
                    completion_status: false,
                    current_state: 'not started',
                    manager_id: '',
                    budget: ''
                });
                fetchCampaigns();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to add campaign');
            }
        } catch (err) {
            setError('Failed to add campaign');
            console.error('Error adding campaign:', err);
        }
    };

    const handleEditCampaign = async () => {
        if (!selectedCampaign) return;

        try {
            const campaignData = {
                client_id: parseInt(formData.client_id),
                title: formData.title,
                start_date: formData.start_date,
                end_date: formData.end_date,
                estimated_cost: parseFloat(formData.estimated_cost) || 0,
                actual_cost: parseFloat(formData.actual_cost) || 0,
                completion_status: formData.completion_status,
                current_state: formData.current_state,
                manager_id: parseInt(formData.manager_id) || null,
                budget: parseInt(formData.budget) || 0
            };

            const response = await fetch(`${API_URL}/campaigns/${selectedCampaign.campaign_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(campaignData),
            });

            if (response.ok) {
                setSuccess('Campaign updated successfully');
                setIsEditModalOpen(false);
                setSelectedCampaign(null);
                fetchCampaigns();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update campaign');
            }
        } catch (err) {
            setError('Failed to update campaign');
            console.error('Error updating campaign:', err);
        }
    };

    const handleDeleteCampaign = async (campaignId) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;

        try {
            const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Campaign deleted successfully');
                fetchCampaigns();
            } else {
                setError('Failed to delete campaign');
            }
        } catch (err) {
            setError('Failed to delete campaign');
        }
    };

    // checkBudget fonksiyonunu güncelle
    const checkBudget = (campaignId) => {
        const campaign = campaigns.find(c => c.campaign_id === campaignId);
        if (!campaign) return;

        const budgetDifference = campaign.estimated_cost - campaign.actual_cost;
        setBudgetInfo(budgetDifference);
        setIsBudgetModalOpen(true);
        setSelectedCampaign(campaign);
    };

    const openEditModal = (campaign) => {
        setSelectedCampaign(campaign);
        setFormData({
            client_id: campaign.client_id,
            title: campaign.title,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            estimated_cost: campaign.estimated_cost,
            actual_cost: campaign.actual_cost,
            completion_status: campaign.completion_status,
            current_state: campaign.current_state,
            manager_id: campaign.manager_id,
            budget: campaign.budget
        });
        setIsEditModalOpen(true);
    };

    const getStateColor = (state) => {
        const colors = {
            'not started': 'bg-gray-100 text-gray-800',
            'in progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[state] || colors['not started'];
    };

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage your marketing campaigns and track budgets</p>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <PlusCircle className="w-5 h-5" />
                            Add New Campaign
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
                                placeholder="Search campaigns..."
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
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Title/Client</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Costs</th>
                                    <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {filteredCampaigns.map((campaign) => (
                                    <tr key={campaign.campaign_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                                            <div className="text-sm text-gray-500">
                                                Client ID: {campaign.client_id}
                                                {campaign.completion_status && (
                                                    <span className="ml-2 text-green-600">
                                    <CheckCircle className="w-4 h-4 inline" /> Completed
                                </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColor(campaign.current_state)}`}>
                            {campaign.current_state}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {campaign.manager_id ? (
                                                    <div className="flex items-center gap-1">
                                                        <UserCircle className="w-4 h-4 text-gray-400" />
                                                        {managers.find(m => m.manager_id === campaign.manager_id)?.staff_name || `Manager #${campaign.manager_id}`}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">No Manager Assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                                        Budget: ${campaign.budget.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Est: ${campaign.estimated_cost.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Act: ${campaign.actual_cost.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => checkBudget(campaign.campaign_id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Check Budget"
                                                >
                                                    <DollarSign className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(campaign)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCampaign(campaign.campaign_id)}
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
                            {campaigns.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-sm">No campaigns found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                show={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Campaign"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                        <select
                            name="client_id"
                            value={formData.client_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                                <option key={client.client_id} value={client.client_id}>
                                    {client.name} - {client.contact_details}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter campaign title"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                            <input
                                type="number"
                                name="estimated_cost"
                                value={formData.estimated_cost}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter estimated cost"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                            <input
                                type="number"
                                name="actual_cost"
                                value={formData.actual_cost}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter actual cost"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter budget"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current State</label>
                        <select
                            name="current_state"
                            value={formData.current_state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="not started">Not Started</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                        <select
                            name="manager_id"
                            value={formData.manager_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a manager</option>
                            {managers.map((manager) => (
                                <option key={manager.manager_id} value={manager.manager_id}>
                                    {manager.staff_name} - {manager.role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="completion_status"
                            checked={formData.completion_status}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Completion Status
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddCampaign}>
                            Add Campaign
                        </Button>
                    </div>
                </div>
            </Modal>
            {/* Edit Modal */}
            <Modal
                show={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Campaign"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                        <select
                            name="client_id"
                            value={formData.client_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                                <option key={client.client_id} value={client.client_id}>
                                    {client.name} - {client.contact_details}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter campaign title"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                            <input
                                type="number"
                                name="estimated_cost"
                                value={formData.estimated_cost}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter estimated cost"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                            <input
                                type="number"
                                name="actual_cost"
                                value={formData.actual_cost}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter actual cost"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter budget"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current State</label>
                        <select
                            name="current_state"
                            value={formData.current_state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="not started">Not Started</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* New Fields Added Here */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                        <select
                            name="manager_id"
                            value={formData.manager_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a manager</option>
                            {managers.map((manager) => (
                                <option key={manager.manager_id} value={manager.manager_id}>
                                    {manager.staff_name} - {manager.role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="completion_status"
                            checked={formData.completion_status}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Completion Status
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditCampaign}>
                            Update Campaign
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Budget Check Modal */}
            <Modal
                show={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                title="Budget Status"
            >
                {selectedCampaign && (
                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">{selectedCampaign.title}</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Budget:</span>
                                    <span className="font-medium">${selectedCampaign.budget.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Estimated Cost:</span>
                                    <span className="font-medium">${selectedCampaign.estimated_cost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Actual Cost:</span>
                                    <span className="font-medium">${selectedCampaign.actual_cost.toLocaleString()}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Cost Difference:</span>
                                        <span className={`font-medium ${budgetInfo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Math.abs(budgetInfo).toLocaleString()}
                                            {budgetInfo >= 0 ? ' under budget' : ' over budget'}
                            </span>
                                    </div>
                                </div>
                            </div>
                            {budgetInfo < 0 && (
                                <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                                    <div className="font-medium">Warning:</div>
                                    <div>Project is exceeding the estimated cost by ${Math.abs(budgetInfo).toLocaleString()}</div>
                                </div>
                            )}
                            {budgetInfo > 0 && (
                                <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
                                    <div className="font-medium">Good standing:</div>
                                    <div>Project is under the estimated cost by ${Math.abs(budgetInfo).toLocaleString()}</div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button variant="secondary" onClick={() => setIsBudgetModalOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CampaignApp;