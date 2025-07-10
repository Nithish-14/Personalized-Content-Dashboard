import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const { category = 'general', page = 1 } = req.query;

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        category,
        pageSize: 10,
        page,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('News API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ NewsAPI Proxy running at http://localhost:${PORT}`);
});
