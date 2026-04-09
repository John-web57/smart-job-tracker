import React, { useState } from "react";
import AddJobForm from "../components/AddJobForm";
import Dashboard from "../components/Dashboard";
import JobList from "../components/JobList";

const Home = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  return (
    <div className="page-shell">
      <AddJobForm />
      <Dashboard selectedStatus={selectedStatus} onStatusSelect={setSelectedStatus} />
      <JobList selectedStatus={selectedStatus} onClearFilter={() => setSelectedStatus(null)} />
    </div>
  );
};

export default Home;
