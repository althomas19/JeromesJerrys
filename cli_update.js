const fs = require('fs');
const path = require('path');

// Data file path
const DATA_FILE = './data.json';

// Load data from file or use default
function loadData() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Save data to file
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Add a new week
function addNewWeek() {
    const data = loadData();
    
    // Get the current maximum week number
    const maxWeek = Math.max(...data.teams.flatMap(team => 
        team.history.map(entry => entry.week)
    ));

    // Add a new week to each team
    data.teams.forEach(team => {
        team.history.push({
            week: maxWeek + 1,
            drinks: 0,
            drinksCompleted: 0,
            players: []
        });
    });

    // Write the updated data back to the file
    saveData(data);
    console.log(`Added week ${maxWeek + 1} to all teams`);
}

// Handle CLI commands
function main() {
    const command = process.argv[2];

    switch (command) {
        case 'addNewWeek':
            addNewWeek();
            break;
        default:
            console.log('Usage: node cli_update.js addNewWeek');
    }
}

main();