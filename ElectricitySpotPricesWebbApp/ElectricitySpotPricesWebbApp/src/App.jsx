import React, { useState, useEffect } from 'react';
import './global.css';
import DatasetCard from './components/DatasetCard';
import PieChart from './components/PieChart';

// All code related to the electricity prices has been commented out, I did not receive an email from Entso, so I could not test the code. 
// Code is placeholder for future implementation.
// import { XMLParser } from 'fast-xml-parser';

function App() {

  // State variables
  const [windPower, setWindPower] = useState(null);
  const [totalProduction, setTotalProduction] = useState(null);
  const [totalConsumption, setTotalConsumption] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Electricity prices
  const [dayAheadPrices, setDayAheadPrices] = useState(null);
  const [dayAheadPricesError, setDayAheadPricesError] = useState(false); */

  // Error states
  const [windPowerError, setWindPowerError] = useState(false);
  const [totalProductionError, setTotalProductionError] = useState(false);
  const [totalConsumptionError, setTotalConsumptionError] = useState(false);
  const [forecastDataError, setForecastDataError] = useState(false);
  const [healthDataError, setHealthDataError] = useState(false);

  const apiKey = 'YOUR-API-KEY-HERE'; // Replace with your API key

  // Function to retry fetching data in case of rate limits
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
          await sleep(2000);
          return fetchDataWithRetry(url, retryCount + 1, maxRetries);
        }
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      if (retryCount < maxRetries) {
        console.warn(`Retrying ${url} (${retryCount + 1}/${maxRetries})...`);
        await sleep(2000);
        return fetchDataWithRetry(url, retryCount + 1, maxRetries);
      }
      throw err; // Throw error if max retries are exceeded
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch data from the API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch wind power data
        try {
          const windData = await fetchDataWithRetry('/api/datasets/181/data/latest');
          setWindPower(windData.value);
        } catch {
          setWindPowerError(true);
        }
        await sleep(2000);

        // Fetch total production data
        try {
          const totalData = await fetchDataWithRetry('/api/datasets/192/data/latest');
          setTotalProduction(totalData.value);
        } catch {
          setTotalProductionError(true);
        }
        await sleep(2000);

        // Fetch total consumption data
        try {
          const consumptionData = await fetchDataWithRetry('/api/datasets/193/data/latest');
          setTotalConsumption(consumptionData.value);
        } catch {
          setTotalConsumptionError(true);
        }
        await sleep(2000);

        // Fetch forecast data
        try {
          const startTime = new Date().toISOString();
          const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          const forecastUrl = `/api/datasets/165/data?startTime=${startTime}&endTime=${endTime}&format=json&pageSize=96&sortBy=startTime&sortOrder=asc`; // 15x4 = 60, hence 24 x 4 = 96, adjust number for shorter period 
          const forecastResponse = await fetchDataWithRetry(forecastUrl);

          const processedForecastData = forecastResponse.data.map((entry) => ({
            time: new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: entry.value,
          }));
          setForecastData(processedForecastData);
        } catch {
          setForecastDataError(true);
        }
        await sleep(2000);

        // Fetch API health status
        try {
          const healthResponse = await fetchDataWithRetry('/api/health');
          setHealthData(healthResponse);
        } catch {
          setHealthDataError(true);
        }

        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  /* Fetch electricity prices from ENTSO-E API 
  const fetchElectricityPrices = async () => {
    const apiKey = 'YOUR_SECURITY_TOKEN'; // Replace with your ENTSO-E API key
    // Edit this to use YYYYMMDDHHMM format instead
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const url = `https://web-api.tp.entsoe.eu/api?documentType=A44&in_Domain=10YFI-1--------U&out_Domain=10YFI-1--------U&periodStart=${startDate}&periodEnd=${endDate}&securityToken=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const xmlData = await response.text(); // ENTSO-E API returns XML
      const parser = new XMLParser();
      const jsonData = parser.parse(xmlData);

      // Extract relevant data from the parsed JSON
      const prices = jsonData.Publication_MarketDocument.TimeSeries[0].Period.Point.map((point) => ({
        time: point.position, // Replace with actual time parsing logic
        value: parseFloat(point['price.amount']), // Replace with actual price field
      }));

      setDayAheadPrices(prices); // Set the parsed prices
    } catch (error) {
      console.error('Error fetching day-ahead prices:', error);
      setDayAheadPricesError(true);
    }
  };

  useEffect(() => {
    fetchDayAheadPrices(); // Fetch day-ahead prices on component mount
  }, []); */



  if (loading) return <p>Loading data...Please wait for roughly 10 seconds... Upgrade Fingrid API account for faster loadtime...</p>;
  if (error) return <p>Error loading data: {error}</p>;
 
  return (
    <div className="App">
      <header>
        <h1>Electricity Spot Prices Web App</h1>
      </header>
      <main>
        <h3>API Health</h3>
        <DatasetCard title="API Health Status" data={healthData} isHealthCheck={true} isError={healthDataError} />
        <DatasetCard title="Wind Power Production" data={{ value: windPower }} isError={windPowerError} />
        <DatasetCard title="Electricity Consumption" data={{ value: totalConsumption }} isError={totalConsumptionError} />
        <DatasetCard title="Electricity Production" data={{ value: totalProduction }} isError={totalProductionError} />
        <DatasetCard title="Forecast (Next 24 Hours)" data={forecastData} isError={forecastDataError} />
        {/* Commented out day-ahead prices */}
        {/* <PieChart windPower={windPower} totalProduction={totalProduction} totalConsumption={totalConsumption} forecastData={forecastData} dayAheadPrices={dayAheadPrices} /> */}
        <PieChart windPower={windPower} totalProduction={totalProduction} totalConsumption={totalConsumption} forecastData={forecastData} />
      </main>
      <footer>
        <p>&copy; 2025 NKRisu on GitHub</p>
      </footer>
    </div>
  );
}

export default App;