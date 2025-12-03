import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Phone, Leaf, Sprout, CheckCircle, XCircle, Clock, Edit2, Loader, AlertTriangle, MessageSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Farmer, Field, SubscriptionHistory } from '../types';
import Map, { MapMarker } from '../components/Map';
import { fetchFarmerById, updateFarmer } from '../services/farmerService';
import { sendConsultationSummarySMS } from '../services/smsService';

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sendingSMS, setSendingSMS] = useState(false);

    useEffect(() => {
        loadFarmerData();
    }, [id]);

    const loadFarmerData = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const data = await fetchFarmerById(id);
            if (data) {
                setFarmer(data);
            } else {
                setError('Farmer not found');
            }
        } catch (err) {
            setError('Failed to load farmer details. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Convert object fields to arrays for rendering
    const fieldsArray: Field[] = farmer?.fields ? Object.values(farmer.fields) : [];
    const subscriptionHistoryArray: SubscriptionHistory[] = farmer?.subscriptionHistory
        ? Object.values(farmer.subscriptionHistory)
        : [];

    // Calculate total carbon emissions
    const totalCarbonEmissions = fieldsArray.reduce(
        (total, field) => {
            const carbonEmissions = field.carbonSequestration?.totalCarbon || 0;
            return total + carbonEmissions;
        },
        0
    );

    // Prepare chart data
    const carbonByField = fieldsArray.map((field, index) => ({
        name: `Field ${field.id ? field.id.slice(-6) : index + 1}`,
        emission: field.carbonSequestration?.totalCarbon || 0
    }));

    // Prepare map markers from fields
    const fieldMarkers: MapMarker[] = fieldsArray
        .filter(field => field.location && field.location.lat && field.location.lon)
        .map((field, index) => ({
            lat: field.location.lat,
            lon: field.location.lon,
            popup: `<strong>${field.currentCrop?.name || 'Unknown Crop'}</strong><br/>${field.fieldSize || 'N/A'} • ${field.cropType || 'N/A'}<br/>Soil: ${field.soilType || 'N/A'}`,
            title: `Field ${field.id ? field.id.slice(-6) : index + 1}`,
        }));

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

    const handleStatusChange = async (newStatus: string) => {
        if (!farmer) return;
        try {
            await updateFarmer(farmer.id, { verificationStatus: newStatus as any });
            setFarmer({ ...farmer, verificationStatus: newStatus as any });
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const handleSendSMS = async () => {
        if (!farmer) return;
        setSendingSMS(true);
        try {
            await sendConsultationSummarySMS(farmer);
            alert(`SMS sent to ${farmer.phone}`);
        } catch (err) {
            console.error('Failed to send SMS', err);
            alert('Failed to send SMS');
        } finally {
            setSendingSMS(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                    <p className="text-gray-600">Loading farmer details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !farmer) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link to="/users" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Farmer Details</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <p className="text-red-800 font-medium">{error || 'Farmer not found'}</p>
                    <button
                        onClick={loadFarmerData}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/users" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{farmer.name}</h1>
                        <p className="text-sm text-gray-500">Farmer ID: #{id}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleSendSMS}
                        disabled={sendingSMS}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-sm text-sm mr-2"
                    >
                        <MessageSquare size={16} className="mr-1" />
                        {sendingSMS ? 'Sending...' : 'Send SMS'}
                    </button>
                    <div className="relative">
                        <select
                            value={farmer.verificationStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`appearance-none pl-8 pr-8 py-1 rounded-full text-sm font-semibold border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${farmer.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                farmer.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}
                        >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {farmer.verificationStatus === 'verified' ? <CheckCircle size={16} className="text-green-700" /> :
                                farmer.verificationStatus === 'pending' ? <Clock size={16} className="text-yellow-700" /> :
                                    <XCircle size={16} className="text-red-700" />}
                        </div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <Edit2 size={12} className="opacity-50" />
                        </div>
                    </div>
                    {farmer.hasSubscription && (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                            {farmer.subscriptionType?.toUpperCase()} Plan
                        </span>
                    )}
                </div>
            </div>

            {/* Basic Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-semibold text-gray-800">{farmer.phone}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-semibold text-gray-800">{farmer.village}, {farmer.upazila}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Sprout size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Fields</p>
                            <p className="font-semibold text-gray-800">{fieldsArray.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <Leaf size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Carbon</p>
                            <p className="font-semibold text-gray-800">{totalCarbonEmissions} kg</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carbon Emission Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Carbon Emissions by Field</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={carbonByField}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="emission" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Subscription History</h2>
                    <div className="space-y-3">
                        {subscriptionHistoryArray.length > 0 ? (
                            subscriptionHistoryArray.map(sub => (
                                <div key={sub.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{sub.duration}</p>
                                        <p className="text-xs text-gray-500">{sub.paidOn} • {sub.method}</p>
                                    </div>
                                    <p className="font-bold text-green-600">৳{sub.paidAmount}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No subscription history available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Fields Map */}
            {fieldsArray.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MapPin className="mr-2 text-blue-600" />
                        Field Locations
                    </h2>
                    <Map
                        markers={fieldMarkers}
                        height="400px"
                        zoom={13}
                    />
                </div>
            )}

            {/* Fields Details */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <Sprout className="mr-2 text-green-600" /> Field Details
                    </h2>
                    <Link
                        to={`/users/${id}/add-field`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                        <Sprout size={18} />
                        <span>Add Field</span>
                    </Link>
                </div>

                {fieldsArray.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fieldsArray.map((field, index) => (
                            <Link
                                key={field.id || `field-${index}`}
                                to={`/users/${id}/fields/${field.id}`}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                                            Field #{field.id ? field.id.slice(-6) : index + 1}
                                        </h3>
                                        <p className="text-sm text-gray-500">{field.fieldSize || 'N/A'} • {field.soilType || 'N/A'}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                                        {field.cropType || 'N/A'}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Current Crop:</span>
                                        <span className="font-medium text-gray-800">{field.currentCrop?.name || 'None'}</span>
                                    </div>
                                    {field.expertRequests && Object.keys(field.expertRequests).length > 0 && (
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                            <span className="text-xs text-purple-600 flex items-center">
                                                <Clock size={12} className="mr-1" />
                                                {Object.keys(field.expertRequests).length} Request(s)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                        <p className="text-gray-500">No fields added yet</p>
                        <Link
                            to={`/users/${id}/add-field`}
                            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Sprout size={18} />
                            <span>Add First Field</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
