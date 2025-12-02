import React from 'react';
import StatCard from '../components/StatCard';
import { DollarSign, CreditCard, Coins, TrendingUp, Plus } from 'lucide-react';
import { Transaction, Payout } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-001', userName: 'Rahim Mia', userPhone: '01711223344', coins: 100, amount: 1000, date: '2023-11-20', status: 'Success' },
  { id: 'TXN-002', userName: 'Karim Uddin', userPhone: '01822334455', coins: 50, amount: 500, date: '2023-11-21', status: 'Success' },
  { id: 'TXN-003', userName: 'Jamal Hossain', userPhone: '01566778899', coins: 200, amount: 2000, date: '2023-11-21', status: 'Failed' },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: 'PAY-882', expertName: 'Dr. Rafiqul', coins: 5000, amount: 4500, date: '2023-11-18', status: 'Completed' },
  { id: 'PAY-889', expertName: 'Prof. Malek', coins: 12000, amount: 10800, date: '2023-11-20', status: 'Processing' },
];

const Financials: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financials</h1>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
          <Plus size={18} className="mr-2" /> Add Coin Package
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="৳ 458,200" 
          icon={DollarSign}
          color="bg-green-600"
        />
        <StatCard 
          title="Total Expert Payouts" 
          value="৳ 312,000" 
          icon={CreditCard}
          color="bg-blue-600"
        />
        <StatCard 
          title="Platform Commission" 
          value="৳ 45,800" 
          icon={TrendingUp}
          color="bg-purple-600"
        />
      </div>

      {/* Coin Purchase Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Coin Purchase Log</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <th className="p-3 font-semibold">Txn ID</th>
                    <th className="p-3 font-semibold">User</th>
                    <th className="p-3 font-semibold">Amount</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_TRANSACTIONS.map(txn => (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="p-3 text-xs font-mono text-gray-500">{txn.id}</td>
                      <td className="p-3 text-sm">
                        <p className="font-medium text-gray-800">{txn.userName}</p>
                        <p className="text-xs text-gray-500">{txn.userPhone}</p>
                      </td>
                      <td className="p-3 text-sm font-medium">
                        ৳{txn.amount} <span className="text-gray-400 text-xs">({txn.coins}c)</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          txn.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Expert Payouts */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Expert Payouts</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <th className="p-3 font-semibold">Payout ID</th>
                    <th className="p-3 font-semibold">Expert</th>
                    <th className="p-3 font-semibold">Amount (Tk)</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_PAYOUTS.map(pay => (
                    <tr key={pay.id} className="hover:bg-gray-50">
                      <td className="p-3 text-xs font-mono text-gray-500">{pay.id}</td>
                      <td className="p-3 text-sm font-medium text-gray-800">{pay.expertName}</td>
                      <td className="p-3 text-sm font-medium">৳{pay.amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          pay.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Coins size={20} className="mr-2 text-yellow-500" />
            Grant Bonus Coins
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User (Phone/ID)</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="e.g. 01711..." />
            </div>
            <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Coins)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="50" />
            </div>
            <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors">
                Grant Bonus
            </button>
        </div>
      </div>
    </div>
  );
};

export default Financials;
