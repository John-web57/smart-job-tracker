import React, { useState } from "react";
import AddJobForm from "../components/AddJobForm";
import Dashboard from "../components/Dashboard";
import JobList from "../components/JobList";

const Home = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  return (
    <div>
      <h1>Smart Job Application Tracker</h1>
      <AddJobForm />
      <Dashboard selectedStatus={selectedStatus} onStatusSelect={setSelectedStatus} />
      <JobList selectedStatus={selectedStatus} onClearFilter={() => setSelectedStatus(null)} />
    </div>
  );
};

export default Home;
