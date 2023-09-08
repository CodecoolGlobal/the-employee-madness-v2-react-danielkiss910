import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./BoardGameTable.css";

const BoardGameTable = () => {
    const [boardGames, setBoardGames] = useState([]);
    const [maxPlayersInput, setMaxPlayersInput] = useState("");

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const maxPlayersQueryParam = searchParams.get("maxPlayers");

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

    useEffect(() => {
        fetchGames(maxPlayersQueryParam);
    }, [maxPlayersQueryParam]);

    const handleSearchClick = () => {
        fetchGames(maxPlayersInput);
    };


    return (
        <div className="board-game-page">
            <h2>Board Games</h2>
            <div className="search-section">
                <label>
                    Max Players:
                    <input 
                        type="number"
                        value={maxPlayersInput}
                        onChange={(e) => setMaxPlayersInput(e.target.value)}
                    />
                </label>
                <button onClick={handleSearchClick}>&#x1F50D;</button>
            </div>
            <table>
                <thead>
                    <th>Name</th>
                    <th>Max players</th>
                </thead>
                <tbody>
                    {boardGames.map(game => (
                        <tr key={game._id}>
                            <td>{game.name}</td>
                            <td>{game.maxPlayers}</td>
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