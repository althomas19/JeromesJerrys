const fs = require('fs');
const path = require('path');

function addNewWeek() {
    // Read the current data.json file
    const dataPath = path.join(__dirname, '..', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log(`Added week ${maxWeek + 1} to all teams`);
}

// Export the function
module.exports = {
    addNewWeek
}; 