// src/components/PayslipGenerator.jsx
import React, { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';

// PDF document styling
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 3
  },
  label: {
    fontWeight: 'bold',
    width: '60%'
  },
  value: {
    width: '40%',
    textAlign: 'right'
  },
  totalSection: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: '1pt solid #333'
  }
});

// PDF document component
const PayslipPDF = ({ employee, period, calculatedData }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text>MotorPH Official Payslip</Text>
        <Text>Pay Period: {period}</Text>
      </View>

      {/* Employee Information */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text>Employee ID:</Text>
          <Text>{employee.id}</Text>
        </View>
        <View style={styles.row}>
          <Text>Name:</Text>
          <Text>{employee.firstName} {employee.lastName}</Text>
        </View>
        <View style={styles.row}>
          <Text>Position:</Text>
          <Text>{employee.position}</Text>
        </View>
      </View>

      {/* Earnings Section */}
      <View style={styles.section}>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Earnings:</Text>
        <View style={styles.row}>
          <Text>Basic Salary:</Text>
          <Text>₱{calculatedData.grossSalary.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Rice Subsidy:</Text>
          <Text>₱{employee.riceSubsidy.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Phone Allowance:</Text>
          <Text>₱{employee.phoneAllowance.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Clothing Allowance:</Text>
          <Text>₱{employee.clothingAllowance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Deductions Section */}
      <View style={styles.section}>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Deductions:</Text>
        <View style={styles.row}>
          <Text>SSS Contribution:</Text>
          <Text>₱{calculatedData.sssDeductions.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>PhilHealth Contribution:</Text>
          <Text>₱{calculatedData.philhealthDeductions.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Pag-IBIG Contribution:</Text>
          <Text>₱{calculatedData.pagIbigDeductions.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Withholding Tax:</Text>
          <Text>₱{calculatedData.withHoldingTaxDeductions.toFixed(2)}</Text>
        </View>
      </View>

      {/* Totals Section */}
      <View style={[styles.section, styles.totalSection]}>
        <View style={styles.row}>
          <Text style={styles.label}>Gross Salary:</Text>
          <Text style={styles.value}>₱{calculatedData.grossSalary.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Deductions:</Text>
          <Text style={styles.value}>₱{calculatedData.totalDeductions.toFixed(2)}</Text>
        </View>
        <View style={[styles.row, { marginTop: 10 }]}>
          <Text style={[styles.label, { fontWeight: 'extrabold' }]}>Net Pay:</Text>
          <Text style={[styles.value, { fontWeight: 'extrabold' }]}>
            ₱{calculatedData.netSalary.toFixed(2)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

function PayslipGenerator({ employee, calculatedData }) {
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      const blob = await pdf(
        <PayslipPDF
          employee={employee}
          period={period}
          calculatedData={calculatedData}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip-${employee.id}-${period}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Save payslip to Firestore
  const handleSaveToDB = async () => {
    setLoading(true);
    try {
      const payslipData = {
        employeeId: employee.id,
        period,
        employeeDetails: {
          name: `${employee.firstName} ${employee.lastName}`,
          position: employee.position,
          department: employee.department || 'N/A'
        },
        earnings: {
          basic: calculatedData.grossSalary,
          riceSubsidy: employee.riceSubsidy,
          phoneAllowance: employee.phoneAllowance,
          clothingAllowance: employee.clothingAllowance,
          total: calculatedData.grossSalary
        },
        deductions: {
          sss: calculatedData.sssDeductions,
          philhealth: calculatedData.philhealthDeductions,
          pagibig: calculatedData.pagIbigDeductions,
          tax: calculatedData.withHoldingTaxDeductions,
          total: calculatedData.totalDeductions
        },
        netPay: calculatedData.netSalary,
        timestamp: new Date()
      };

      await setDoc(doc(db, 'payslips', `${employee.id}-${period}`), payslipData);
      alert('Payslip saved successfully!');
    } catch (error) {
      console.error('Error saving payslip:', error);
      alert('Failed to save payslip. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Validation for required props
  if (!employee || !calculatedData) {
    return <div className="error">Payslip Generation</div>;
  }

  return (
    <div className="payslip-generator">
      <div className="period-selection">
        <label>Select Pay Period: </label>
        <input
          type="month"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          min="2020-01"
          max={new Date().toISOString().slice(0, 7)}
        />
      </div>

      <div className="action-buttons">
        <button
          className="download-btn"
          onClick={handleDownloadPDF}
          disabled={loading}
        >
          Download PDF
        </button>

        <button
          className="save-btn"
          onClick={handleSaveToDB}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save to Database'}
        </button>
      </div>
    </div>
  );
}

PayslipGenerator.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    riceSubsidy: PropTypes.number.isRequired,
    phoneAllowance: PropTypes.number.isRequired,
    clothingAllowance: PropTypes.number.isRequired,
  }).isRequired,
  calculatedData: PropTypes.shape({
    grossSalary: PropTypes.number.isRequired,
    sssDeductions: PropTypes.number.isRequired,
    philhealthDeductions: PropTypes.number.isRequired,
    pagIbigDeductions: PropTypes.number.isRequired,
    withHoldingTaxDeductions: PropTypes.number.isRequired,
    totalDeductions: PropTypes.number.isRequired,
    netSalary: PropTypes.number.isRequired,
  }).isRequired
};

export default PayslipGenerator;