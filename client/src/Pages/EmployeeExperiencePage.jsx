import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EmployeeExperiencePage = () => {
    const {params} = useParams(); // kapcs zerojel mert tobb param lehetne
    const [employees, setEmployees] = useState([]);

    const filterEmployee = (years, employees) => {
        // console.log(employees);
        console.log(parseInt(years));
        const filteredEmployee = employees.filter(employee => 
           (employee.yearsOfExperience >= parseInt(years))
        )

        return filteredEmployee;
    };

    useEffect(() => {
        let url = `/api/employees/${params}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setEmployees(data)
            })
            .catch(error => {
                console.error("Error fetching employees", error);
            })
    }, [params]);

    return (
        <div>
            <h2>Employee Experience Page</h2>
            <table>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Years of Experience</th>
                    </tr>
                </thead>
                <tbody>
                {filterEmployee(params, employees).map((employee) => (
                    <tr key={employee._id}>
                        <td>{employee.firstName} {employee.middleName} {employee.lastName}</td>
                        <td>{employee.level}</td>
                        <td>{employee.yearsOfExperience}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div >
    );
};

export default EmployeeExperiencePage;