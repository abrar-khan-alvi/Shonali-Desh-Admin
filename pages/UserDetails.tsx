import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Phone, Calendar, Leaf, Sprout, Droplet,
    ThermometerSun, AlertTriangle, MessageSquare, Brain, Wifi, CheckCircle, XCircle, Clock, Loader,
    UserPlus, X, Check
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Farmer, Field, SubscriptionHistory, Expert } from '../types';
import Map, { MapMarker } from '../components/Map';
import { fetchFarmerById } from '../services/farmerService';
import { fetchAvailableExperts, createConsultRequest } from '../services/expertService';

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Expert Request State
    const [showExpertModal, setShowExpertModal] = useState(false);
    const [availableExperts, setAvailableExperts] = useState<Expert[]>([]);
    const [loadingExperts, setLoadingExperts] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
    const [consultForm, setConsultForm] = useState({
        hazardType: 'pest',
        shortProblem: ''
    });
    const [submittingRequest, setSubmittingRequest] = useState(false);
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

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

    // Loading state
    const loadExperts = async () => {
        setLoadingExperts(true);
        try {
            const experts = await fetchAvailableExperts();
            setAvailableExperts(experts);
        } catch (err) {
            console.error('Failed to load experts', err);
        } finally {
            setLoadingExperts(false);
        }
    };

    const handleRequestExpert = async () => {
        if (!selectedExpert || !farmer || !activeFieldId) return;

        setSubmittingRequest(true);
        try {
            await createConsultRequest(selectedExpert.id, {
                farmerId: farmer.id,
                fieldId: activeFieldId,
                hazardType: consultForm.hazardType as any,
                shortProblem: consultForm.shortProblem,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });
            alert('Consultation request sent successfully!');
            setShowExpertModal(false);
            setSelectedExpert(null);
            setConsultForm({ hazardType: 'pest', shortProblem: '' });
        } catch (err) {
            console.error('Failed to request expert', err);
            alert('Failed to send request. Please try again.');
        } finally {
            setSubmittingRequest(false);
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
                    {farmer.verificationStatus === 'verified' ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 flex items-center">
                            <CheckCircle size={16} className="mr-1" /> Verified
                        </span>
                    ) : farmer.verificationStatus === 'pending' ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700 flex items-center">
                            <Clock size={16} className="mr-1" /> Pending
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 flex items-center">
                            <XCircle size={16} className="mr-1" /> Rejected
                        </span>
                    )}
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

                {fieldsArray.length > 0 ? fieldsArray.map((field, index) => (
                    <div key={field.id || `field-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Field #{field.id ? field.id.slice(-6) : index + 1}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{field.fieldSize || 'N/A'} • {field.soilType || 'N/A'}</p>
                                </div>
                                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-green-700 border border-green-200">
                                    {field.cropType || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Current Crop & Predictions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-2">Current Crop</h4>
                                    <p className="text-sm text-gray-700">{field.currentCrop?.name || 'Not specified'}</p>
                                    <p className="text-xs text-gray-500 mt-1">Planted: {field.currentCrop?.plantedOn || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-2">Latest Predictions</h4>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <p className="text-gray-500">Flood</p>
                                            <p className={`font-medium ${field.latestPrediction?.floodRisk === 'Low' ? 'text-green-600' : 'text-orange-600'}`}>
                                                {field.latestPrediction?.floodRisk || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Salinity</p>
                                            <p className={`font-medium ${field.latestPrediction?.salinityRisk === 'Low' ? 'text-green-600' : 'text-orange-600'}`}>
                                                {field.latestPrediction?.salinityRisk || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Nitrogen</p>
                                            <p className="font-medium text-green-600">{field.latestPrediction?.nitrogenStatus || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Alerts */}
                            {field.alerts && Object.keys(field.alerts).length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <AlertTriangle size={18} className="mr-2 text-orange-500" /> Active Alerts
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(field.alerts).map(([alertId, alert]) => (
                                            <div key={alertId} className={`p-3 rounded-lg border ${alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                                                alert.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                                                    alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                                        'bg-blue-50 border-blue-200'
                                                }`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">{alert.type}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{alert.summary}</p>
                                                        {alert.evidence && (
                                                            <p className="text-xs text-gray-500 mt-1">Evidence: {alert.evidence}</p>
                                                        )}
                                                    </div>
                                                    {alert.timestamp && (
                                                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* Consultations */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {field.expertConsultations && Object.keys(field.expertConsultations).length > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-semibold text-gray-800 flex items-center">
                                                <MessageSquare size={18} className="mr-2 text-blue-500" /> Expert Consultations
                                            </h4>
                                            <button
                                                onClick={() => {
                                                    setActiveFieldId(field.id || `field-${index}`);
                                                    setShowExpertModal(true);
                                                    loadExperts();
                                                }}
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center"
                                            >
                                                <UserPlus size={14} className="mr-1" /> Request Expert
                                            </button>
                                        </div>
                                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                            {Object.entries(field.expertConsultations).map(([consultId, consult]) => (
                                                <div key={consultId} className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs font-medium text-blue-600">{consult.expertName || 'Expert'}</p>
                                                    <p className="text-sm text-gray-700 mt-1">{consult.advice}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{consult.timestamp}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {field.aiConsultations && Object.keys(field.aiConsultations).length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                            <Brain size={18} className="mr-2 text-purple-500" /> AI Consultations
                                        </h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                            {Object.entries(field.aiConsultations).map(([consultId, consult]) => (
                                                <div key={consultId} className="p-3 bg-purple-50 rounded-lg">
                                                    <p className="text-xs font-medium text-purple-600">Problems Detected</p>
                                                    <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                                                        {(consult.problems || []).map((p, i) => <li key={`${consultId}-problem-${i}`}>{p}</li>)}
                                                    </ul>
                                                    <p className="text-xs font-medium text-purple-600 mt-2">Solutions</p>
                                                    <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                                                        {(consult.solutions || []).map((s, i) => <li key={`${consultId}-solution-${i}`}>{s}</li>)}
                                                    </ul>
                                                    <p className="text-xs text-green-600 mt-2">💚 Carbon Savings: {consult.carbonSavings}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* IoT Sensor Data */}
                            {field.iot && field.iot.sensorReadings && Object.keys(field.iot.sensorReadings).length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Wifi size={18} className="mr-2 text-green-500" /> IoT Sensor Readings
                                        </div>
                                        <div className="text-xs text-gray-500 font-normal">
                                            User ID: <span className="font-mono bg-gray-100 px-1 rounded">{farmer.id}</span> •
                                            Field ID: <span className="font-mono bg-gray-100 px-1 rounded">{field.id || `field-${index}`}</span>
                                        </div>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={Object.values(field.iot.sensorReadings)}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="soilTemp" stroke="#EF4444" name="Temp (°C)" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={Object.values(field.iot.sensorReadings)}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="soilMoisture" stroke="#3B82F6" name="Moisture (%)" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Device: {field.iot.deviceInfo.macId} • Installed: {field.iot.deviceInfo.installedOn}</p>
                                </div>
                            )}

                            {/* Carbon Sequestration */}
                            {field.carbonSequestration && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <Leaf size={18} className="mr-2 text-emerald-500" /> Carbon Sequestration
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <p className="text-xs text-gray-600">NDVI</p>
                                            <p className="text-lg font-bold text-emerald-600 mt-1">{field.carbonSequestration.ndvi.toFixed(2)}</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <p className="text-xs text-gray-600">Carbon/Ha</p>
                                            <p className="text-lg font-bold text-emerald-600 mt-1">{field.carbonSequestration.carbonPerHa.toFixed(2)} kg</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <p className="text-xs text-gray-600">Total Carbon</p>
                                            <p className="text-lg font-bold text-emerald-600 mt-1">{field.carbonSequestration.totalCarbon.toFixed(2)} kg</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <p className="text-xs text-gray-600">Revenue</p>
                                            <p className="text-lg font-bold text-emerald-600 mt-1">৳{field.carbonSequestration.revenue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                                        <p className="text-sm text-gray-600">Method: <span className="font-medium text-gray-800">{field.carbonSequestration.method}</span> • Last Updated: <span className="font-medium text-gray-800">{field.carbonSequestration.lastUpdated}</span></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
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

            {/* Expert Request Modal */}
            {showExpertModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Request Expert Consultation</h3>
                            <button onClick={() => setShowExpertModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {!selectedExpert ? (
                                <>
                                    <h4 className="font-medium text-gray-700 mb-4">Select an Available Expert</h4>
                                    {loadingExperts ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="mt-2 text-sm text-gray-500">Loading experts...</p>
                                        </div>
                                    ) : availableExperts.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {availableExperts.map(expert => (
                                                <div key={expert.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                                                            {expert.profilePhotoUrl ? (
                                                                <img src={expert.profilePhotoUrl} alt={expert.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-gray-500 font-bold">{expert.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{expert.name}</p>
                                                            <p className="text-xs text-gray-500">{expert.areasOfSpecialization?.join(', ')}</p>
                                                            {expert.metadata?.ratingAvg && (
                                                                <p className="text-xs text-yellow-600 flex items-center mt-1">
                                                                    <span className="mr-1">★</span> {expert.metadata.ratingAvg.toFixed(1)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedExpert(expert)}
                                                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                                                    >
                                                        Select
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No available experts found.</p>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-4">
                                        <div className="flex items-center">
                                            <span className="font-medium text-blue-900">Selected: {selectedExpert.name}</span>
                                        </div>
                                        <button onClick={() => setSelectedExpert(null)} className="text-xs text-blue-600 hover:underline">Change</button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hazard Type</label>
                                        <select
                                            value={consultForm.hazardType}
                                            onChange={(e) => setConsultForm({ ...consultForm, hazardType: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        >
                                            <option value="pest">Pest Infestation</option>
                                            <option value="flood">Flood / Water Issue</option>
                                            <option value="soil">Soil Quality</option>
                                            <option value="salinity">Salinity</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description</label>
                                        <textarea
                                            value={consultForm.shortProblem}
                                            onChange={(e) => setConsultForm({ ...consultForm, shortProblem: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                                            placeholder="Briefly describe the issue..."
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowExpertModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            {selectedExpert && (
                                <button
                                    onClick={handleRequestExpert}
                                    disabled={submittingRequest || !consultForm.shortProblem}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center ${submittingRequest || !consultForm.shortProblem ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                        }`}
                                >
                                    {submittingRequest ? 'Sending...' : 'Send Request'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;
