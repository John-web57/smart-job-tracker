import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddJobForm = () => {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setRole("");
    setCompany("");
    setStatus("Applied");
    setNotes("");
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!role.trim() || !company.trim()) {
      setError("Role and Company are required.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "jobs"), {
        role: role.trim(),
        company: company.trim(),
        status,
        notes: notes.trim(),
        createdAt: serverTimestamp(),
        ownerUid: auth.currentUser.uid,
      });
      resetForm();
    } catch (err) {
      console.error("Failed to add job:", err);
      setError("Failed to add job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "1.5rem 0", padding: "1.5rem", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ margin: "0 0 1rem 0" }}>Add New Job</h2>
      {error && <p style={{ color: "#d32f2f" }}>{error}</p>}
      <div style={{ marginBottom: "0.75rem" }}>
        <label htmlFor="role" style={{ display: "block", marginBottom: "0.25rem" }}>Role</label>
        <input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Frontend Developer"
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>
      <div style={{ marginBottom: "0.75rem" }}>
        <label htmlFor="company" style={{ display: "block", marginBottom: "0.25rem" }}>Company</label>
        <input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Acme Corp"
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>
      <div style={{ marginBottom: "0.75rem" }}>
        <label htmlFor="status" style={{ display: "block", marginBottom: "0.25rem" }}>Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="notes" style={{ display: "block", marginBottom: "0.25rem" }}>Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Applied through referral"
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        style={{ backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "4px", padding: "0.6rem 1rem", cursor: "pointer" }}
      >
        {submitting ? "Adding..." : "Add Job"}
      </button>
    </form>
  );
};

export default AddJobForm;
