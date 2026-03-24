import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const Dashboard = ({ selectedStatus, onStatusSelect }) => {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "jobs"), (snapshot) => {
      let total = snapshot.size;
      let applied = 0;
      let interview = 0;
      let rejected = 0;
      let offer = 0;

      snapshot.forEach((doc) => {
        const status = doc.data().status;
        if (status === "Applied") applied++;
        else if (status === "Interview") interview++;
        else if (status === "Rejected") rejected++;
        else if (status === "Offer") offer++;
      });

      setStats({ total, applied, interview, rejected, offer });
    });

    return () => unsubscribe();
  }, []);

  const pieData = [
    { name: "Applied", value: stats.applied, color: "#1976d2" },
    { name: "Interview", value: stats.interview, color: "#f57c00" },
    { name: "Rejected", value: stats.rejected, color: "#d32f2f" },
    { name: "Offer", value: stats.offer, color: "#388e3c" },
  ].filter((item) => item.value > 0);

  const barData = [
    { name: "Applied", count: stats.applied, fill: "#1976d2" },
    { name: "Interview", count: stats.interview, fill: "#f57c00" },
    { name: "Rejected", count: stats.rejected, fill: "#d32f2f" },
    { name: "Offer", count: stats.offer, fill: "#388e3c" },
  ];

  const handleStatusClick = (status) => {
    onStatusSelect(selectedStatus === status ? null : status);
  };

  const COLORS = ["#1976d2", "#f57c00", "#d32f2f", "#388e3c"];

  return (
    <div style={{ margin: "1rem 0", padding: "1rem" }}>
      <h2>Dashboard</h2>
      
      {/* Statistics Summary */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h3>Job Application Summary (Click to filter)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <button
            onClick={() => handleStatusClick("Applied")}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: selectedStatus === "Applied" ? "#1976d2" : "#e3f2fd",
              color: selectedStatus === "Applied" ? "white" : "#1976d2",
              border: "2px solid #1976d2",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}
          >
            Applied: {stats.applied}
          </button>
          <button
            onClick={() => handleStatusClick("Interview")}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: selectedStatus === "Interview" ? "#f57c00" : "#fff3e0",
              color: selectedStatus === "Interview" ? "white" : "#f57c00",
              border: "2px solid #f57c00",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}
          >
            Interview: {stats.interview}
          </button>
          <button
            onClick={() => handleStatusClick("Rejected")}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: selectedStatus === "Rejected" ? "#d32f2f" : "#ffebee",
              color: selectedStatus === "Rejected" ? "white" : "#d32f2f",
              border: "2px solid #d32f2f",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}
          >
            Rejected: {stats.rejected}
          </button>
          <button
            onClick={() => handleStatusClick("Offer")}
            style={{
              padding: "0.7rem 1.2rem",
              backgroundColor: selectedStatus === "Offer" ? "#388e3c" : "#e8f5e9",
              color: selectedStatus === "Offer" ? "white" : "#388e3c",
              border: "2px solid #388e3c",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}
          >
            Offer: {stats.offer}
          </button>
        </div>
        <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
          Total Jobs Applied: <strong>{stats.total}</strong>
        </p>
      </div>

      {/* Charts */}
      {stats.total > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", margin: "2rem 0" }}>
          {/* Pie Chart */}
          <div style={{ flex: 1, minWidth: "350px", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "2rem", backgroundColor: "#ffffff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ textAlign: "center", color: "#333", marginTop: 0 }}>Status Distribution</h3>
            <p style={{ textAlign: "center", color: "#666", fontSize: "0.9rem" }}>Click on a segment to filter</p>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(entry) => handleStatusClick(entry.name)}
                  style={{ cursor: "pointer" }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={selectedStatus && selectedStatus !== entry.name ? 0.4 : 1} style={{ transition: "opacity 0.2s" }} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} jobs`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={{ flex: 1, minWidth: "350px", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "2rem", backgroundColor: "#ffffff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ textAlign: "center", color: "#333", marginTop: 0 }}>Applications by Status</h3>
            <p style={{ textAlign: "center", color: "#666", fontSize: "0.9rem" }}>Click on a bar to filter</p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} jobs`} />
                <Bar
                  dataKey="count"
                  onClick={(data) => handleStatusClick(data.name)}
                  style={{ cursor: "pointer" }}
                  radius={[8, 8, 0, 0]}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} opacity={selectedStatus && selectedStatus !== entry.name ? 0.4 : 1} style={{ transition: "opacity 0.2s" }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
          <p>No data to display. Add your first job application to see charts!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
