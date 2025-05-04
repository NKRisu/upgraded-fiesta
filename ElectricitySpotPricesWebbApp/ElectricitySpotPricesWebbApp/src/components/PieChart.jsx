import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function PieChart({ windPower, totalProduction, totalConsumption }) {
  const [hoverIndex, setHoverIndex] = useState(null); // Tracking index for the hovered slice index

  if (windPower === null || totalProduction === null || totalConsumption === null) {
    return <p>Loading chart...</p>;
  }


  // Data for the column chart
  const barData = {
    labels: ['Total Production', 'Total Consumption'],
    datasets: [
      {
        label: 'Electricity (MW)',
        data: [totalProduction, totalConsumption],
        backgroundColor: ['#4CAF50', '#FF9800'],
        borderColor: ['#388E3C', '#F57C00'],
        borderWidth: 1,
      },
    ],
  };

  // Options for the bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Category',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Electricity (MW)',
        },
        beginAtZero: true,
      },
    },
  };

  // Data for the pie chart
  const pieData = {
    labels: ['Wind Power', 'Other Sources'], // Labels for the pie chart
    datasets: [
      {
        data: [windPower, totalProduction - windPower],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: hoverIndex !== null
          ? hoverIndex === 0
            ? ['#000', '#FF6384'] // Highlight "Wind Power" slice
            : ['#36A2EB', '#000'] // Highlight "Other Sources" slice
          : ['#FFFFFF', '#FFFFFF'], // Default border color when not hovering
        borderWidth: 2,
        hoverOffset: 30, // Inflate the slice by 10px on hover
      },
    ],
  };

  // Options for the pie chart
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#36A2EB',
        borderWidth: 2,
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} MW`; // Custom label format
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    hover: {
      mode: 'nearest',
      animationDuration: 400,
    },
    animation: {
      duration: 500,
      easing: 'easeInOutQuad',
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        setHoverIndex(chartElement[0].index); // Set the hovered slice index
        event.native.target.style.cursor = 'pointer';
      } else {
        setHoverIndex(null); // Reset hover index when not hovering over a slice
        event.native.target.style.cursor = 'default';
      }
    },
  };

  return (
    <div>
      <div style={{ position: 'relative', height: '300px', width: '300px', marginBottom: '50px' }}>
        <h3>Electricity Production Breakdown</h3>
        <Pie data={pieData} options={pieOptions} />
      </div>
      <div style={{ position: 'relative', height: '300px', width: '500px' }}>
        <h3>Total Production vs Total Consumption</h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}

export default PieChart;