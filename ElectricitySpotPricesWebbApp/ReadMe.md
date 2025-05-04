# Electricity consumption production and spot prices Web App

## Project Overview

This project is a web application designed to display electricity spot prices in real-time. It aims to provide users with an intuitive interface to monitor and analyze electricity price trends.

## Features

- Real-time electricity production and consumption data.
- Proportion of wind power in electricity production.
- Forecast for electricity consumption for the next 24 hours displayed. (graph for this soon...).
- Interactive charts for data visualization using `react-chartjs-2`.
- API health status monitoring with visual indicators.
- User-friendly interface with responsive design.

## Technologies Used

- **Frontend**: React.js, HTML, CSS, JavaScript
- **Charts**: `react-chartjs-2` and `chart.js`
- **Backend**: Fingrid's APIs (via proxy configuration in Vite)
- **Build Tool**: Vite
- **API**: Fingrid APIs, spot prices API once i find a free easy solution...

## Usage

- use command "npm run dev".
- command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass", may be needed depending on your settings.
- Open your browser and navigate to `http://localhost:5173`.
- Wait for the application to load in and show the information.

## To-Do list

### Spot prices

- Spot prices API
- Spot prices JSON parse
- Spot prices graph (fancy)

### UI/UX enhancements

- Show the data neatly in their own containers
- Buttons to swap the charts?
- Understandable layout
- Buttons to switch between graphs/views?

### Charts

- Charts, graphs and other visualisation for the data received

### Data

- Pruning the data JSON files
- Visualising the data neatly (the charts thing...)
