import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EquipmentForm from "../Components/EquipmentForm";
import Loading from "../Components/Loading";

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
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [equipment, setEquipment] = useState(null);

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

    const handleUpdateEquipment = (updatedEquipment) => {
        setLoading(true);

        updateEquipment(id, updatedEquipment)
        .then(() => {
            setLoading(false);
            navigate("/equipment");
        });
    };

    if (loading) {
        return <Loading />;
    }

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
