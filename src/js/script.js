// Calculation functions
function calculateCarriedOverDrinks(team, week) {
    if (week <= 1) return 0;
    
    const prevWeekEntry = team.history.find(entry => entry.week === week - 1);
    if (prevWeekEntry) {
        const prevWeekCarriedOver = calculateCarriedOverDrinks(team, week - 1);
        const prevWeekEarned = prevWeekEntry.drinks;
        const prevWeekTotal = prevWeekCarriedOver + prevWeekEarned;
        const uncompleted = prevWeekTotal - prevWeekEntry.drinksCompleted;
        return uncompleted * 2;
    }
    return 0;
}

function calculateWeekDrinks(team, week) {
    const weekEntry = team.history.find(entry => entry.week === week);
    if (!weekEntry) return 0;

    if (week === 1) {
        return weekEntry.drinks; // For week 1, just return earned drinks
    }

    const carriedOver = calculateCarriedOverDrinks(team, week);
    const earned = weekEntry.drinks;
    
    return carriedOver + earned;
}

// DOM-dependent functions
let drinkData = {};
let drinkChart = null;

function loadData() {
    fetch('src/js/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            drinkData = data;
            updateChart();
            updateTeamSelector();
            updateHistoryDisplay();
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
}

// Function to prepare chart data
function prepareChartData() {
    const maxWeek = Math.max(...drinkData.teams.flatMap(team => 
        team.history.map(entry => entry.week)
    ));
    
    const weeks = Array.from({length: maxWeek + 1}, (_, i) => i);
    
    const datasets = drinkData.teams.map(team => {
        const data = weeks.map(week => {
            const weekEntry = team.history.find(entry => entry.week === week);
            if (weekEntry) {
                return calculateWeekDrinks(team, week);
            }
            return null;
        });
        
        return {
            label: team.name,
            data: data,
            borderColor: getRandomColor(),
            backgroundColor: 'rgba(0, 0, 0, 0)',
            tension: 0.1,
            fill: false
        };
    });
    
    return {
        labels: weeks.map(week => week === 0 ? 'Start of Season' : `Week ${week}`),
        datasets: datasets
    };
}

// Function to update the chart
function updateChart() {
    const ctx = document.getElementById('drinkChart');
    
    if (drinkChart) {
        drinkChart.destroy();
    }
    
    const chartData = prepareChartData();
    
    drinkChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Drinks Owed'
                    },
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    align: 'start',
                    labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                            size: 10
                        }
                    }
                },
                title: {
                    text: 'Drink Progression by Team'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const team = drinkData.teams[context.datasetIndex];
                            const week = context.dataIndex;
                            const weekEntry = team.history.find(entry => entry.week === week);
                            const completed = weekEntry ? weekEntry.drinksCompleted : 0;
                            const earnedDrinks = weekEntry ? weekEntry.drinks : 0;
                            const carriedOver = calculateCarriedOverDrinks(team, week);
                            
                            let tooltipLines = [
                                `${context.dataset.label}:`,
                                `Owed: ${Math.round(context.raw)} drinks`
                            ];
                            
                            if (carriedOver > 0) {
                                tooltipLines.push(`Earned: ${earnedDrinks} drinks`);
                                tooltipLines.push(`Carried Over (Doubled): ${carriedOver} drinks`);
                            }
                            
                            tooltipLines.push(`Completed: ${completed} drinks`);
                            return tooltipLines;
                        }
                    }
                }
            }
        }
    });
}

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to update the team selector
function updateTeamSelector() {
    const teamSelect = document.getElementById('team-select');
    teamSelect.innerHTML = '';
    
    drinkData.teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.name;
        option.textContent = `${team.name} - ${team.owner}`;
        teamSelect.appendChild(option);
    });
    
    // Update history display when team is selected
    teamSelect.addEventListener('change', () => {
        updateHistoryDisplay();
    });
}

// Function to update the history display
function updateHistoryDisplay() {
    const tbody = document.querySelector('#history-container tbody');
    const selectedTeam = document.getElementById('team-select').value;
    const team = drinkData.teams.find(t => t.name === selectedTeam);
    
    if (!team) return;
    
    tbody.innerHTML = '';
    
    team.history.forEach(entry => {
        const weekDrinks = calculateWeekDrinks(team, entry.week);
        const completed = entry.drinksCompleted;
        const earnedDrinks = entry.drinks;
        const carriedOver = calculateCarriedOverDrinks(team, entry.week);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.week === 0 ? 'Start of Season' : `Week ${entry.week}`}</td>
            <td>${weekDrinks} drinks</td>
            <td>${earnedDrinks} drinks</td>
            <td>${carriedOver > 0 ? `${carriedOver} drinks` : '-'}</td>
            <td>${completed} drinks</td>
            <td>${entry.players.length > 0 ? entry.players.join(', ') : '-'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Export functions for testing in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateCarriedOverDrinks,
        calculateWeekDrinks
    };
}

// Initialize the page in browser environment
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        loadData();
    });
} 