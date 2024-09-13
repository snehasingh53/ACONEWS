require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// CORS configuration
app.use(cors({
  origin: '*', // Be cautious with this in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_KEY = process.env.API_KEY;

// Helper function for API requests
async function makeApiRequest(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    return {
      status: 200,
      success: true,
      message: "Successfully fetched the data",
      data: response.data,
    };
  } catch (error) {
    console.error("API request error:", error.response ? error.response.data : error);
    return {
      status: 500,
      success: false,
      message: "Failed to fetch data from the API",
      error: error.response ? error.response.data : error.message,
    };
  }
}

// Route for general search
app.get("/", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;
  let query = req.query.q || 'example'; // Default query if none provided
  let country = req.query.country; // Get country parameter if provided

  let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&apikey=${API_KEY}${country ? `&country=${country}` : ''}`;
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// Route for top headlines
app.get("/top-headlines", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;
  let category = req.query.category || "general";
  let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&page=${page}&pageSize=${pageSize}&apikey=${API_KEY}`;
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// country-specific news
app.get("/country/:iso", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 80;
  let page = parseInt(req.query.page) || 1;
  const country = req.params.iso; // Extract the country code from the URL
  let url = `https://gnews.io/api/v4/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apikey=${API_KEY}`;
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server is running at port ${PORT}`);
});
