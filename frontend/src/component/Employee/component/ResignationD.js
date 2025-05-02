// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";



// export default function FetchResignations() {
//   const navigate = useNavigate();
//   const [resignations, setResignations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     getResignations();
//   }, []);

//   function getResignations() {
//     setLoading(true);
//     axios
//       .get(`http://localhost:8070/resignation/getempRes`)
//       .then((res) => {
//         setResignations(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }

//   function deleteResignation(id) {
//     if (window.confirm("Are you sure you want to delete this resignation?")) {
//       axios
//         .delete(`http://localhost:8070/resignation/deleteempRes/${id}`)
//         .then(() => {
//           setResignations(resignations.filter((resignation) => resignation._id !== id));
//           alert("Resignation deleted successfully");
//         })
//         .catch((err) => {
//           alert("Error deleting resignation: " + err.message);
//         });
//     }
//   }

//   if (loading) {
//     return (
//       <div style={styles.mainContent}>
//         <div style={{ textAlign: "center", padding: "50px" }}>
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p style={{ marginTop: "20px", color: "#666" }}>Loading resignation data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.mainContent}>
//       <h2 style={styles.header}>Resignation List</h2>

//       <div style={styles.listContainer}>
//         {resignations.length > 0 ? (
//           resignations.map((resignation) => (
//             <div key={resignation._id} style={styles.listItem}>
//               <div>
//                 <strong style={{ color: "#2c3e50" }}>{resignation.empId}</strong>
//                 <p style={{ margin: "5px 0 0 0", color: "#666" }}>{resignation.Reason}</p>
//                 <small style={{ color: "#888" }}>
//                   End Date: {new Date(resignation.endDate).toLocaleDateString()}
//                 </small>
//               </div>
//               <div>
//                 <button
//                   className="btn btn-sm"
//                   style={{ ...styles.button, ...styles.deleteButton }}
//                   onClick={() => deleteResignation(resignation._id)}
//                 >
//                   Delete
//                 </button>
//                 <button
//                   className="btn btn-sm"
//                   style={{ ...styles.button, ...styles.updateButton }}
//                   onClick={() => navigate(`/update/${resignation._id}`)}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div style={{ textAlign: "center", padding: "30px", color: "#666" }}>
//             No resignation records found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   mainContent: {
//     marginLeft: "250px",
//     marginTop: "70px",
//     padding: "25px",
//     minHeight: "calc(100vh - 70px)",
//     maxWidth: "calc(100vw - 250px)",
//     backgroundColor: "#f8f9fa",
//     transition: "all 0.3s ease"
//   },
//   header: {
//     color: "#2c3e50",
//     marginBottom: "25px",
//     paddingBottom: "15px",
//     borderBottom: "3px solid #fc6625",
//     textAlign: "center"
//   },
//   listContainer: {
//     backgroundColor: "#ffffff",
//     borderRadius: "8px",
//     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//     overflow: "hidden",
//     padding: "20px"
//   },
//   listItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "15px 20px",
//     borderBottom: "1px solid #eee",
//     transition: "background-color 0.3s ease",
//     '&:hover': {
//       backgroundColor: "#f8f9fa"
//     }
//   },
//   button: {
//     transition: "all 0.3s ease",
//     margin: "0 5px",
//     padding: "5px 15px"
//   },
//   deleteButton: {
//     backgroundColor: "#e74c3c",
//     border: "none",
//     color: "white",
//     '&:hover': {
//       backgroundColor: "#c0392b"
//     }
//   },
//   updateButton: {
//     backgroundColor: "#3498db",
//     border: "none",
//     color: "white",
//     '&:hover': {
//       backgroundColor: "#2980b9"
//     }
//   }
// };