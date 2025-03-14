// src/components/PayslipPDF.jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  subsection: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#34495e',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTop: '1pt solid #bdc3c7',
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1pt solid #ecf0f1',
  },
  companyInfo: {
    fontSize: 10,
    color: '#7f8c8d',
  },
});

const PayslipPDF = ({ employee, period, calculatedData }) => (
    <Document>
      <Page style={styles.page}>
        {/* Company Header */}
  
        {/* Employee Information */}
        <View style={styles.section}>
          <Text style={styles.label}>Employee Information</Text>
          <View style={styles.row}>
            <Text>Name:</Text>
            <Text>{calculatedData?.employeesDetails?.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Position:</Text>
            <Text>{calculatedData?.employeesDetails?.position || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Employee ID:</Text>
            <Text>{calculatedData?.employeesDetails?.employeeId || 'N/A'}</Text>
          </View>
        </View>
  
        {/* Earnings */}
        <View style={styles.subsection}>
          <Text style={styles.label}>Earnings</Text>
          <View style={styles.row}>
            <Text>Basic Salary:</Text>
            <Text>₱{calculatedData?.earnings?.basic?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Rice Subsidy:</Text>
            <Text>₱{calculatedData?.earnings?.riceSubsidy?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Phone Allowance:</Text>
            <Text>₱{calculatedData?.earnings?.phoneAllowance?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Clothing Allowance:</Text>
            <Text>₱{calculatedData?.earnings?.clothingAllowance?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>
  
        {/* Deductions */}
        <View style={styles.subsection}>
          <Text style={styles.label}>Deductions</Text>
          <View style={styles.row}>
            <Text>SSS Contribution:</Text>
            <Text>₱{calculatedData?.deductions?.sss?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.row}>
            <Text>PhilHealth:</Text>
            <Text>₱{calculatedData?.deductions?.philhealth?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Pag-IBIG:</Text>
            <Text>₱{calculatedData?.deductions?.pagibig?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.row}>
            <Text>Withholding Tax:</Text>
            <Text>₱{calculatedData?.deductions?.tax?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>
  
        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.label}>Total Gross:</Text>
          <Text style={styles.label}>₱{calculatedData?.earnings?.total?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.label}>Total Deductions:</Text>
          <Text style={styles.label}>₱{calculatedData?.deductions?.total?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={{ ...styles.totalRow, borderTop: '1pt solid #2ecc71' }}>
          <Text style={{ ...styles.label, color: '#27ae60' }}>Net Pay:</Text>
          <Text style={{ ...styles.label, color: '#27ae60' }}>
            ₱{calculatedData?.employeesDetails?.netPay?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </Page>
    </Document>
  );

export default PayslipPDF;