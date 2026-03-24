import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const jobData = { id: docSnap.id, ...docSnap.data() };
          setJob(jobData);
          setEditForm(jobData);
        } else {
          setError("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "jobs", id), {
        role: editForm.role,
        company: editForm.company,
        status: editForm.status,
        notes: editForm.notes,
      });
      setJob(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteDoc(doc(db, "jobs", id));
        navigate("/");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job");
      }
    }
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

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading job details...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        ← Back to Jobs
      </button>

      <div style={{ border: "1px solid #ddd", padding: "2rem", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        {isEditing ? (
          <div>
            <h1 style={{ marginTop: 0 }}>Edit Job</h1>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Role</label>
              <input
                type="text"
                value={editForm.role || ""}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Company</label>
              <input
                type="text"
                value={editForm.company || ""}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Status</label>
              <select
                value={editForm.status || ""}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
                <option value="Accepted">Accepted</option>
              </select>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Notes</label>
              <textarea
                value={editForm.notes || ""}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem", minHeight: "100px" }}
              />
            </div>
            <button
              onClick={handleSave}
              style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#888", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <h1 style={{ marginTop: 0 }}>{job.role} at {job.company}</h1>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Status:{" "}
              <span
                style={{
                  padding: "0.3rem 0.8rem",
                  borderRadius: "4px",
                  backgroundColor: getStatusColor(job.status).bg,
                  color: getStatusColor(job.status).text,
                  fontWeight: "bold",
                }}
              >
                {job.status}
              </span>
            </p>
            {job.notes && (
              <div style={{ marginBottom: "1rem" }}>
                <h3>Notes</h3>
                <p>{job.notes}</p>
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
