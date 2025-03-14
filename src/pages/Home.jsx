// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EmployeeModal from '../components/EmployeeModal';
import PayslipPDF from '../components/PayslipPDF';
import { pdf } from '@react-pdf/renderer';
function Home() {
    const [employees, setEmployees] = useState([]);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleDownloadPayslip = async (payslip) => {
      try {
          const blob = await pdf(
              <PayslipPDF 
                  employee={user}
                  period={payslip.period}
                  calculatedData={payslip}
              />
          ).toBlob();
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `payslip-${payslip.period}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
      } catch (error) {
          console.error('PDF download failed:', error);
          alert('Failed to generate PDF. Please try again.');
      }
  };

    useEffect(() => {
        let isMounted = true;
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (isMounted && userDocSnap.exists()) {
                        setUserRole(userDocSnap.data().role);
                    } else if (isMounted) {
                        setUserRole('unknown');
                    }
                } catch (err) {
                    if (isMounted) {
                        console.error("Error getting user role:", err);
                        setError("Failed to get user role: " + err.message);
                    }
                }
            } else {
                setUser(null);
                setUserRole(null);
                navigate("/login");
            }
            if (isMounted) {
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [navigate]);

    useEffect(() => {
        let isMounted = true;
        const fetchEmployees = async () => {
            if (!isMounted) return;

            setLoading(true);
            setError(null);

            try {
                if (userRole === 'admin' || userRole === 'hr') {
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("role", "==", "employee"));
                    const querySnapshot = await getDocs(q);

                    const fetchedEmployees = [];
                    querySnapshot.forEach((doc) => {
                        fetchedEmployees.push({ id: doc.id, ...doc.data() });
                    });
                    
                    if (isMounted) {
                        setEmployees(fetchedEmployees.sort((a, b) => a.id - b.id));
                    }
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching employees:", error);
                    setError("Failed to fetch employees: " + error.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    
                }
            }
        };

        const fetchPayslips = async () => {
          if (!isMounted || userRole !== 'employee') return;
      
          try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              const employeeId = Number(userDoc.data()?.id);
              
              const q = query(
                  collection(db, 'payslips'),
                  where('employeesDetails.employeeId', '==', employeeId)
              );
              
              const snapshot = await getDocs(q);
              
              // Add debug logging
              console.log('Raw payslip documents:', snapshot.docs.map(d => d.data()));
      
              const payslipData = snapshot.docs.map(doc => {
                  const data = doc.data();
                  return {
                      id: doc.id,
                      period: data.period || data.employeesDetails?.period,
                      grossSalary: data.earnings?.total || 0,
                      deductions: data.deductions?.total || 0,
                      netPay: data.employeesDetails?.netPay || 0
                  };
              });
      
              console.log('Processed payslips:', payslipData);
              
              if (isMounted) {
                  setPayslips(payslipData);
              }
          } catch (error) {
              console.error("Error fetching payslips:", error);
              setError("Failed to fetch payslips: " + error.message);
          }
      };

        if (userRole) {
            if (userRole === 'employee') {
                fetchPayslips();
            } else {
                fetchEmployees();
            }
        }

    }, [userRole, user?.uid]);

    const onClose = () => {
        setShowModal(false);
    };

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
      <div className="container">
          {user ? (
              <div>
                  <h2>Welcome, {user.email}!</h2>
                  <p>Your role is: {userRole}</p>

                  {/* Admin/HR Employee Table */}
                  {(userRole === 'admin' || userRole === 'hr') && (
                      <div className="table-responsive">
                          <table className="employee-table">
                              <thead>
                                  <tr>
                                      <th>ID</th>
                                      <th>Email</th>
                                      <th>Role</th>
                                      <th>Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {employees.map((employee) => (
                                      <tr key={employee.id}>
                                          <td>{employee.id}</td>
                                          <td>{employee.email}</td>
                                          <td>{employee.role}</td>
                                          <td>
                                              <button
                                                  className="view-button pointer-cursor"
                                                  onClick={() => handleViewDetails(employee)}
                                              >
                                                  View
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

                  {/* Employee Payslip Table */}
                  {userRole === 'employee' && (
                      <div className="table-responsive">
                          <h3>Your Payslips</h3>
                          {payslips.length === 0 ? (
                              <p className="no-payslips">No payslips found</p>
                          ) : (
                              <table className="payslip-table">
                                  <thead>
                                      <tr>
                                          <th>Period</th>
                                          <th>Gross Salary</th>
                                          <th>Deductions</th>
                                          <th>Net Pay</th>
                                          <th>Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {payslips.map((payslip) => (
                                          <tr key={payslip.id}>
                                              <td>{payslip.period}</td>
                                              <td>₱{payslip.grossSalary?.toFixed(2) || '0.00'}</td>
                                              <td>₱{payslip.deductions?.toFixed(2) || '0.00'}</td>
                                              <td>₱{payslip.netPay?.toFixed(2) || '0.00'}</td>
                                              <td>
                                                  <button 
                                                      className="download-btn"
                                                      onClick={() => {
                                                        console.log(payslip)
                                                        handleDownloadPayslip(payslip)}}
                                                  >
                                                      Download
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          )}
                      </div>
                  )}

                  <button onClick={() => auth.signOut()} className="btn btn-secondary">
                      Sign Out
                  </button>
                  {showModal && <EmployeeModal employee={selectedEmployee} onClose={onClose} />}
              </div>
          ) : null}
      </div>
  );
}

export default Home;