import React from 'react';
import { IoTDevice } from '../types';
import { MapPin, Battery, Signal, WifiOff, FileText, Trash2, AlertTriangle } from 'lucide-react';

const MOCK_DEVICES: IoTDevice[] = [
  { id: 'IOT-2024-001', assignedUser: 'Rahim Mia', location: 'Rangpur (Field A)', lastPing: '2 mins ago', batteryLevel: 85, status: 'Active', lat: 25.7439, lng: 89.2752 },
  { id: 'IOT-2024-005', assignedUser: 'Karim Uddin', location: 'Natore (North)', lastPing: '1 hour ago', batteryLevel: 20, status: 'Active', lat: 24.4102, lng: 89.0076 },
  { id: 'IOT-2024-008', assignedUser: 'Abdul Halim', location: 'Jessore', lastPing: '2 days ago', batteryLevel: 0, status: 'Offline', lat: 23.1634, lng: 89.2182 },
  { id: 'IOT-2024-012', assignedUser: 'Sultana Begum', location: 'Gazipur', lastPing: '5 mins ago', batteryLevel: 92, status: 'Error', lat: 23.9999, lng: 90.4203 },
];

const IoT: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">IoT Device Tracking</h1>
        <div className="flex space-x-2">
            <span className="flex items-center text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Active</span>
            <span className="flex items-center text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded"><span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span> Offline</span>
            <span className="flex items-center text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Error</span>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-200 rounded-xl h-96 relative overflow-hidden flex items-center justify-center border border-gray-300">
        <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
        {/* Simulating Map Pins */}
        <div className="absolute top-1/4 left-1/3 flex flex-col items-center group cursor-pointer">
            <MapPin className="text-green-600 drop-shadow-lg" size={32} fill="currentColor" />
            <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold hidden group-hover:block whitespace-nowrap z-10">IOT-001 (Active)</div>
        </div>
        <div className="absolute top-1/2 left-1/2 flex flex-col items-center group cursor-pointer">
             <MapPin className="text-red-600 drop-shadow-lg" size={32} fill="currentColor" />
             <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold hidden group-hover:block whitespace-nowrap z-10">IOT-012 (Error)</div>
        </div>
         <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center group cursor-pointer">
             <MapPin className="text-gray-500 drop-shadow-lg" size={32} fill="currentColor" />
             <div className="bg-white px-2 py-1 rounded shadow text-xs font-bold hidden group-hover:block whitespace-nowrap z-10">IOT-008 (Offline)</div>
        </div>
        
        <div className="z-0 text-gray-400 font-semibold text-lg flex flex-col items-center">
            <span>Interactive Map View</span>
            <span className="text-sm font-normal">Bangladesh Region</span>
        </div>
      </div>

      {/* Device Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
              <th className="p-4 font-semibold">Device ID</th>
              <th className="p-4 font-semibold">Assigned Farmer</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Battery</th>
              <th className="p-4 font-semibold">Last Ping</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_DEVICES.map(device => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-sm font-medium text-gray-700">{device.id}</td>
                <td className="p-4 text-sm text-gray-800">{device.assignedUser}</td>
                <td className="p-4 text-sm text-gray-600">{device.location}</td>
                <td className="p-4">
                  <span className={`flex items-center w-fit px-2 py-1 rounded-full text-xs font-semibold ${
                    device.status === 'Active' ? 'bg-green-100 text-green-700' :
                    device.status === 'Offline' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                  }`}>
                    {device.status === 'Active' && <Signal size={12} className="mr-1" />}
                    {device.status === 'Offline' && <WifiOff size={12} className="mr-1" />}
                    {device.status === 'Error' && <AlertTriangle size={12} className="mr-1" />}
                    {device.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-sm">
                    <Battery size={16} className={`mr-1 ${device.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                    <span className={`${device.batteryLevel < 20 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{device.batteryLevel}%</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">{device.lastPing}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View Data Log">
                      <FileText size={18} />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="De-register Device">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IoT;