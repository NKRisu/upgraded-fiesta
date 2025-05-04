import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ windPower, totalProduction }) {
  if (windPower === null || totalProduction === null) {
    return <p>Loading chart...</p>;
  }

  const data = {
    labels: ['Wind Power', 'Other Sources'],
    datasets: [
      {
        data: [windPower, totalProduction - windPower],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      <h3>Electricity Production Breakdown</h3>
      <Pie data={data} />
    </div>
  );
}

export default PieChart;