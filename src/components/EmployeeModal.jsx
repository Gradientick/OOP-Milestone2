// src/components/EmployeeModal.jsx
import React, { useState } from 'react';
import PayslipGenerator from './PayslipGenerator';

function EmployeeModal({ employee, onClose }) {
    const [hoursWorked, setHoursWorked] = useState('');
    const [calculatedData, setCalculatedData] = useState(null);
    const [showPayslipActions, setShowPayslipActions] = useState(false);

    if (!employee) {
        return null;
    }

    const automatedSalaryComputation = (
        hours,
        riceSubsidy,
        phoneAllowance,
        clothingAllowance,
        hourlyRate
    ) => {
        const grossSalary =
            hours * hourlyRate + riceSubsidy + phoneAllowance + clothingAllowance;

        // below is the deduction logic for sss deudctions
        const sssDeductions = (grossSalary) => {
            let totalSssDeduction = 0;
            switch (true) {
                case grossSalary <= 3250:
                    totalSssDeduction = 135;
                    break;
                case grossSalary <= 3750:
                    totalSssDeduction = 157;
                    break;
                case grossSalary <= 4250:
                    totalSssDeduction = 180;
                    break;
                case grossSalary <= 4750:
                    totalSssDeduction = 202.5;
                    break;
                case grossSalary <= 5250:
                    totalSssDeduction = 225;
                    break;
                case grossSalary <= 5750:
                    totalSssDeduction = 247.5;
                    break;
                case grossSalary <= 6250:
                    totalSssDeduction = 270;
                    break;
                case grossSalary <= 6750:
                    totalSssDeduction = 292.5;
                    break;
                case grossSalary <= 7250:
                    totalSssDeduction = 315;
                    break;
                case grossSalary <= 7750:
                    totalSssDeduction = 337.5;
                    break;
                case grossSalary <= 8250:
                    totalSssDeduction = 360;
                    break;
                case grossSalary <= 8750:
                    totalSssDeduction = 382.5;
                    break;
                case grossSalary <= 9250:
                    totalSssDeduction = 405;
                    break;
                case grossSalary <= 9750:
                    totalSssDeduction = 427.5;
                    break;
                case grossSalary <= 10250:
                    totalSssDeduction = 450;
                    break;
                case grossSalary <= 10750:
                    totalSssDeduction = 472.5;
                    break;
                case grossSalary <= 11250:
                    totalSssDeduction = 495;
                    break;
                case grossSalary <= 11750:
                    totalSssDeduction = 517.5;
                    break;
                case grossSalary <= 12250:
                    totalSssDeduction = 540;
                    break;
                case grossSalary <= 12750:
                    totalSssDeduction = 562.5;
                    break;
                case grossSalary <= 13250:
                    totalSssDeduction = 585;
                    break;
                case grossSalary <= 13750:
                    totalSssDeduction = 607.5;
                    break;
                case grossSalary <= 14250:
                    totalSssDeduction = 630;
                    break;
                case grossSalary <= 14750:
                    totalSssDeduction = 652.5;
                    break;
                case grossSalary <= 15250:
                    totalSssDeduction = 675;
                    break;
                case grossSalary <= 15750:
                    totalSssDeduction = 697.5;
                    break;
                case grossSalary <= 16250:
                    totalSssDeduction = 720;
                    break;
                case grossSalary <= 16750:
                    totalSssDeduction = 742.5;
                    break;
                case grossSalary <= 17250:
                    totalSssDeduction = 765;
                    break;
                case grossSalary <= 17750:
                    totalSssDeduction = 787.5;
                    break;
                case grossSalary <= 18250:
                    totalSssDeduction = 810;
                    break;
                case grossSalary <= 18750:
                    totalSssDeduction = 832.5;
                    break;
                case grossSalary <= 19250:
                    totalSssDeduction = 855;
                    break;
                case grossSalary <= 19750:
                    totalSssDeduction = 877.5;
                    break;
                case grossSalary <= 20250:
                    totalSssDeduction = 922.5;
                    break;
                case grossSalary <= 20750:
                    totalSssDeduction = 945;
                    break;
                case grossSalary <= 21250:
                    totalSssDeduction = 967.5;
                    break;
                case grossSalary <= 21750:
                    totalSssDeduction = 990;
                    break;
                case grossSalary <= 22250:
                    totalSssDeduction = 1012.5;
                    break;
                case grossSalary <= 22750:
                    totalSssDeduction = 1035;
                    break;
                case grossSalary <= 23250:
                    totalSssDeduction = 1057.5;
                    break;
                case grossSalary <= 23750:
                    totalSssDeduction = 1080;
                    break;
                case grossSalary <= 24250:
                    totalSssDeduction = 1102.5;
                    break;
                case grossSalary < 24750:  // Corrected typo here
                    totalSssDeduction = 1102.5;
                    break;
                case grossSalary >= 24750:
                    totalSssDeduction = 1125;
                    break;
            }
            return totalSssDeduction;
        };

        // below is the deduction logic for philhealth deudctions
        const philhealthDeductions = (grossSalary) => {
            const valueOfDeduction = grossSalary * 0.03;
            const employeeShare = valueOfDeduction / 2;
            const totalDeduction = valueOfDeduction + employeeShare; // This should be valueOfDeduction / 2
            return totalDeduction / 2; // Return the employee's share only.
        };

        // below is the deduction logic for tin deudctions
        const withHoldingTaxDeductions = (grossDeductedSalary) => {
            let withholdingTax = 0;
            let total = 0;
            let minusExcess = 0;
            if (grossDeductedSalary <= 20832) {
                total = 0;
            } else if (grossDeductedSalary < 33333) {
                minusExcess = grossDeductedSalary - 20833;
                total = minusExcess * 0.2;
            } else if (grossDeductedSalary < 66667) {
                minusExcess = grossDeductedSalary - 33333;
                withholdingTax = minusExcess * 0.25;
                total = withholdingTax + 2500;
            } else if (grossDeductedSalary < 166667) {
                minusExcess = grossDeductedSalary - 66667;
                withholdingTax = minusExcess * 0.3;
                total = withholdingTax + 10833;
            } else if (grossDeductedSalary < 666667) {
                minusExcess = grossDeductedSalary - 166667;
                withholdingTax = minusExcess * 0.32;
                total = withholdingTax + 40833.33;
            } else if (grossDeductedSalary >= 666667) {
                minusExcess = grossDeductedSalary - 666667;
                withholdingTax = minusExcess * 0.35;
                total = withholdingTax + 200833.33;
            }
            return total;
        };
        // below is the deduction logic for pagibig deudctions
        const pagIbigDeductions = (grossSalary) => {
            let totalPagIbigDeduction = 0;
            if (grossSalary >= 1000 && grossSalary <= 1500) { //Corrected condition
                totalPagIbigDeduction = grossSalary * 0.01; // 1% for <= 1500
            } else {
                totalPagIbigDeduction = grossSalary * 0.02;  // 2% for > 1500, capped at 100
            }
              return Math.min(totalPagIbigDeduction, 100); // Employee share capped at 100.
        };

        let totalDeductionsBeforeTax =
            sssDeductions(grossSalary) +
            philhealthDeductions(grossSalary) +
            pagIbigDeductions(grossSalary);

        let totalDeductionsMinusGross = grossSalary - totalDeductionsBeforeTax;
        let withholdingTax = withHoldingTaxDeductions(totalDeductionsMinusGross);

        let netSalary = totalDeductionsMinusGross- withholdingTax;


        return {
            grossSalary,
            netSalary,
            sssDeductions: sssDeductions(grossSalary),          // Return individual deduction values
            philhealthDeductions: philhealthDeductions(grossSalary),
            pagIbigDeductions: pagIbigDeductions(grossSalary),
            withHoldingTaxDeductions: withholdingTax,
            totalDeductions: totalDeductionsBeforeTax + withholdingTax
        };
    };

    const calculateEarnings = () => {
        const parsedHoursWorked = parseFloat(hoursWorked || 0);
        const result = automatedSalaryComputation(
            parsedHoursWorked,
            employee.riceSubsidy,
            employee.phoneAllowance,
            employee.clothingAllowance,
            employee.hourlyRate
        );
        setCalculatedData(result);
        setShowPayslipActions(true);
    };

    const handleInputChange = (event) => {
        setHoursWorked(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        calculateEarnings();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Employee Details: {employee.firstName} {employee.lastName}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                <p><strong>ID:</strong> {employee.id}</p>
                    <p><strong>Position:</strong> {employee.position}</p>
                    <p><strong>Basic Salary:</strong> {employee.basicSalary}</p>
                    <p><strong>Address:</strong> {employee.address}</p>
                    <p><strong>Birthday:</strong> {employee.birthday}</p>
                    <p><strong>Phone Number:</strong> {employee.phoneNumber}</p>
                    <p><strong>SSS:</strong> {employee.sss}</p>
                    <p><strong>Philhealth:</strong> {employee.philhealth}</p>
                    <p><strong>TIN:</strong> {employee.tin}</p>
                    <p><strong>Pag-ibig:</strong> {employee.pagibig}</p>
                    <p><strong>Status:</strong> {employee.status}</p>
                    <p><strong>Immediate Supervisor:</strong> {employee.immediateSupervisor}</p>
                    <p><strong>Rice Subsidy:</strong> {employee.riceSubsidy}</p>
                    <p><strong>Phone Allowance:</strong> {employee.phoneAllowance}</p>
                    <p><strong>Clothing Allowance:</strong> {employee.clothingAllowance}</p>
                    <p><strong>Gross Semi-Monthly Rate:</strong> {employee.grossSemiMonthlyRate}</p>
                    <p><strong>Hourly Rate:</strong> {employee.hourlyRate}</p>

                    {/* Calculation Form */}
                    <form className="hoursWorkedForm" onSubmit={handleSubmit}>
                        <label htmlFor="hoursWorked">Hours Worked:</label>
                        <input
                            type="number"
                            id="hoursWorked"
                            value={hoursWorked}
                            onChange={handleInputChange}
                            step="0.01"
                            required
                        />
                        <button type="submit" className="btn btn-primary">
                            Calculate Earnings
                        </button>
                    </form>

                    {/* Calculation Results */}
                    {calculatedData && (
                        <div className="results">
                            <h3>Calculation Results</h3>
                            <p>Gross Salary: ₱{calculatedData.grossSalary.toFixed(2)}</p>
                            <p>SSS Deduction: ₱{calculatedData.sssDeductions.toFixed(2)}</p>
                            <p>PhilHealth Deduction: ₱{calculatedData.philhealthDeductions.toFixed(2)}</p>
                            <p>Pag-IBIG Deduction: ₱{calculatedData.pagIbigDeductions.toFixed(2)}</p>
                            <p>Withholding Tax: ₱{calculatedData.withHoldingTaxDeductions.toFixed(2)}</p>
                            <p>Total Deductions: ₱{calculatedData.totalDeductions.toFixed(2)}</p>
                            <p>Net Salary: ₱{calculatedData.netSalary.toFixed(2)}</p>
                        </div>
                    )}

                    {/* Payslip Generator - Single Instance */}
                    {showPayslipActions && calculatedData && (
                        <PayslipGenerator 
                            employee={employee}
                            calculatedData={calculatedData}
                        />
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeModal;