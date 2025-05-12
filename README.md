# Electricity consumption production and spot prices Web App

## Project Overview

This project is a web application designed to display electricity spot prices in real-time. It provides an userfriendly interface to monitor and analyze electricity production and consumption trends.

## Features

- Real-time electricity production and consumption data.
- Proportion of wind power in electricity production.
- Forecast for electricity consumption for the next 24 hours displayed.
- Interactive charts for data visualization using `react-chartjs-2`.
- API health status monitoring with visual indicators.
- User-friendly interface with responsive design.

## Technologies Used

- **Frontend**: React.js, HTML, CSS, JavaScript
- **Charts**: `react-chartjs-2` and `chart.js`
- **Backend**: Fingrid's APIs (via proxy configuration in Vite)
- **Build Tool**: Vite
- **API**: Fingrid APIs, Entso-API for spot prices has been implemented, but it has not been tested.

## Usage

- install vite, "npm install vite --save-dev"
- install chart dependencies, "npm install chart.js react-chartjs-2"
- start development environment by using command "npm run dev".
- command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass", may be needed depending on your settings.
- Open your browser and navigate to `http://localhost:5173`.
- Wait for the application to load in and show the information.

## To-Do list

### Spot prices

- Correct the Entso API calls.
- Test the API calls to be functional and check the response.
- Parse the response data and then integrate this data into graphs.

### UI/UX enhancements

- Clean up minor UI/UX issues.
- Center the website as it is currently lopsided.
- Buttons to swap between the charts and graphs maybe?

### Charts/Graphs

- Chart for the electricity prices.

### Data

- Pruning the data JSON files.

## Notes

- The day-ahead electricity prices feature will be implemented once a reliable and free solution is found or the ENTSO-E API integration is completed.
