import React, { useState, useEffect } from "react";
import "./Home.css";
import logo from "../assets/LOGO3.png";
import { getPermits, getPermitById, updateApprovalForm } from "../Services/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  // State for pending permit applications
  const [pendingPermits, setPendingPermits] = useState([]);
  // State for selected permit to review
  const [selectedPermit, setSelectedPermit] = useState(null);
  // State for approval/rejection form
  const [approvalForm, setApprovalForm] = useState({
    status: "",
    comments: "",
    approver_name: "",
    approval_date: "",
    approval_time: "",
  });
  // State for history of processed permits
  const [processedPermits, setProcessedPermits] = useState([]);
  // Toggle between pending and history views
  const [viewMode, setViewMode] = useState("pending");
  // Loading state for initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // Error state
  const [error, setError] = useState(null);
  // State for logging out
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch all permits when component mounts
  useEffect(() => {
    fetchPermits();

    // Apply styles when component mounts
    document.body.style.backgroundColor = "#f8f9fa";
    document.body.style.color = "#333";
    document.body.style.marginTop = "90px";

    // Set up polling interval
    const pollInterval = setInterval(fetchPermits, 1000);

    return () => {
      // Reset styles when component unmounts
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.body.style.marginTop = "";

      // Clear the polling interval when component unmounts
      clearInterval(pollInterval);
    };
  }, []);

  // Fetch permits from API
  const fetchPermits = async () => {
    setError(null);
    try {
      const data = await getPermits();

      // Split permits into pending and processed
      const pending = data.filter(
        (permit) => !permit.status || permit.status === "pending"
      );
      const processed = data.filter(
        (permit) => permit.status === "Approved" || permit.status === "rejected"
      );

      // Send notification if new pending permits are detected
      if (window.electron && pending.length > pendingPermits.length) {
        window.electron.send("check-permits", pending.length);
      }

      // Sort permits by permit number in descending order
      const sortByPermitNumber = (a, b) => {
        // Convert permit numbers to integers safely
        const getPermitNumber = (permit) => {
          if (!permit || !permit.permit_number) return 0;
          const numStr = String(permit.permit_number).replace(/\D/g, "");
          return parseInt(numStr) || 0;
        };

        const numA = getPermitNumber(a);
        const numB = getPermitNumber(b);
        return numB - numA;
      };

      setPendingPermits(pending.sort(sortByPermitNumber));
      setProcessedPermits(processed.sort(sortByPermitNumber));

      // Set initial load to false after first successful fetch
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      console.error("Detailed error fetching permits:", err);
      setError(
        `Failed to load permits: ${err.message || "Unknown error occurred"}`
      );
      // Set initial load to false even if there's an error
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  // Handle permit selection for review
  const handleSelectPermit = async (permit) => {
    try {
      // Get the latest version of the permit from the server
      const latestPermit = await getPermitById(permit.id);
      setSelectedPermit(latestPermit);

      // Initialize approval form with current date and time
      const now = new Date();
      setApprovalForm({
        status: "",
        comments: "",
        approver_name: "",
        approval_date: now.toISOString().split("T")[0],
        approval_time: now.toTimeString().substring(0, 5),
      });
    } catch (err) {
      console.error("Error fetching permit details:", err);
      alert("Failed to load permit details. Please try again.");
    }
  };

  const handleApprovalChange = (e) => {
    const { name, value } = e.target;
    setApprovalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermitAction = async (action) => {
    if (!approvalForm.approver_name) {
      alert("Please enter your name as the approver");
      return;
    }

    // Create updated permit with approval/rejection info
    const updatedPermit = {
      ...selectedPermit,
      status: action,
      comments: approvalForm.comments,
      approver_name: approvalForm.approver_name,
      approval_date: approvalForm.approval_date,
      approval_time: approvalForm.approval_time,
    };

    try {
      // Update permit in the database
      await updateApprovalForm(selectedPermit.id, updatedPermit);

      // Refresh the permits list
      await fetchPermits();

      // Clear selection
      setSelectedPermit(null);

      // Show confirmation
      alert(
        `Permit ${selectedPermit.permit_number} has been ${
          action === "Approved" ? "Approved" : "rejected"
        }.`
      );
    } catch (err) {
      console.error("Error updating permit:", err);
      alert("Failed to update permit status. Please try again.");
    }
  };

  const handleLogout = async (e) => {
    // Prevent any default behavior
    if (e) e.preventDefault();

    // Show modal instead of browser alert
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear all state
      setPendingPermits([]);
      setProcessedPermits([]);
      setSelectedPermit(null);
      setApprovalForm({
        status: "",
        comments: "",
        approver_name: "",
        approval_date: "",
        approval_time: "",
      });
      setError(null);

      // Clear any stored data
      localStorage.removeItem("authToken");
      sessionStorage.clear();

      // Force navigation to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      alert("There was an error during logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Get urgency class for styling
  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case "high":
        return "high-urgency";
      case "medium":
        return "medium-urgency";
      case "low":
        return "low-urgency";
      default:
        return "";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={cancelLogout}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with logo */}
      <div className="nav">
        <img src={logo} alt="LOGO" />
        <div className="h1_container">
          <h1>KENYA POWER </h1>
          <h2>and LIGHTING COMPANY</h2>
        </div>
        <button
          className="logout-button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>System Control Engineer Dashboard</h1>
          <p>Review and manage electrical permits to work</p>

          <div className="view-toggle">
            <button
              className={viewMode === "pending" ? "active" : ""}
              onClick={() => setViewMode("pending")}
            >
              Pending Approvals
            </button>
            <button
              className={viewMode === "history" ? "active" : ""}
              onClick={() => setViewMode("history")}
            >
              Approval History
            </button>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="permit-list">
            <h2>
              {viewMode === "pending" ? "Pending Permits" : "Processed Permits"}
            </h2>

            {isInitialLoad && <p className="loading">Loading permits...</p>}

            {error && <p className="error">{error}</p>}

            {!isInitialLoad &&
              viewMode === "pending" &&
              pendingPermits.length === 0 && (
                <p className="no-permits">No pending permits to review</p>
              )}

            {!isInitialLoad &&
              viewMode === "history" &&
              processedPermits.length === 0 && (
                <p className="no-permits">No processed permits in history</p>
              )}

            {viewMode === "pending" &&
              pendingPermits.map((permit) => (
                <div
                  key={permit.id}
                  className={`permit-card ${
                    selectedPermit?.id === permit.id ? "selected" : ""
                  } ${getUrgencyClass(permit.urgency)}`}
                  onClick={() => handleSelectPermit(permit)}
                >
                  <div className="permit-card-header">
                    <h3>{permit.permit_number}</h3>
                    <span className={`status-badge ${permit.status}`}>
                      {permit.status === "pending" ? "Pending" : "In Review"}
                    </span>
                  </div>
                  <p>
                    <strong>Issued To:</strong> {permit.issued_to}
                  </p>
                  <div>
                    <strong>Work:</strong>
                    {permit.work_details.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>

                  <p>
                    <strong>Equipment:</strong> {permit.mv_lv_equipment}
                  </p>
                  <div className="permit-card-footer">
                    <span className="permit-id">{permit.id}</span>
                    <span className="urgency-indicator">
                      {permit.urgency === "high"
                        ? "⚠️ High Priority"
                        : permit.urgency === "medium"
                        ? "⚡ Medium Priority"
                        : "Low Priority"}
                    </span>
                  </div>
                </div>
              ))}

            {viewMode === "history" &&
              processedPermits.map((permit) => (
                <div
                  key={permit.id}
                  className={`permit-card ${
                    permit.status === "Approved" ? "Approved" : "rejected"
                  }`}
                  onClick={() => handleSelectPermit(permit)}
                >
                  <div className="permit-card-header">
                    <h3>{permit.permit_number}</h3>
                    <span className={`status-badge ${permit.status}`}>
                      {permit.status === "Approved"
                        ? "✓ Approved"
                        : "✗ Rejected"}
                    </span>
                  </div>
                  <p>
                    <strong>Issued To:</strong> {permit.issued_to}
                  </p>
                  <div>
                    <strong>Work:</strong>
                    {permit.work_details.map((item, idx) => (
                      <p key={idx}>{item}</p>
                    ))}
                  </div>
                  <p>
                    <strong>Approved By:</strong> {permit.approver_name}
                  </p>
                  <p>
                    <strong>Date:</strong> {permit.approval_date} at{" "}
                    {permit.approval_time}
                  </p>
                  <div className="permit-card-footer">
                    <span className="permit-id">{permit.id}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="permit-details">
            {selectedPermit ? (
              <div className="permit-review">
                <h2>
                  Permit Review: {selectedPermit.permit_number}
                  <span className="permit-id-small">
                    ID: {selectedPermit.id}
                  </span>
                </h2>

                <div className="permit-info">
                  <div className="info-section">
                    <h3>General Information</h3>
                    <p>
                      <strong>Issued To:</strong> {selectedPermit.issued_to}
                    </p>
                    <p>
                      <strong>Issue Date:</strong> {selectedPermit.issue_date}
                    </p>
                    <p>
                      <strong>Issue Time:</strong> {selectedPermit.issue_time}
                    </p>
                    <p>
                      <strong>Consent Person:</strong>{" "}
                      {selectedPermit.consent_person}
                    </p>
                  </div>

                  <div className="info-section">
                    <h3>Work Details</h3>
                    <div>
                      <strong>Description:</strong>
                      <ul>
                        {selectedPermit.work_details.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Safety Information</h3>
                    <p>
                      <strong>MV/LV Equipment:</strong>{" "}
                      {selectedPermit.mv_lv_equipment}
                    </p>
                    <div className="earth-points-list">
                      <strong>Earth Points:</strong>
                      <ul>
                        {selectedPermit.earth_points.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <p>
                      <strong>Additional Earth Connections:</strong>{" "}
                      {selectedPermit.additional_earth_connections}
                    </p>
                  </div>
                </div>

                {selectedPermit.status === "Approved" ||
                selectedPermit.status === "rejected" ? (
                  // If permit is already processed, show the decision details
                  <div className="decision-details">
                    <h3>Decision Information</h3>
                    <p>
                      <strong>Status:</strong>
                      <span className={`status-text ${selectedPermit.status}`}>
                        {selectedPermit.status === "Approved"
                          ? "Approved"
                          : "Rejected"}
                      </span>
                    </p>
                    <p>
                      <strong>Comments:</strong> {selectedPermit.comments}
                    </p>
                    <p>
                      <strong>Decided By:</strong>{" "}
                      {selectedPermit.approver_name}
                    </p>
                    <p>
                      <strong>Date/Time:</strong> {selectedPermit.approval_date}{" "}
                      at {selectedPermit.approval_time}
                    </p>
                  </div>
                ) : (
                  // If permit is pending, show the approval form
                  <div className="approval-form">
                    <h3>Review Decision</h3>
                    <div className="form-group">
                      <label htmlFor="approver_name">Your Name:</label>
                      <input
                        type="text"
                        id="approver_name"
                        name="approver_name"
                        value={approvalForm.approver_name}
                        onChange={handleApprovalChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="comments">Comments/Reason:</label>
                      <textarea
                        id="comments"
                        name="comments"
                        value={approvalForm.comments}
                        onChange={handleApprovalChange}
                        placeholder="Enter your comments or reason for approval/rejection"
                        rows="4"
                      ></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="approval_date">Date:</label>
                        <input
                          type="date"
                          id="approval_date"
                          name="approval_date"
                          value={approvalForm.approval_date}
                          onChange={handleApprovalChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="approval_time">Time:</label>
                        <input
                          type="time"
                          id="approval_time"
                          name="approval_time"
                          value={approvalForm.approval_time}
                          onChange={handleApprovalChange}
                        />
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handlePermitAction("Approved")}
                      >
                        Approve Permit
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handlePermitAction("rejected")}
                      >
                        Reject Permit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-selection">
                <div className="placeholder-content">
                  <h3>No Permit Selected</h3>
                  <p>Select a permit from the list to review its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
