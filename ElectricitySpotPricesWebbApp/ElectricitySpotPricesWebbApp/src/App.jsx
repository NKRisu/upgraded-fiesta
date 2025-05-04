import React, { useState, useEffect } from 'react';
import './global.css';
import DatasetCard from './components/DatasetCard';
import PieChart from './components/PieChart';

function App() {
  const [windPower, setWindPower] = useState(null);
  const [totalProduction, setTotalProduction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const apiKey = '12345678901234567890'; // Replace with your API key

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch wind power production
        const windResponse = await fetch('/api/datasets/181/data/latest', {
          headers: {
            'x-api-key': apiKey,
          },
        });
        if (!windResponse.ok) throw new Error(`Wind Power API Error: ${windResponse.status}`);
        const windData = await windResponse.json();

        // Fetch total electricity production
        const totalResponse = await fetch('/api/datasets/192/data/latest', {
          headers: {
            'x-api-key': apiKey,
          },
        });
        if (!totalResponse.ok) throw new Error(`Total Production API Error: ${totalResponse.status}`);
        const totalData = await totalResponse.json();

        // Set state
        setWindPower(windData.value);
        setTotalProduction(totalData.value);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <PieChart windPower={windPower} totalProduction={totalProduction} />
      </main>
      <footer>
        <p>&copy; 2025 NKRisu on GitHub</p>
      </footer>
    </div>
  );
}

export default App;