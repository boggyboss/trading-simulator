import { useStore } from '@/lib/useStore';
import { useState } from 'react';

export default function OrderPanel({ ticker }) {
  const [orderType, setOrderType] = useState('MARKET');
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState(10);
  const [limitPrice, setLimitPrice] = useState(0);
  const executeTrade = useStore(state => state.executeTrade);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticker) {
        alert("Please select a ticker first.");
        return;
    }
    // This is a simplified simulation. A real app would fetch a live quote.
    const currentPrice = 150; 
    const trade = {
        ticker,
        quantity: parseInt(quantity),
        price: orderType === 'LIMIT' ? parseFloat(limitPrice) : currentPrice,
        side,
    };
    executeTrade(trade);
    alert(`Order placed for ${quantity} shares of ${ticker}`);
  };

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">{ticker || "No Ticker"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button type="button" onClick={() => setSide('BUY')} className={`w-full p-2 rounded ${side === 'BUY' ? 'bg-green-600' : 'bg-gray-700'}`}>BUY</button>
          <button type="button" onClick={() => setSide('SELL')} className={`w-full p-2 rounded ${side === 'SELL' ? 'bg-red-600' : 'bg-gray-700'}`}>SELL</button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Order Type</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600">
            <option>MARKET</option>
            <option>LIMIT</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
        </div>
        {orderType === 'LIMIT' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Limit Price</label>
            <input type="number" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
          </div>
        )}
        <button type="submit" className="w-full p-3 bg-blue-600 rounded font-bold hover:bg-blue-700">Place {side} Order</button>
      </form>
    </div>
  );
}