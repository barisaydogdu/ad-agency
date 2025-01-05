import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, X, Search, Calendar } from 'lucide-react';

// Modal ve Button bileşenleri aynı kalacak...
const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="mt-4">{children}</div>
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

const AdvertManagement = () => {
    const [adverts, setAdverts] = useState([]);
    const [campaigns, setCampaigns] = useState([]); // Kampanyalar için yeni state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAdvert, setSelectedAdvert] = useState(null);
    const [formData, setFormData] = useState({
        campaign_id: '',
        progress: '',
        run_date: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:8000';

    useEffect(() => {
        fetchAdverts();
        fetchCampaigns(); // Kampanyaları çek
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await fetch(`${API_URL}/campaigns`);
            const data = await response.json();
            setCampaigns(data || []);
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            setError('Failed to fetch campaigns');
        }
    };

    const fetchAdverts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/adverts`);
            const data = await response.json();
            setAdverts(data || []);
        } catch (err) {
            console.error('Error fetching adverts:', err);
            setError('Failed to fetch adverts');
            setAdverts([]);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openModal = (advert = null) => {
        if (advert) {
            setSelectedAdvert(advert);
            setFormData({
                campaign_id: advert.campaign_id.toString(),
                progress: advert.progress,
                run_date: new Date(advert.run_date).toISOString().split('T')[0]
            });
            setIsEditModalOpen(true);
        } else {
            setFormData({ campaign_id: '', progress: '', run_date: '' });
            setIsAddModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedAdvert(null);
    };

    const handleSubmit = async () => {
        const method = isEditModalOpen ? 'PUT' : 'POST';
        const url = isEditModalOpen ? `${API_URL}/adverts/${selectedAdvert.advert_id}` : `${API_URL}/adverts`;
        const formattedDate = new Date(formData.run_date + 'T00:00:00Z').toISOString();

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    campaign_id: parseInt(formData.campaign_id),
                    run_date: formattedDate,
                })
            });

            if (response.ok) {
                setSuccess(isEditModalOpen ? 'Advert updated successfully' : 'Advert added successfully');
                fetchAdverts();
                closeModal();
            } else {
                setError('Failed to save advert');
            }
        } catch (err) {
            console.error('Error saving advert:', err);
            setError('Failed to save advert');
        }
    };

    const handleDeleteAdvert = async (advertId) => {
        if (!window.confirm('Are you sure you want to delete this advert?')) return;

        try {
            const response = await fetch(`${API_URL}/adverts/${advertId}`, { method: 'DELETE' });

            if (response.ok) {
                setSuccess('Advert deleted successfully');
                fetchAdverts();
            } else {
                setError('Failed to delete advert');
            }
        } catch (err) {
            console.error('Error deleting advert:', err);
            setError('Failed to delete advert');
        }
    };

    const getCampaignTitle = (campaignId) => {
        const campaign = campaigns.find(c => c.campaign_id === campaignId);
        return campaign ? campaign.title : campaignId;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Advert Management</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage your campaign advertisements</p>
                        </div>
                        <Button onClick={() => openModal()}>
                            <PlusCircle className="w-5 h-5" />
                            Add New Advert
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center">
                            <X className="h-5 w-5 text-red-400" />
                            <p className="ml-3 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <p className="ml-3 text-sm text-green-700">{success}</p>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search adverts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Run Date</th>
                                    <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {adverts.filter(advert =>
                                    advert.progress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    getCampaignTitle(advert.campaign_id).toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((advert) => (
                                    <tr key={advert.advert_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">{getCampaignTitle(advert.campaign_id)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{advert.progress}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(advert.run_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(advert)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAdvert(advert.advert_id)}
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
                            {adverts.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-sm">No adverts found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal show={isAddModalOpen} onClose={closeModal} title="Add New Advert">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
                        <select
                            name="campaign_id"
                            value={formData.campaign_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a campaign</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign.campaign_id} value={campaign.campaign_id}>
                                    {campaign.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                        <input
                            type="text"
                            name="progress"
                            value={formData.progress}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter progress status"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Run Date</label>
                        <input
                            type="date"
                            name="run_date"
                            value={formData.run_date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Add Advert
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal show={isEditModalOpen} onClose={closeModal} title="Edit Advert">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
                        <select
                            name="campaign_id"
                            value={formData.campaign_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a campaign</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign.campaign_id} value={campaign.campaign_id}>
                                    {campaign.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                        <input
                            type="text"
                            name="progress"
                            value={formData.progress}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter progress status"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Run Date</label>
                        <input
                            type="date"
                            name="run_date"
                            value={formData.run_date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            Update Advert
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdvertManagement;
