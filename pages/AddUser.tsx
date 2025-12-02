import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User as UserIcon, MapPin, FileText, Sprout, Calendar } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';
import { addFarmer, addFieldToFarmer } from '../services/farmerService';

const AddUser: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Personal Info
        name: '',
        phone: '',
        photoUrl: '',
        nidUrl: '',

        // Address
        region: '',
        district: '',
        upazila: '',
        village: '',

        // Subscription
        hasSubscription: false,
        subscriptionType: 'yearly',
        subscriptionValidTill: '',
        termsAccepted: false,

        // Initial Field
        fieldSize: '',
        cropType: '',
        soilType: '',
        lat: 23.8103, // Default center
        lon: 90.4125,
        currentCropName: '',
        currentCropPlantedOn: '',

        // IoT
        iotMacId: '',
        iotInstalledOn: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);

            // 1. Create Farmer
            const farmerData = {
                name: formData.name,
                phone: formData.phone,
                photoUrl: formData.photoUrl,
                nidUrl: formData.nidUrl,
                region: formData.region,
                district: formData.district,
                upazila: formData.upazila,
                village: formData.village,
                hasSubscription: formData.hasSubscription,
                subscriptionType: formData.subscriptionType,
                subscriptionValidTill: formData.subscriptionValidTill,
                termsAccepted: formData.termsAccepted,
                verificationStatus: 'pending' as const,
            };

            const farmerId = await addFarmer(farmerData);

            // 2. Create Initial Field
            // We add a default initial field with the provided data
            const fieldData = {
                fieldSize: formData.fieldSize || '0 decimals',
                cropType: formData.cropType || 'Unknown',
                soilType: formData.soilType || 'Unknown',
                location: {
                    lat: formData.lat,
                    lon: formData.lon
                },
                currentCrop: {
                    name: formData.currentCropName || 'None',
                    plantedOn: formData.currentCropPlantedOn || new Date().toISOString().split('T')[0]
                },
                latestPrediction: {
                    floodRisk: "low",
                    salinityRisk: "low",
                    nitrogenStatus: "unknown",
                    generatedOn: new Date().toISOString()
                },
                iot: formData.iotMacId ? {
                    deviceInfo: {
                        macId: formData.iotMacId,
                        installedOn: formData.iotInstalledOn || new Date().toISOString().split('T')[0]
                    }
                } : undefined
            };

            await addFieldToFarmer(farmerId, fieldData);

            alert('Farmer and initial field added successfully!');
            navigate(`/users/${farmerId}`);
        } catch (error) {
            console.error('Error adding farmer:', error);
            alert('Failed to add farmer. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLocationChange = (lat: number, lon: number) => {
        setFormData(prev => ({
            ...prev,
            lat,
            lon
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link to="/users" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Farmer</h1>
                    <p className="text-sm text-gray-500">Create a new farmer account with initial field data</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- Personal Information --- */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <UserIcon className="mr-2 text-blue-600" size={20} />
                            Personal Information
                        </h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter farmer's full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{11}"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="01XXXXXXXXX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Photo URL
                        </label>
                        <input
                            type="text"
                            name="photoUrl"
                            value={formData.photoUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="gs://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            NID URL
                        </label>
                        <input
                            type="text"
                            name="nidUrl"
                            value={formData.nidUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="gs://..."
                        />
                    </div>

                    {/* --- Location Information --- */}
                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Address Information</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Region <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Region</option>
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Khulna">Khulna</option>
                            <option value="Barisal">Barisal</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rangpur">Rangpur</option>
                            <option value="Mymensingh">Mymensingh</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            District <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter district"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upazila <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="upazila"
                            value={formData.upazila}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter upazila"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Village <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="village"
                            value={formData.village}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter village"
                        />
                    </div>

                    {/* --- Subscription --- */}
                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <FileText className="mr-2 text-blue-600" size={20} />
                            Subscription Details
                        </h2>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="hasSubscription"
                            name="hasSubscription"
                            checked={formData.hasSubscription}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="hasSubscription" className="text-sm font-medium text-gray-700">
                            Active Subscription
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subscription Type
                        </label>
                        <select
                            name="subscriptionType"
                            value={formData.subscriptionType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valid Till
                        </label>
                        <input
                            type="date"
                            name="subscriptionValidTill"
                            value={formData.subscriptionValidTill}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="termsAccepted" className="text-sm font-medium text-gray-700">
                            Terms Accepted
                        </label>
                    </div>

                    {/* --- Initial Field Information --- */}
                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <Sprout className="mr-2 text-blue-600" size={20} />
                            Initial Field Details
                        </h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field Size
                        </label>
                        <input
                            type="text"
                            name="fieldSize"
                            value={formData.fieldSize}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 30 decimals"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Crop Type
                        </label>
                        <input
                            type="text"
                            name="cropType"
                            value={formData.cropType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Wheat"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Soil Type
                        </label>
                        <input
                            type="text"
                            name="soilType"
                            value={formData.soilType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Clay Loam"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Crop Name
                        </label>
                        <input
                            type="text"
                            name="currentCropName"
                            value={formData.currentCropName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. BARI wheat 30"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Planted On
                        </label>
                        <input
                            type="date"
                            name="currentCropPlantedOn"
                            value={formData.currentCropPlantedOn}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* --- IoT Information --- */}
                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                            <span className="mr-2 text-blue-600">📡</span>
                            IoT Device Information
                        </h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            IoT MAC Address
                        </label>
                        <input
                            type="text"
                            name="iotMacId"
                            value={formData.iotMacId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. C1:D2:E3:F4:A5:B6"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Installed On
                        </label>
                        <input
                            type="date"
                            name="iotInstalledOn"
                            value={formData.iotInstalledOn}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Field Location Picker */}
                    <div className="md:col-span-2 mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <MapPin className="mr-2 text-gray-500" size={16} />
                            Field Location
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Select the location of this initial field.
                        </p>
                        <LocationPicker
                            onLocationChange={handleLocationChange}
                            initialLat={formData.lat}
                            initialLon={formData.lon}
                        />
                    </div>

                    {/* Coordinates Display */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude
                        </label>
                        <input
                            type="text"
                            value={formData.lat.toFixed(6)}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude
                        </label>
                        <input
                            type="text"
                            value={formData.lon.toFixed(6)}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium transition-colors ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            <Save size={20} />
                            <span>{saving ? 'Saving...' : 'Save Farmer & Field'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
