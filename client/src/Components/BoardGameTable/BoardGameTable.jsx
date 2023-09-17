import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./BoardGameTable.css";

const BoardGameTable = () => {
    // State initialization
    const [boardGames, setBoardGames] = useState([]);
    const [maxPlayersInput, setMaxPlayersInput] = useState("");

    // React Router Hooks to Access Current Location and Navigation Functionality
    const location = useLocation();
    const navigate = useNavigate();

    // Fetching Query Params from the URL
    const searchParams = new URLSearchParams(location.search);
    const maxPlayersQueryParam = searchParams.get("maxPlayers");

    // Function to Fetch Board Games from API
    const fetchGames = (maxPlayersQueryParam) => {
        let apiUrl = "/api/games";
        if (maxPlayersQueryParam) {
            apiUrl += `?maxPlayers=${maxPlayersQueryParam}`;
        }

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setBoardGames(data);
            })
            .catch(error => {
                console.error("Error fetching board games", error);
            });
    }

    // useEffect to Fetch Board Games on Initial Load and Query Param Changes
    useEffect(() => {
        fetchGames(maxPlayersQueryParam);
    }, [maxPlayersQueryParam]);

    // Event Handler for Board Game Search
    const handleSearchClick = (e) => {
        e.preventDefault(); // Prevent default form submission
        fetchGames(maxPlayersInput);
    };

    // Event Handler to Navigate to Individual Game Details Page
    const handleNavigate = (gameId) => {
        navigate(`/games-list/${gameId}`);
    }


    // Component JSX
    return (
        <div className="board-game-page">
            <h2>Board Games</h2>
            <div className="search-section">
                <form onSubmit={handleSearchClick}>
                    <label>
                        Max Players:
                        <input
                            type="number"
                            value={maxPlayersInput}
                            onChange={(e) => setMaxPlayersInput(e.target.value)}
                        />
                    </label>
                    <button type={"submit"}>&#x1F50D;</button>
                </form>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Max players</th>
                    </tr>
                </thead>
                <tbody>
                    {boardGames.map(game => (
                        <tr key={game._id}>
                            <td>
                                <Link to={`/games-list/${game._id}`}>
                                    {game.name}
                                </Link>
                            </td>
                            <td>{game.maxPlayers}</td>
                            <td>
                                <button onClick={() => handleNavigate(game._id)}>Go to game</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br></br>
            <Link to="/">
                <button>Back</button>
            </Link>
        </div>
    );
};

export default BoardGameTable;