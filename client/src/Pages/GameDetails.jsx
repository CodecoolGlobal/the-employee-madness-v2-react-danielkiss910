import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const GameDetails = () => {
    // Extract game ID from the URL parameters
    const { id } = useParams();

    // State to hold game details
    const [gameData, setGameData] = useState(null);

    // Fetch game details based on the ID when the component mounts or the ID changes
    useEffect(() => {
        fetch(`/api/games/${id}`)
        .then(response => response.json())
        .then(data => setGameData(data)) // Set the game data to state when successfully fetched
        .catch(error => console.error("Error fetching game data", error));
    }, [id]); // Dependency array with ID to refresh data if ID changes

    // Display loading state if game data hasn't been fetched yet
    if (!gameData) return <div>Loading...</div>;


    // Render game details
    return (
        <div>
            <h1>{gameData.name}</h1>
            <p>Max Players: <strong>{gameData.maxPlayers}</strong></p>
            <div>
                <Link to="/games-list">
                    <button>Back to Games</button>
                </Link>
            </div>
        </div>
    );
};

export default GameDetails;
