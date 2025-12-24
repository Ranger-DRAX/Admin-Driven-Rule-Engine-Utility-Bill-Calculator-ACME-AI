import React from 'react';
import type { CalculationResult } from '../../types';

interface Props {
  result: CalculationResult;
}

const CalculationResults: React.FC<Props> = ({ result }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Bill Calculation Results</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Consumer Information</h3>
        {result.consumerName && <p><strong>Name:</strong> {result.consumerName}</p>}
        {result.consumerId && <p><strong>ID:</strong> {result.consumerId}</p>}
        <p><strong>Type:</strong> {result.consumerType.charAt(0).toUpperCase() + result.consumerType.slice(1)}</p>
        <p><strong>Units Consumed:</strong> {result.unitsConsumed} kWh</p>
        <p><strong>Billing Month:</strong> {result.calculationMonth}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Tier Breakdown</h3>
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border text-left">Tier</th>
              <th className="py-2 px-4 border text-right">Units</th>
              <th className="py-2 px-4 border text-right">Rate/Unit</th>
              <th className="py-2 px-4 border text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {result.tierBreakdown.map((tier, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{tier.tierName}</td>
                <td className="py-2 px-4 border text-right">{tier.unitsInTier.toFixed(2)}</td>
                <td className="py-2 px-4 border text-right">Rs {tier.ratePerUnit.toFixed(2)}</td>
                <td className="py-2 px-4 border text-right">Rs {tier.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right mt-2 font-semibold">
          Base Amount: Rs {result.baseAmount.toFixed(2)}
        </div>
      </div>

      {result.taxes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Taxes</h3>
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border text-left">Tax Name</th>
                <th className="py-2 px-4 border text-right">Type</th>
                <th className="py-2 px-4 border text-right">Value</th>
                <th className="py-2 px-4 border text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {result.taxes.map((tax, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{tax.name}</td>
                  <td className="py-2 px-4 border text-right">{tax.type}</td>
                  <td className="py-2 px-4 border text-right">
                    {tax.type === 'percentage' ? `${tax.value}%` : `Rs ${tax.value}`}
                  </td>
                  <td className="py-2 px-4 border text-right">Rs {tax.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-2 font-semibold">
            Total Tax: Rs {result.totalTax.toFixed(2)}
          </div>
        </div>
      )}

      {result.surcharges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Surcharges</h3>
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border text-left">Surcharge Name</th>
                <th className="py-2 px-4 border text-right">Type</th>
                <th className="py-2 px-4 border text-right">Value</th>
                <th className="py-2 px-4 border text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {result.surcharges.map((surcharge, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{surcharge.name}</td>
                  <td className="py-2 px-4 border text-right">{surcharge.type}</td>
                  <td className="py-2 px-4 border text-right">
                    {surcharge.type === 'percentage' ? `${surcharge.value}%` : `Rs ${surcharge.value}`}
                  </td>
                  <td className="py-2 px-4 border text-right">Rs {surcharge.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-2 font-semibold">
            Total Surcharge: Rs {result.totalSurcharge.toFixed(2)}
          </div>
        </div>
      )}

      <div className="border-t-2 pt-4 mt-6">
        <div className="text-right text-2xl font-bold text-blue-600">
          TOTAL AMOUNT: Rs {result.totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CalculationResults;
