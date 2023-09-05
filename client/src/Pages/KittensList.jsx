import React, { useState, useEffect } from "react";

const KittensList = () => {
    const [kittens, setKittens] = useState([]);

    useEffect(() => {
        // Fetch kittens for employee from API
        fetch("/api/kittens")
        .then(res => res.json())
        .then(data => setKittens(data));
    }, []);

    return (
        <div>
            <h2>Kittens</h2>
            <ul>
                {kittens.map(kitten => (
                    <li key={kitten._id}>
                        {kitten.name}, weighs {kitten.weight} kg.
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default KittensList;