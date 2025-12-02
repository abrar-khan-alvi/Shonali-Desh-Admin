import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MoreHorizontal, Filter, Eye, Ban, CheckCircle, KeyRound, Loader } from 'lucide-react';
import { Farmer } from '../types';
import { fetchAllFarmers } from '../services/farmerService';

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllFarmers();
      setFarmers(data);
    } catch (err) {
      setError('Failed to load farmers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.phone.includes(searchTerm) ||
    farmer.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusColors = {
      verified: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Farmer Management</h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Name, Phone..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
            <Filter size={18} />
            <span>Filters</span>
          </button>
          <Link
            to="/users/add"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>+ Add Farmer</span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
          <Loader className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-gray-600">Loading farmers...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={loadFarmers}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Farmer ID</th>
                  <th className="p-4 font-semibold">Full Name</th>
                  <th className="p-4 font-semibold">Mobile</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Subscription</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-500">#{farmer.id.slice(-6)}</td>
                    <td className="p-4 text-sm font-semibold text-gray-800">{farmer.name}</td>
                    <td className="p-4 text-sm text-gray-600">{farmer.phone}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {farmer.region}, {farmer.district}
                    </td>
                    <td className="p-4 text-sm">
                      {farmer.hasSubscription ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium text-xs">
                          {farmer.subscriptionType || 'Active'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium text-xs">
                          None
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(farmer.verificationStatus)}`}>
                        {farmer.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right relative">
                      <button
                        onClick={() => toggleDropdown(farmer.id)}
                        className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {activeDropdown === farmer.id && (
                        <div className="absolute right-4 top-12 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1">
                          <Link to={`/users/${farmer.id}`} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye size={16} className="mr-2" /> View Details
                          </Link>
                          {farmer.verificationStatus === 'verified' ? (
                            <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                              <Ban size={16} className="mr-2" /> Suspend
                            </button>
                          ) : (
                            <button className="flex w-full items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-50">
                              <CheckCircle size={16} className="mr-2" /> Verify
                            </button>
                          )}
                          <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <KeyRound size={16} className="mr-2" /> Reset PIN
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredFarmers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No farmers found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;

