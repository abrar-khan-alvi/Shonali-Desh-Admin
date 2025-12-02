import React from 'react';
import { Users, UserCheck, MessageCircle, Coins, AlertCircle, Leaf } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

const dataUserGrowth = [
  { name: 'Mon', users: 120 },
  { name: 'Tue', users: 132 },
  { name: 'Wed', users: 101 },
  { name: 'Thu', users: 134 },
  { name: 'Fri', users: 190 },
  { name: 'Sat', users: 230 },
  { name: 'Sun', users: 210 },
];

const dataConsultations = [
  { name: 'Mon', volume: 45 },
  { name: 'Tue', volume: 52 },
  { name: 'Wed', volume: 38 },
  { name: 'Thu', volume: 65 },
  { name: 'Fri', volume: 48 },
  { name: 'Sat', volume: 55 },
  { name: 'Sun', volume: 60 },
];

const dataCarbonEmission = [
  { name: 'Field A', emission: 120 },
  { name: 'Field B', emission: 98 },
  { name: 'Field C', emission: 145 },
  { name: 'Field D', emission: 85 },
  { name: 'Field E', emission: 110 },
  { name: 'Field F', emission: 130 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Last 7 Days</option>
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Users"
          value="12,543"
          trend="+5% vs last week"
          trendUp={true}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Verified Experts"
          value="482"
          trend="324 Online"
          trendUp={true}
          icon={UserCheck}
          color="bg-green-500"
        />
        <StatCard
          title="Active Consultations"
          value="87"
          trend="Currently active"
          trendUp={true}
          icon={MessageCircle}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value="৳ 458,200"
          trend="+12% vs last month"
          trendUp={true}
          icon={Coins}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Carbon Emission"
          value="688 kg"
          trend="-2% vs last week"
          trendUp={false}
          icon={Leaf}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth Over Time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataUserGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Consultation Volume</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataConsultations}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="volume" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Carbon Emission by User Field</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCarbonEmission}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="emission" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side Panel: Action Items & Activity */}
        <div className="space-y-6">
          {/* Action Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              Needs Attention
              <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </h2>
            <div className="space-y-3">
              <Link to="/experts" className="block p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100 group">
                <div className="flex items-start space-x-3">
                  <div className="text-red-500 mt-0.5"><AlertCircle size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-red-700">3 Expert Applications</p>
                    <p className="text-xs text-gray-500">Pending review since yesterday</p>
                  </div>
                </div>
              </Link>
              <Link to="/reports" className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-100 group">
                <div className="flex items-start space-x-3">
                  <div className="text-orange-500 mt-0.5"><MessageCircle size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-700">1 New Dispute Reported</p>
                    <p className="text-xs text-gray-500">Session #8821 • Payment Issue</p>
                  </div>
                </div>
              </Link>
              <Link to="/iot" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 group">
                <div className="flex items-start space-x-3">
                  <div className="text-gray-500 mt-0.5"><AlertCircle size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">5 IoT Devices Offline</p>
                    <p className="text-xs text-gray-500">Rajshahi District Cluster</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { text: "User 'Rahim Mia' registered", time: "5 mins ago", dot: "bg-green-500" },
                { text: "Expert 'Dr. Hasan' approved", time: "1 hour ago", dot: "bg-blue-500" },
                { text: "Large Coin Pack purchased (৳500)", time: "2 hours ago", dot: "bg-yellow-500" },
                { text: "New Device added to Rangpur", time: "4 hours ago", dot: "bg-purple-500" },
                { text: "User 'Karim' suspended", time: "Yesterday", dot: "bg-red-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${item.dot}`}></div>
                  <div>
                    <p className="text-sm text-gray-700">{item.text}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
