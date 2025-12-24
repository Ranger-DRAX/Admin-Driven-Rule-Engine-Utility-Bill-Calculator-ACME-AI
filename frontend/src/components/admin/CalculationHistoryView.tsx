import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculationService } from '../../services/calculation.service';
import type { CalculationHistory } from '../../types';

const CalculationHistoryView: React.FC = () => {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await calculationService.getHistory(page, limit);
      setHistory(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Calculation History</h1>
          <Link to="/admin/dashboard" className="hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold">Total Calculations: {total}</h2>
          </div>

          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Consumer</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-right">Units</th>
                <th className="py-3 px-4 text-right">Base</th>
                <th className="py-3 px-4 text-right">Tax</th>
                <th className="py-3 px-4 text-right">Surcharge</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-left">Month</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {item.consumerName || item.consumerId || 'N/A'}
                  </td>
                  <td className="py-3 px-4 capitalize">{item.consumerType}</td>
                  <td className="py-3 px-4 text-right">{item.unitsConsumed}</td>
                  <td className="py-3 px-4 text-right">৳{item.baseAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">৳{item.taxAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">৳{item.surchargeAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold">৳{item.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">{item.calculationMonth}</td>
                  <td className="py-3 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="p-4 bg-gray-50 flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculationHistoryView;
