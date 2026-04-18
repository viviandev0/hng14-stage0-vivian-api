const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Requirement: CORS header: Access-Control-Allow-Origin: *
app.use(cors());

app.get('/api/classify', async (req, res) => {
  const { name } = req.query;

  // 1. Input Validation: Missing or empty name returns 400 Bad Request
  if (name === undefined || name.trim() === "") {
    return res.status(400).json({ 
      status: "error", 
      message: "Name parameter is required" 
    });
  }

  // 2. Input Validation: Non-string name returns 422 Unprocessable Entity
  // (Note: In URLs, numbers come in as strings, but we check if it's strictly numeric)
  if (!isNaN(name) && !/^[a-zA-Z]+$/.test(name)) {
    return res.status(422).json({ 
      status: "error", 
      message: "Non-string name provided" 
    });
  }

  try {
    // 3. External API Integration
    const response = await axios.get(`https://api.genderize.io?name=${encodeURIComponent(name)}`, { 
        timeout: 4500 // Staying under 500ms is target, but we allow for external latency
    });
    
    const { gender, probability, count } = response.data;

    // 4. Genderize Edge Cases: gender: null or count: 0
    if (gender === null || count === 0) {
      return res.status(404).json({ 
        status: "error", 
        message: "No prediction available for the provided name" 
      });
    }

    // 5. Confidence Logic: probability >= 0.7 AND sample_size >= 100
    // Requirement: Both conditions must be met for true
    const is_confident = probability >= 0.7 && count >= 100;

    // 6. Expected Response Format (Success)
    res.status(200).json({
      status: "success",
      data: {
        name: name,
        gender: gender,
        probability: probability,
        sample_size: count, // Renamed from count
        is_confident: is_confident,
        processed_at: new Date().toISOString() // UTC ISO 8601
      }
    });

  } catch (error) {
    // 7. Error Handling structure
    const statusCode = error.response ? error.response.status : 500;
    res.status(statusCode).json({ 
      status: "error", 
      message: error.message || "Internal Server Error" 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
