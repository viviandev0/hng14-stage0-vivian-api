// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors())
app.get('/api/classify', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({status: "error", message: "Name is missing" });
  }
  if (typeof name !== 'string' || !isNaN(name)) {
    return res.status(422).json ({ status: 'error', message: "Invaild Name Formaat"})
  }
  try{
    const response = await axios.get(`https://api.genderize.io?name=${name}`);
    const { gender, probability, count } = response.data;

    if (!gender) {
      return res.status(200).json({ status : "error", message: "No Prediction available for the provided name" });
    }

    const is_confident = probability >= 0.7 && count >= 100;

    res.json({
      status: "success",
      date: {
        name: name,
        gender: gender,
        probability : probability,
        sample_size: count,
        is_confident: is_confident,
        processed_at: new Date(). toISOString()
      }
    });
  } catch (error) {
    res.status (500).json({ status: "error", message: "Internal Server Error" });
  }
});

const PORT =3000;
app.listen(PORT, () => console.log(`Detective is awake on port ${PORT}`));
