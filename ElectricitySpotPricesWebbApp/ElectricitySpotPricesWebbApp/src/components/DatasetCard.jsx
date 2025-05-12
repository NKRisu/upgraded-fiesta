import React from 'react';
import './DatasetCard.css'; // Import CSS for glowing circle

function DatasetCard({ title, data, isHealthCheck, isError }) {
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

  // Render a green or red circle based on the success or failure of the API call
  if (isError) {
    return (
      <div className="health-status">
        <div className="status-circle unhealthy"></div>
        <span>{title} - API Call Failed</span>
      </div>
    );
  }

  if (!data) {
    return <p>Loading {title}...</p>;
  }

  return (
    <div className="health-status">
      <div className="status-circle healthy"></div>
      <span>{title} - API Call Successful</span>
    </div>
  );
}

export default DatasetCard;