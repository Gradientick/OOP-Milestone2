// src/components/EmployeeTable.jsx
import React from 'react';

function EmployeeTable({ employees, onOpenModal }) {
    if (!employees || employees.length === 0) {
        return <p>No employee data available.</p>;
    }

    return (
        <div className="table-responsive"> {/* Added for responsiveness */}
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Position</th>
                        <th>Basic Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id} style={{cursor: 'pointer'}} onClick={() => onOpenModal(employee)}>
                            <td>{employee.id}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.position}</td>
                            <td>{employee.basicSalary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeTable;