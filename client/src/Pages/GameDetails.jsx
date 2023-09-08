import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const GameDetails = () => {
    const { id } = useParams();
    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        fetch(`/api/games/${id}`)
        .then(response => response.json())
        .then(data => setGameData(data))
        .catch(error => console.error("Error fetching game data", error));
    }, [id]); // Dependency array with ID to refresh data if ID changes

    if (!gameData) return <div>Loading...</div>;

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
