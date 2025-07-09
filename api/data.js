export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol is required' });
  }

  const API_KEY = process.env.POLYGON_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const to = now.toISOString().split('T')[0];
  const from = yesterday.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/minute/${from}/${to}?adjusted=true&sort=asc&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: `Failed to fetch data from Polygon.io: ${errorData.error || response.statusText}` });
    }
    const data = await response.json();
    
    // Format for Lightweight Charts
    const formattedData = (data.results || []).map(bar => ({
      time: bar.t / 1000,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}