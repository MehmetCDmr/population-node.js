import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import csv from 'csv-parser';

const app = express();
const PORT = 5555;
let cityData = {};

app.use(bodyParser.text());

// Load city population data from the provided CSV file
async function loadCityData() {
  try {
    // You can use a local CSV file instead of fetching from the URL
    const data = await fs.readFile('city_populations.csv', 'utf-8');
    cityData = {};

    // Parse the CSV data and populate the cityData object
    const rows = data.split('\n');
    rows.shift(); // Remove the header row
    rows.forEach((row) => {
      const [city, state, population] = row.split(',');
      const key = `${city.trim().toLowerCase()}_${state.trim().toLowerCase()}`;
      cityData[key] = parseInt(population);
    });

    console.log('City data loaded successfully.');
  } catch (err) {
    console.error('Error loading city data:', err);
  }
}

loadCityData();

// Define a route to get the population of a city in a specific state
app.get('/api/population/city/:city/state/:state', (req, res) => {
  const { city, state } = req.params;
  const key = `${city.trim().toLowerCase()}_${state.trim().toLowerCase()}`;

  // Check if the city exists in the loaded cityData
  if (cityData.hasOwnProperty(key)) {
    const population = cityData[key];
    res.json({ city, state, population });
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
