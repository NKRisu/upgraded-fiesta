import React, { useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

function PieChart({ windPower, totalProduction, totalConsumption, forecastData }) {
  const [hoverIndex, setHoverIndex] = useState(null); // Tracking index for the hovered slice index

  // Check if data is available before rendering the chart, hanging on the loading message indicates that data is not found and code is broken
  if (windPower === null || totalProduction === null || totalConsumption === null || !forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
    return <p>Loading chart...Please wait...</p>;
  }

  // Import / export calculation
  const isImport = totalConsumption > totalProduction;
  const importExportValue = Math.round(Math.abs(totalConsumption - totalProduction)); // Calculate the import/export value
  const importExportLabel = isImport ? 'Import (MW)' : 'Export (MW)'; // Set the label based on import/export status
  const importExportColor = isImport ? '#FF5733' : '#33FF57'; // Set color based on import/export status

  console.log('Forecast Data in PieChart.jsx:', forecastData);
  // Custom label
  function CustomLegend({ labels, colors }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {labels.map((label, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <div
              style={{
                width: '15px',
                height: '15px',
                backgroundColor: colors[index],
                marginRight: '5px',
                border: '1px solid #000',
              }}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Data for the bar chart
  const barData = {
    labels: ['Total Production (MW)', 'Total Consumption (MW)', importExportLabel], // Labels for the x-axis
    datasets: [
      {
        label: 'Total Production (MW)',
        data: [totalProduction, totalConsumption, importExportValue], // data for the bars
        backgroundColor: ['#4CAF50', '#FF9800', importExportColor],
        borderColor: ['#388E3C', '#F57C00', importExportColor],
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
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderWidth: 2,
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} MW`;
          },
        },
        // Dynamically set the border color
        external: function (context) {
          const tooltip = context.tooltip;
          if (tooltip && tooltip.dataPoints) {
            const dataIndex = tooltip.dataPoints[0].dataIndex;
            const datasetIndex = tooltip.dataPoints[0].datasetIndex;
            const color = context.chart.data.datasets[datasetIndex].backgroundColor[dataIndex];
            tooltip.options.borderColor = color; // Set the border color dynamically
          }
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Electricity (MW)', // Title for the y-axis
        },
        beginAtZero: true, // Start the y-axis at 0
      },
    },
  };

  // Data for the line graph (forecasted energy consumption)
  const lineData = {
    labels: forecastData.map((point) => point.time.replace('.', ':')), // Format time for x-axis
    datasets: [
      {
        label: 'Forecasted Consumption (MW)',
        data: forecastData.map((point) => point.value), // Use values for y-axis
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
  
  const lineOptions = {
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
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Electricity (MW)',
        },
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: Math.max(...forecastData.map((point) => point.value)) + 100, // Dynamically adjust max
      },
    },
  };

  // Data for the pie chart
  const pieData = {
    labels: ['Wind Power (MW)', 'Other Sources (MW)'], // Labels for the pie chart
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
        borderWidth: 2,
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} MW`;
          },
        },
        // Dynamically set the border color
        external: function (context) {
          const tooltip = context.tooltip;
          if (tooltip && tooltip.dataPoints) {
            const dataIndex = tooltip.dataPoints[0].dataIndex;
            const datasetIndex = tooltip.dataPoints[0].datasetIndex;
            const color = context.chart.data.datasets[datasetIndex].backgroundColor[dataIndex];
            tooltip.options.borderColor = color; // Set the border color dynamically
          }
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

  /* Data for the day-ahead prices chart
  const dayAheadPricesData = {
    labels: parsedPrices.map((price) => price.time), // Replace with parsed time data
    datasets: [
      {
        label: 'Day-Ahead Prices (€/MWh)',
        data: parsedPrices.map((price) => price.value), // Replace with parsed price data
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }; */

  return (
    <div>
      <div style={{ position: 'relative', height: '300px', width: '300px', marginBottom: '50px' }}>
        <h3>Electricity Production Breakdown</h3>
        <Pie data={pieData} options={pieOptions} />
      </div>
      <div style={{ position: 'relative', height: '300px', width: '500px' }}>
        <h3>Total Production, Total Consumption and Import/Export</h3>
        {/* Custom Legend */}
        <CustomLegend
          labels={['Total Production (MW)', 'Total Consumption (MW)', importExportLabel]}
          colors={['#4CAF50', '#FF9800', importExportColor]}
        />
        <Bar data={barData} options={barOptions} />
      </div>
      <div style={{ position: 'relative', height: '300px', width: '500px', marginTop: '150px' }}>
        <h3>Forecasted Energy Consumption</h3>
        <Line data={lineData} options={lineOptions} />
      </div>
      {/* Commented out day-ahead prices */}
      {/* <div>
        <h3>Day-Ahead Electricity Prices</h3>
        <Line data={dayAheadPricesData} options={lineOptions} />
      </div> */}
    </div>
  );
}

export default PieChart;