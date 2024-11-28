const tiersContainer = document.getElementById("tiers-container");
const modal = document.getElementById("popup-modal");
const addCountryForm = document.getElementById("add-country-form");
const addCountryBtn = document.getElementById("add-country-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

let countries = [];

// Load countries from the JSON file and render the layout
async function loadCountries() {
    const response = await fetch("/database/countries.json");
    countries = await response.json();
    renderTiers();
}

// Render tier layout
function renderTiers() {
    const tiers = ["S", "A", "B", "C", "D"];
    tiersContainer.innerHTML = ""; // Clear the container

    tiers.forEach((tier) => {
        const tierRow = document.createElement("div");
        tierRow.className = "tier-row";

        const tierTitle = document.createElement("div");
        tierTitle.className = "tier-title";
        tierTitle.textContent = tier;

        const tierContent = document.createElement("div");
        tierContent.className = "tier-content";

        // Separate visited and not visited
        const visited = countries.filter((c) => c.tier === tier && c.visited);
        const notVisited = countries.filter((c) => c.tier === tier && !c.visited);

        const visitedSection = createCountrySection("Visited", visited);
        const notVisitedSection = createCountrySection("Not Visited", notVisited);

        tierContent.appendChild(visitedSection);
        tierContent.appendChild(notVisitedSection);

        tierRow.appendChild(tierTitle);
        tierRow.appendChild(tierContent);
        tiersContainer.appendChild(tierRow);
    });
}

// Create visited/not visited section
function createCountrySection(title, countryList) {
    const section = document.createElement("div");
    section.className = "country-section";

    countryList.forEach((country) => {
        const countryButton = document.createElement("button");
        countryButton.className = "country-button";
        countryButton.style.backgroundImage = `url('/images/flags/${country.name.toLowerCase().replace(" ", "-")}.png')`;
        countryButton.title = country.name; // Tooltip for accessibility
        countryButton.addEventListener("click", () => openCountryPage(country));
        section.appendChild(countryButton);
    });

    return section;
}

// Open the country details page
function openCountryPage(country) {
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    window.location.href = "/country.html";
}

// Add a new country
addCountryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("country-name").value;
    const tier = document.getElementById("country-tier").value;
    const visited = document.getElementById("country-visited").checked;

    const newCountry = {
        name,
        tier,
        visited,
        bestTimeToVisit: "Unknown",
        active: false,
        idealLength: 0,
        flights: "Unknown",
        hotels: "Unknown",
        restaurants: "Unknown",
        estimatedBudget: "Unknown",
        budgetPerNight: "Unknown",
        wonderScore: 0,
        thingsToDoScore: 0,
        foodScore: 0,
        transportationScore: 0,
        safetyScore: 0,
        overallScore: 0,
        itineraryLink: "#",
    };

    countries.push(newCountry); // Add to local array
    renderTiers(); // Re-render the tiers
    modal.classList.add("hidden"); // Close modal
});

// Open and close modal
addCountryBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));

// Load data on page load
loadCountries();
