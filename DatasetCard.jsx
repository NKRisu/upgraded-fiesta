import React, { useState, useEffect } from 'react';
import './DatasetCard.css'; // Import CSS for glowing circle

function DatasetCard({ title, datasetId, isForecast = false, isHealthCheck = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '12345678901234567890'; // Replace with your API key
  useEffect(() => {
    const fetchData = async (retryCount = 0) => {
      try {
        let endpoint;

        if (isHealthCheck) {
          // Health check endpoint
          endpoint = `/api/health`;
        } else if (isForecast) {
          // Forecast endpoint with startTime and endTime
          const startTime = new Date().toISOString();
          const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          endpoint = `/api/datasets/${datasetId}/data?startTime=${startTime}&endTime=${endTime}`;
        } else {
          // Regular dataset endpoint
          endpoint = `/api/datasets/${datasetId}/data/latest`;
        }

        const response = await fetch(endpoint, {
          headers: {
            'x-api-key': apiKey, // Replace with your API key
          },
        });

        if (!response.ok) {
          if (response.status === 429 && retryCount < 5) {
            // Retry after 2 seconds if rate-limited (429)
            console.warn(`Rate limited. Retrying ${title} in 2 seconds...`);
            setTimeout(() => fetchData(retryCount + 1), 2000);
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [datasetId, isForecast, isHealthCheck]);

  if (loading) return <p>Loading {title}...</p>;
  if (error) return <p>Error loading {title}: {error}</p>;

  // Render the health status as a glowing circle
  if (isHealthCheck) {
    const isHealthy =
      data?.app?.status === 'OK' &&
      data?.database?.status === 'OK' &&
      data?.network?.status === 'OK';

    return (
      <div className="health-status">
        <div className={`status-circle ${isHealthy ? 'healthy' : 'unhealthy'}`}></div>
        <span>{isHealthy ? 'API Health OK' : 'API Health NOT OK'}</span>
      </div>
    );
  }

  return (
    <div>
      <h3>{title}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DatasetCard;