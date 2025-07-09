import { useStore } from '@/lib/useStore';

export default function Portfolio() {
  const { balance, positions, pnl } = useStore();

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-lg mt-4">
      <h2 className="text-xl font-bold mb-4">Account Overview</h2>
      <div className="flex justify-between mb-2">
        <span>Balance:</span>
        <span>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span>Unrealized P&L:</span>
        <span className={pnl >= 0 ? 'text-green-500' : 'text-red-500'}>${pnl.toFixed(2)}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">Open Positions</h3>
      <div className="h-40 overflow-y-auto">
        {Object.keys(positions).length > 0 ? (
          Object.entries(positions).map(([ticker, pos]) => (
            <div key={ticker} className="flex justify-between items-center p-2 border-b border-gray-700">
              <div>
                <span className="font-bold">{ticker}</span>
                <span className="text-sm text-gray-400 ml-2">Qty: {pos.quantity}</span>
              </div>
              <span className="text-sm">Avg: ${pos.avgPrice.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center pt-8">No open positions.</p>
        )}
      </div>
    </div>
  );
}