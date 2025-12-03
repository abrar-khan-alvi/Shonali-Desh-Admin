import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, MapPin, UserPlus, X, Clock, AlertTriangle } from 'lucide-react';
import { Farmer, Field, Expert } from '../types';
import { fetchFarmerById } from '../services/farmerService';
import Map, { MapMarker } from '../components/Map';
import { fetchAvailableExperts, createConsultRequest } from '../services/expertService';
import { addExpertRequestToField } from '../services/requestTracking';

const FieldDetails: React.FC = () => {
    const { userId, fieldId } = useParams<{ userId: string; fieldId: string }>();
    const navigate = useNavigate();
    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [field, setField] = useState<Field | null>(null);
    const [loading, setLoading] = useState(true);

    // Expert Request State
    const [showExpertModal, setShowExpertModal] = useState(false);
    const [availableExperts, setAvailableExperts] = useState<Expert[]>([]);
    const [loadingExperts, setLoadingExperts] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
    const [submittingRequest, setSubmittingRequest] = useState(false);

    useEffect(() => {
        loadData();
    }, [userId, fieldId]);

    const loadData = async () => {
        if (!userId || !fieldId) return;

        try {
            const data = await fetchFarmerById(userId);
            if (data?.fields?.[fieldId]) {
                setFarmer(data);
                setField({ ...data.fields[fieldId], id: fieldId });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
        if (!selectedExpert || !farmer || !field || !fieldId) return;

        setSubmittingRequest(true);
        try {
            // Prepare consultation data to send
            const consultationData = {
                aiConsultations: field.aiConsultations || null,
                expertConsultations: field.expertConsultations || null
            };

            // Convert to JSON string for shortProblem field
            const dataPayload = JSON.stringify(consultationData, null, 2);

            // Determine hazard type based on risks (default to 'pest')
            let hazardType = 'pest';
            if (field.latestPrediction?.floodRisk === 'High') hazardType = 'flood';
            else if (field.latestPrediction?.salinityRisk === 'High') hazardType = 'salinity';

            await createConsultRequest(selectedExpert.id, {
                farmerId: farmer.id,
                fieldId: fieldId,
                hazardType: hazardType as any,
                shortProblem: dataPayload,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });

            // Track the request in the field
            await addExpertRequestToField(farmer.id, fieldId, {
                expertId: selectedExpert.id,
                expertName: selectedExpert.name,
                status: 'pending',
                requestedAt: new Date().toISOString()
            });

            // Close modal immediately
            setShowExpertModal(false);
            setSelectedExpert(null);

            // Show success message
            alert('Consultation request sent successfully!');

            // Reload data
            await loadData();
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
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!field || !farmer) {
        return (
            <div className="space-y-4">
                <button onClick={() => navigate(`/users/${userId}`)} className="flex items-center text-blue-600">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>
                <p className="text-red-600">Field not found</p>
            </div>
        );
    }

    const fieldMarkers: MapMarker[] = (field.location && field.location.lat && field.location.lon) ? [{
        lat: field.location.lat,
        lon: field.location.lon,
        popup: `<strong>${field.currentCrop?.name || 'Unknown Crop'}</strong><br/>${field.fieldSize || 'N/A'}`,
        title: `Field #${fieldId?.slice(-6)}`
    }] : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(`/users/${userId}`)} className="flex items-center text-blue-600 hover:text-blue-700">
                    <ArrowLeft size={20} className="mr-2" /> Back to {farmer.name}
                </button>
                <button
                    onClick={() => {
                        setShowExpertModal(true);
                        loadExperts();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-sm"
                >
                    <UserPlus size={18} className="mr-2" /> Request Expert
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold mb-4">Field #{fieldId?.slice(-6)}</h1>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Crop</p>
                        <p className="font-semibold">{field.currentCrop?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Size</p>
                        <p className="font-semibold">{field.fieldSize}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Soil Type</p>
                        <p className="font-semibold">{field.soilType}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Crop Type</p>
                        <p className="font-semibold">{field.cropType}</p>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            {fieldMarkers.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <MapPin className="mr-2 text-blue-600" /> Field Location
                    </h2>
                    <Map markers={fieldMarkers} height="300px" zoom={14} />
                </div>
            )}

            {field.expertRequests && Object.keys(field.expertRequests).length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Expert Requests</h2>
                    <div className="space-y-2">
                        {Object.entries(field.expertRequests as any).map(([id, req]: [string, any]) => (
                            <div key={id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>{req.expertName}</span>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        req.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                    }`}>
                                    {req.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                                            {availableExperts.map(expert => {
                                                const existingRequest = field?.expertRequests
                                                    ? Object.values(field.expertRequests as any).find((req: any) => req.expertId === expert.id)
                                                    : null;

                                                return (
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
                                                        {existingRequest ? (
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(existingRequest as any).status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                (existingRequest as any).status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-green-100 text-green-700'
                                                                }`}>
                                                                {(existingRequest as any).status.toUpperCase()}
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => setSelectedExpert(expert)}
                                                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                                                            >
                                                                Select
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
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

                                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                                        <h5 className="font-semibold text-gray-800 mb-3">📋 Auto-Generated Request Data</h5>
                                        <div className="text-sm text-gray-600 space-y-2">
                                            <p className="flex items-start">
                                                <span className="font-medium mr-2">✓</span>
                                                <span>Field Information (Crop, Soil Type, Field Size)</span>
                                            </p>
                                            <p className="flex items-start">
                                                <span className="font-medium mr-2">✓</span>
                                                <span>Current Risk Assessment (Flood, Pest, Salinity)</span>
                                            </p>
                                            <p className="flex items-start">
                                                <span className="font-medium mr-2">✓</span>
                                                <span>Latest AI Analysis (Problems & Solutions)</span>
                                            </p>
                                        </div>
                                        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                                            💡 All relevant data will be automatically sent to the expert. No manual input required.
                                        </div>
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
                                    disabled={submittingRequest}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center ${submittingRequest ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
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

export default FieldDetails;
