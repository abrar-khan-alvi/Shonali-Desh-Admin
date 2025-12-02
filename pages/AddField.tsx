import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sprout, MapPin } from 'lucide-react';

const AddField: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();

    const [formData, setFormData] = useState({
        fieldSize: '',
        cropType: '',
        soilType: '',
        latitude: '',
        longitude: '',
        currentCropName: '',
        plantedOn: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add Firebase integration
        console.log('Field data submitted:', { userId, ...formData });
        alert('Field added successfully! (Mock - Firebase integration pending)');
        navigate(`/users/${userId}`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link to={`/users/${userId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Field</h1>
                    <p className="text-sm text-gray-500">Add a field for Farmer #{userId}</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Field Information */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Sprout className="mr-2 text-green-600" size={20} />
                            Field Information
                        </h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field Size <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fieldSize"
                            value={formData.fieldSize}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 2.5 Acres"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Crop Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="cropType"
                            value={formData.cropType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Crop Type</option>
                            <option value="Rice">Rice</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Jute">Jute</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Corn">Corn</option>
                            <option value="Potato">Potato</option>
                            <option value="Sugarcane">Sugarcane</option>
                            <option value="Tea">Tea</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Soil Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="soilType"
                            value={formData.soilType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select Soil Type</option>
                            <option value="Clay Loam">Clay Loam</option>
                            <option value="Sandy Loam">Sandy Loam</option>
                            <option value="Silt Loam">Silt Loam</option>
                            <option value="Clay">Clay</option>
                            <option value="Sandy">Sandy</option>
                            <option value="Loamy">Loamy</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <MapPin className="mr-2 text-blue-600" size={20} />
                            Field Location
                        </h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 25.7439"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 89.2752"
                        />
                    </div>

                    {/* Current Crop */}
                    <div className="md:col-span-2 mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Crop Information</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Crop Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="currentCropName"
                            value={formData.currentCropName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Boro Rice"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Planted On <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="plantedOn"
                            value={formData.plantedOn}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <Link
                        to={`/users/${userId}`}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Skip for Now
                    </Link>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <Save size={18} />
                            <span>Add Field</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Helper Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> You can add multiple fields for this farmer. After adding this field, you'll be redirected back to the farmer's details page where you can add more fields if needed.
                </p>
            </div>
        </div>
    );
};

export default AddField;
