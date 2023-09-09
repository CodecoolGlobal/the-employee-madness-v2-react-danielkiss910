import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./BoardGameTable.css";

const BoardGameTable = () => {
    const [boardGames, setBoardGames] = useState([]);
    const [maxPlayersInput, setMaxPlayersInput] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
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

    const handleSearchClick = (e) => {
        e.preventDefault(); // Prevent default form submission
        fetchGames(maxPlayersInput);
    };

    const handleNavigate = (gameId) => {
        navigate(`/games-list/${gameId}`);
    }


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
                    <th>Name</th>
                    <th>Max players</th>
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