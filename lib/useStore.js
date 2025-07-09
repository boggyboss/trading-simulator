import { create } from 'zustand';

export const useStore = create((set) => ({
  balance: 100000, // Starting with $100,000
  positions: {}, // e.g., { 'AAPL': { quantity: 10, avgPrice: 150 } }
  pnl: 0,

  // Function to execute a trade
  executeTrade: (trade) => {
    set(state => {
      const { ticker, quantity, price } = trade;
      const currentPosition = state.positions[ticker] || { quantity: 0, avgPrice: 0 };
      const newBalance = state.balance - (price * quantity);

      // Simple buy logic
      const totalCost = currentPosition.avgPrice * currentPosition.quantity + price * quantity;
      const newQuantity = currentPosition.quantity + quantity;
      const newAvgPrice = totalCost / newQuantity;

      const newPositions = {
        ...state.positions,
        [ticker]: { quantity: newQuantity, avgPrice: newAvgPrice },
      };

      return { balance: newBalance, positions: newPositions };
    });
  },
}));