import { createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

export default function Chart({ ticker }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { backgroundColor: '#1a1a1a', textColor: '#d1d4dc' },
      grid: { vertLines: { color: '#333' }, horzLines: { color: '#333' } },
      crosshair: { mode: 1 },
      priceScale: { borderColor: '#485c7b' },
      timeScale: { borderColor: '#485c7b', timeVisible: true, secondsVisible: false },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350',
      borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a',
    });
    
    const handleResize = () => chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!ticker || !seriesRef.current) return;
    setError(null);
    seriesRef.current.setData([]);

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/data?ticker=${ticker}`);
        if (!res.ok) {
           const errorData = await res.json();
           throw new Error(errorData.error || "Failed to fetch chart data");
        }
        const data = await res.json();
        if (data.length > 0) {
            seriesRef.current.setData(data);
            chartRef.current.timeScale().fitContent();
        } else {
            setError(`No data for ${ticker}. It may not have traded recently or the ticker is invalid.`);
        }
      } catch (e) {
        setError(e.message);
      }
    };

    fetchData();
  }, [ticker]);

  return (
    <div className="w-full relative">
        <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />
        {error && <div className="absolute top-4 left-4 text-red-500 bg-black bg-opacity-50 p-2 rounded">{error}</div>}
    </div>
  );
}