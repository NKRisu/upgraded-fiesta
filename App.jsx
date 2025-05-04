import React, { useState, useEffect } from 'react';
import './global.css';
import DatasetCard from './components/DatasetCard';
import PieChart from './components/PieChart';

function App() {
  const [windPower, setWindPower] = useState(null);
  const [totalProduction, setTotalProduction] = useState(null);
  const [totalConsumption, setTotalConsumption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const apiKey = '12345678901234567890'; // Replace with your API key


  // Reusable function to fetch data with retry logic
  const fetchDataWithRetry = async (url, retryCount = 0, maxRetries = 5) => {
    try {
      const response = await fetch(url, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < maxRetries) {
          console.warn(`Rate limited. Retrying ${url} in 2 seconds...`);
          return new Promise((resolve) =>
            setTimeout(() => resolve(fetchDataWithRetry(url, retryCount + 1, maxRetries)), 2000)
          );
        }
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const windData = await fetchDataWithRetry('/api/datasets/181/data/latest');
        const totalData = await fetchDataWithRetry('/api/datasets/192/data/latest');
        const consumptionData = await fetchDataWithRetry('/api/datasets/193/data/latest');

        // Set state
        setWindPower(windData.value);
        setTotalProduction(totalData.value);
        setTotalConsumption(consumptionData.value);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  return (
    <div className="App">
      <header>
        <h1>Electricity Spot Prices Web App</h1>
      </header>
      <main>
        <DatasetCard title="API Health Status" datasetId="health" isHealthCheck={true} />
        <DatasetCard title="Wind Power Production" datasetId="181" />
        <DatasetCard title="Electricity Consumption" datasetId="193" />
        <DatasetCard title="Electricity Production" datasetId="192" />
        <DatasetCard title="Forecast (Next 24 Hours)" datasetId="165" isForecast={true} />
        <PieChart windPower={windPower} totalProduction={totalProduction} totalConsumption={totalConsumption} />
      </main>
      <footer>
        <p>&copy; 2025 NKRisu on GitHub</p>
      </footer>
    </div>
  );
}

export default App;