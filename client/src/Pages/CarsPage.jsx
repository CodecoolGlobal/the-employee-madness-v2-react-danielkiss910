import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CarsPage = () => {
    const [cars, setCars] = useState([]);
    const [newCarMake, setNewCarMake] = useState("");
    const [newCarModel, setNewCarModel] = useState("");
    const [newCarYear, setNewCarYear] = useState("");
    const [newCarValue, setNewCarValue] = useState("");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetch("/api/cars")
        .then(res => res.json())
        .then(data => {
            setCars(data);
        })
        .catch(error => {
            console.error("Error fetching cars", error);
        })
    }, []);

    const handleAddCar = () => {
        if (newCarMake && newCarModel && newCarYear && newCarValue) {
            const newCar = {
                make: newCarMake,
                model: newCarModel,
                year: parseInt(newCarYear),
                value: parseFloat(newCarValue)
            }
            fetch("/api/cars", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCar)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Network response was not ok")
                }
                return res.json();
            })
            .then(data => {
                fetch("/api/cars")
                .then(res => res.json())
                .then(updatedCars => {
                    setCars(updatedCars);
                });
                setNewCarMake("");
                setNewCarModel("");
                setNewCarYear("");
                setNewCarValue("");
            })
            .catch(error => {
                console.error("Error adding new car", error);
            });
        }
    };

    return (
        <div>
            <h2>Cars Page</h2>
            <div>
                <h3>Add new car</h3>
                <input
                    placeholder="Make"
                    value={newCarMake}
                    onChange={e => setNewCarMake(e.target.value)}
                />
                <input
                    placeholder="Model"
                    value={newCarModel}
                    onChange={e => setNewCarModel(e.target.value)}
                />
                <input
                    placeholder="Year"
                    value={newCarYear}
                    onChange={e => setNewCarYear(e.target.value)}
                />
                <input
                    placeholder="Value"
                    value={newCarValue}
                    onChange={e => setNewCarValue(e.target.value)}
                />
                <br />
                <button onClick={handleAddCar}>Add Car</button>
            </div>
            <div>
                <h3>Cars list</h3>
                <input
                    placeholder="Filter cars"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
                <ul>
                    {cars
                        .filter(car =>
                            car.make.toLowerCase().includes(filter.toLowerCase()) ||
                            car.model.toLowerCase().includes(filter.toLowerCase()) ||
                            car.year.toString().includes(filter) ||
                            car.value.toString().includes(filter)
                            )
                        .map(car => (
                        <li key={car._id} value={car._id}>
                            {car.make} {car.model}, {car.year} - ${car.value}
                        </li>
                    ))}
                </ul>
            </div>
            <Link to="/">
                <button>Back</button>
            </Link>
        </div>
    );
};

export default CarsPage;