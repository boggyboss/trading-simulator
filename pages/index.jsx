import Chart from "@/components/Chart";
import OrderPanel from "@/components/OrderPanel";
import Portfolio from "@/components/Portfolio";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [ticker, setTicker] = useState('SPY');
  const [inputValue, setInputValue] = useState('SPY');

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue) {
      setTicker(inputValue.toUpperCase());
    }
  };

  return (
    <>
      <Head>
        <title>Trading Simulator</title>
        <meta name="description" content="A trading simulator with real delayed data." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-[#121212] text-white p-4">
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-center">Trading Simulator</h1>
          <form onSubmit={handleSearch} className="flex justify-center mt-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-2 bg-gray-800 border border-gray-600 rounded-l-md"
              placeholder="e.g., AAPL, TSLA"
            />
            <button type="submit" className="p-2 bg-blue-600 rounded-r-md font-bold">Search</button>
          </form>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Chart ticker={ticker} />
          </div>
          <div className="lg:col-span-1">
            <OrderPanel ticker={ticker} />
            <Portfolio />
          </div>
        </div>
      </main>
    </>
  );
}