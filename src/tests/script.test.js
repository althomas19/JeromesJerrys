// Import the functions we want to test
const { calculateCarriedOverDrinks, calculateWeekDrinks } = require('../js/script.js');

describe('Drinks Calculation Tests', () => {
    const testData = {
        season: "2025",
        teams: [
            {
                name: "Team 1",
                owner: "Owner 1",
                history: [
                    { week: 1, drinks: 1, drinksCompleted: 0, players: ["Kyle Pitts"] },
                    { week: 2, drinks: 0, drinksCompleted: 1, players: [] },
                    { week: 3, drinks: 1, drinksCompleted: 2, players: ["Kyle Pitts"] },
                    { week: 4, drinks: 0, drinksCompleted: 0, players: [] }
                ]
            },
            {
                name: "Team 2",
                owner: "Owner 2",
                history: [
                    { week: 1, drinks: 3, drinksCompleted: 3, players: ["Payton Manning", "Tom Brady", "Aaron Rodgers"] },
                    { week: 2, drinks: 0, drinksCompleted: 0, players: [] },
                    { week: 3, drinks: 1, drinksCompleted: 1, players: ["Van Jefferson"] },
                    { week: 4, drinks: 0, drinksCompleted: 0, players: [] }
                ]
            }
        ]
    };

    /*
    Expected drinks per week:
    Team 1:
    Week 1: 1 drink (earned), 0 consumed
    Week 2: 2 drinks (0 earned + 2 carried over from week 1), 1 consumed
    Week 3: 3 drinks (1 earned + 2 carried over from week 2), 2 consumed
    Week 4: 2 drinks (0 earned + 2 carried over from week 3), 0 consumed

    Team 2:
    Week 1: 3 drinks (earned), 3 consumed
    Week 2: 0 drinks (0 earned, all completed in week 1), 0 consumed
    Week 3: 1 drink (earned), 1 consumed
    Week 4: 0 drinks (0 earned, all completed in week 3), 0 consumed
    */

    test('should calculate drinks correctly for all weeks and teams', () => {
        // Team 1
        expect(calculateWeekDrinks(testData.teams[0], 1)).toBe(1);
        expect(calculateWeekDrinks(testData.teams[0], 2)).toBe(2);
        expect(calculateWeekDrinks(testData.teams[0], 3)).toBe(3);
        expect(calculateWeekDrinks(testData.teams[0], 4)).toBe(2);

        // Team 2
        expect(calculateWeekDrinks(testData.teams[1], 1)).toBe(3);
        expect(calculateWeekDrinks(testData.teams[1], 2)).toBe(0);
        expect(calculateWeekDrinks(testData.teams[1], 3)).toBe(1);
        expect(calculateWeekDrinks(testData.teams[1], 4)).toBe(0);
    });
}); 