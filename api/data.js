export default async function handler(req, res) {
  const { ticker } = req.query;
  const apiKey = process.env.POLYGON_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const today = new Date();
  let target = new Date(today);

  // Try up to 7 days back to find data (weekends/holidays fallback)
  let data = null;
  for (let i = 0; i < 7; i++) {
    const dateStr = target.toISOString().split("T")[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/minute/${dateStr}/${dateStr}?adjusted=true&sort=asc&limit=1000&apiKey=${apiKey}`;
    const response = await fetch(url);
    const json = await response.json();

    if (json.results && json.results.length > 0) {
      data = json.results;
      break;
    }
    // Try the previous day
    target.setDate(target.getDate() - 1);
  }

  if (!data) {
    return res.status(404).json({ error: "No trading data found" });
  }

  const prices = data.map((c) => c.c);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const sma20 = avg(prices.slice(-20));
  const sma200 = avg(prices.slice(-200));
  const last30 = prices.slice(-30);
  const last30Range = {
    min: Math.min(...last30),
    max: Math.max(...last30),
  };

  const price = data.at(-1)?.c;
  const prevClose = data[0]?.o;

  // Randomly simulate a setup type for now
  const setups = ["RBI", "EB", "RBTO", "GBTO", "+180", "-180"];
  const setup = setups[Math.floor(Math.random() * setups.length)];

  res.status(200).json({
    price,
    sma20,
    sma200,
    prevClose,
    last30Range,
    setup,
  });
}
