import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";
import Loading from "../Components/Loading";

// Fetches equipment data by its ID
const fetchEquipmentById = async (id) => {
    try {
        const response = await fetch (`/api/equipment/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching equipment:", error);
        return null;
    }
};

// Sends an update request for a specific piece of equipment
const updateEquipment = async (id, updatedEquipment) => {
    try {
        const response = await fetch(`/api/equipment/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEquipment),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating equipment", error);
        return null;
    }
};

const EquipmentUpdater = () => {
    // Extract equipment ID from the URL parameters
    const { id } = useParams();

    // Obtain the navigate function from react-router
    const navigate = useNavigate();
    
    // State to hold the current equipment and loading status
    const [loading, setLoading] = useState(false);
    const [equipment, setEquipment] = useState(null);

    // Fetch the equipment details on component mount or if the ID changes
    useEffect(() => {
        fetchEquipmentById(id)
        .then((data) => {
            if (data) {
                setEquipment(data);
            }
            setLoading(false);
        })
        .catch(() => {
            setLoading(false);
        });
    }, [id]);

    // Handler for when equipment details are updated in the form
    const handleUpdateEquipment = (updatedEquipment) => {
        setLoading(true);

        updateEquipment(id, updatedEquipment)
        .then(() => {
            setLoading(false);
            // Redirect to the equipment list page after successful update
            navigate("/equipment");
        });
    };

    // Show a loading component while data is being fetched or sent
    if (loading) {
        return <Loading />;
    }


    // Render the equipment form filled with the fetched data
    return (
        <EquipmentForm
            equipment={equipment}
            onSave={handleUpdateEquipment}
            onCancel={() => navigate("/equipment")}
            disabled={loading}
            />
    );
};

export default EquipmentUpdater;
