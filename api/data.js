export default async function handler(req, res) {
  const { ticker } = req.query;
  const apiKey = process.env.POLYGON_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const now = new Date();
  let lastMarketDay = new Date(now);

  // Step back one day at a time until we find a weekday (Mon–Fri)
  while (lastMarketDay.getDay() === 0 || lastMarketDay.getDay() === 6) {
    lastMarketDay.setDate(lastMarketDay.getDate() - 1);
  }

  const dateStr = lastMarketDay.toISOString().split("T")[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/minute/${dateStr}/${dateStr}?adjusted=true&sort=asc&limit=1000&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (!json.results || json.results.length === 0) {
      return res.status(404).json({ error: "No trading data found" });
    }

    const candles = json.results;

    const prices = candles.map((c) => c.c);
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const sma20 = avg(prices.slice(-20));
    const sma200 = avg(prices.slice(-200));
    const last30 = prices.slice(-30);
    const last30Range = {
      min: Math.min(...last30),
      max: Math.max(...last30),
    };

    const price = candles.at(-1)?.c;
    const prevClose = candles[0]?.o;

    // Simulated setup type
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
  } catch (err) {
    console.error("Error fetching Polygon data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
