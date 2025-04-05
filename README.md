# My Static Website

A simple, modern static website built with HTML and CSS, designed to be hosted on GitHub Pages.

## How to Host on GitHub Pages

1. Create a new repository on GitHub
2. Upload these files to your repository
3. Go to your repository settings
4. Scroll down to the "GitHub Pages" section
5. Under "Source", select "main" branch
6. Click "Save"
7. Your website will be available at `https://[your-username].github.io/[repository-name]`


## License

This project is open source and available under the [MIT License](LICENSE).

# FFTracker

A web application for tracking Dynasty FF Weekly Punishments.

## Adding a New Week

To add a new week to all teams, run the following command:

```bash
node cli_update addNewWeek
```

## Development

To run the application locally:

`npx serve`

## Data Structure

The application uses a JSON file (`data.json`) to store team data with the following structure:

```json
{
    "teams": [
        {
            "name": "Team Name",
            "history": [
                {
                    "week": 1,
                    "drinks": 0,
                    "drinksCompleted": 0,
                    "players": []
                }
            ]
        }
    ]
}
```

- `drinks` is the amount of players that scored 0 in their lineup that week.
- `drinksCompleted` is how many drinks the team owner completed before the following week kicked off.
- `players` is the list of NFL players who scored 0 in their lineup that week