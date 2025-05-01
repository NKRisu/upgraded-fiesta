// This is where your possible functionality code for the index page would go.

// Wait for the DOM to fully load, makes sure website is fully loaded.
document.addEventListener("DOMContentLoaded", function() {
    // Get the checkbox and the message elements.
    const checkbox = document.getElementById("TestCheckBox");
    const message = document.getElementById("checkboxMessage");

    // Add an event listener to the checkbox.
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            // If the checkbox is checked, show the message.
            message.style.display = "block";
        } else {
            // If the checkbox is not checked, hide the message.
            message.style.display = "none";
        }
    });
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const apiKey = 'fdc7d0fc61eb47bbb5e6ad1c2f69fd66'; // API Key
// datasetIds; 181 = wind power, 193 = electricity consumption, 192 = electricity production, 165 = forecast

// Check API health and proceed with other API calls if healthy
async function getHealthStatus() {
    try {
        const response = await fetch('/api/health');

        // Ensure the response is valid
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response
        console.log("Frontend /api/health response:", data); // Debugging

        const healthStatusElement = document.getElementById("healthStatus");

        // Check if the data object has the expected structure
        if (data && data.app && data.database && data.network) {
            healthStatusElement.innerHTML = `
                <strong>API Health Status:</strong><br>
                App: ${data.app.status}<br>
                Database: ${data.database.status}<br>
                Network: ${data.network.status}
            `;

            // If all statuses are "OK", proceed with other API calls
            if (
                data.app.status === "OK" &&
                data.database.status === "OK" &&
                data.network.status === "OK"
            ) {
                await delay(2000); // 2-second delay
                await getWindPowerProductionData();
                await delay(2000); // 2-second delay
                await getConsumptionData();
                await delay(2000); // 2-second delay
                await getProductionData();
                await delay(2000); // 2-second delay
                await getForecastData();
            } else {
                console.error("Health check failed: One or more components are not OK.");
            }
        } else {
            throw new Error("Unexpected response structure from /api/health");
        }
    } catch (err) {
        console.error("Failed to fetch health status:", err);

        const healthStatusElement = document.getElementById("healthStatus");
        healthStatusElement.textContent = "API Health Status: Failed (Error)";
    }
}
getHealthStatus(); // Call the function to get the health status

async function getWindPowerProductionData() {
    try {
        const response = await fetch('/api/datasets/181');

        if (response.ok) {
            const data = await response.json(); // Parse JSON response
            console.log("Wind Power Data:", data);

            // Display data on the webpage
            const windPowerElement = document.getElementById("windPowerData");
            windPowerElement.textContent = `Wind Power Production: ${JSON.stringify(data)}`;
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (err) {
        console.error("Failed to fetch wind power production data:", err);
    }
}

// Fetch and display electricity consumption data
async function getConsumptionData() {
    try {
        const response = await fetch('/api/datasets/192');

        if (response.ok) {
            const data = await response.json(); // Parse JSON response
            console.log(data);

            // Display data on the webpage
            const consumptionElement = document.getElementById("consumptionData");
            consumptionElement.textContent = `Electricity Consumption: ${JSON.stringify(data)}`;
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (err) {
        console.error("Failed to fetch electricity consumption data:", err);
    }
}

// Fetch and display electricity production data
async function getProductionData() {
    try {
        const response = await fetch('/api/datasets/192');

        if (response.ok) {
            const data = await response.json(); // Parse JSON response
            console.log("Electricity Production Data:", data);

            // Display data on the webpage
            const productionElement = document.getElementById("productionData");
            productionElement.textContent = `Electricity Production: ${JSON.stringify(data)}`;
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (err) {
        console.error("Failed to fetch electricity production data:", err);
    }
}

// Fetch and display forecast data
async function getForecastData() {
    try {
        const response = await fetch('/api/datasets/165');

        if (response.ok) {
            const data = await response.json(); // Parse JSON response
            console.log(data);

            // Display data on the webpage
            const forecastElement = document.getElementById("forecastData");
            forecastElement.textContent = `Forecast Data: ${JSON.stringify(data)}`;
        } else {
            console.error(`Error: ${response.status}`);
        }
    } catch (err) {
        console.error("Failed to fetch forecast data:", err);
    }
}