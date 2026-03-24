import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";

const JobList = ({ selectedStatus, onClearFilter }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    // Reference to 'jobs' collection
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));

    // Real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsArray = [];
      querySnapshot.forEach((doc) => {
        jobsArray.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobsArray);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const filteredJobs = selectedStatus ? jobs.filter((job) => job.status === selectedStatus) : jobs;

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteDoc(doc(db, "jobs", jobId));
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job");
      }
    }
  };

  const handleEditStart = (job) => {
    setEditingId(job.id);
    setEditForm({ role: job.role, company: job.company, status: job.status, notes: job.notes });
  };

  const handleEditSave = async (jobId) => {
    try {
      await updateDoc(doc(db, "jobs", jobId), editForm);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: { bg: "#e3f2fd", text: "#1976d2" },
      Interview: { bg: "#fff3e0", text: "#f57c00" },
      Rejected: { bg: "#ffebee", text: "#d32f2f" },
      Offer: { bg: "#e8f5e9", text: "#388e3c" },
      Accepted: { bg: "#e8f5e9", text: "#388e3c" }
    };
    return colors[status] || { bg: "#f5f5f5", text: "#666" };
  };

  return (
    <div>
      <h2>Job Applications</h2>
      {selectedStatus && (
        <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#e3f2fd", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0 }}>
            Filtering by: <strong>{selectedStatus}</strong> ({filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"})
          </p>
          <button
            onClick={onClearFilter}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Clear Filter
          </button>
        </div>
      )}
      {filteredJobs.length === 0 ? (
        <p>{selectedStatus ? `No jobs with status "${selectedStatus}".` : "No jobs added yet."}</p>
      ) : (
        <ul>
          {filteredJobs.map((job) => (
            <li key={job.id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              {editingId === job.id ? (
                <div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Role"
                      value={editForm.role || ""}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={editForm.company || ""}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                    />
                    <select
                      value={editForm.status || ""}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Accepted">Accepted</option>
                    </select>
                    <textarea
                      placeholder="Notes"
                      value={editForm.notes || ""}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                    />
                  </div>
                  <button
                    onClick={() => handleEditSave(job.id)}
                    style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    style={{ padding: "0.5rem 1rem", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => navigate(`/job/${job.id}`)}
                  style={{
                    cursor: "pointer",
                    padding: "1.5rem",
                    margin: "-1rem",
                    borderRadius: "8px",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#1a1a1a" }}>{job.role}</h3>
                  <p style={{ marginBottom: "0.5rem", color: "#555", fontSize: "0.95rem" }}>
                    <strong>Company:</strong> {job.company}
                  </p>
                  <p style={{ marginBottom: "0.8rem" }}>
                    <strong>Status:</strong>
                    <span style={{
                      marginLeft: "0.5rem",
                      padding: "0.35rem 0.9rem",
                      borderRadius: "20px",
                      backgroundColor: getStatusColor(job.status).bg,
                      color: getStatusColor(job.status).text,
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      display: "inline-block",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                      {job.status}
                    </span>
                  </p>
                  {job.notes && (
                    <p style={{ marginBottom: "1rem", color: "#666", fontSize: "0.9rem", fontStyle: "italic" }}>
                      <strong>Notes:</strong> {job.notes}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(job);
                    }}
                    style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(job.id);
                    }}
                    style={{ padding: "0.5rem 1rem", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobList;
