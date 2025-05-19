const pool = require("../config/db");
const { tryParseJSON } = require("../utils/helpers");

// Helper to parse arrays or JSON safely
const safeValue = (value) => {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "object") return JSON.stringify(value);
  return value;
};

// GET all permits
exports.getAllPermits = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM kplc_permits");
    connection.release();

    const permits = rows.map((permit) => ({
      ...permit,
      work_details: tryParseJSON(permit.work_details),
      earth_points: tryParseJSON(permit.earth_points),
    }));

    res.status(200).json(permits);
  } catch (error) {
    console.error("Error fetching permits:", error);
    res.status(500).json({ error: "Failed to fetch permits" });
  }
};

// GET permit by ID
exports.getPermitById = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM kplc_permits WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Permit not found" });
    }

    const permit = rows[0];

    permit.work_details = tryParseJSON(permit.work_details) || [];
    permit.earth_points = tryParseJSON(permit.earth_points) || [];

    res.status(200).json(permit);
  } catch (error) {
    console.error("Error fetching permit by ID:", error);
    res.status(500).json({ error: "Failed to fetch permit" });
  }
};

// GET permits by Id_number
exports.getPermitsByIdNumber = async (req, res) => {
  const { id_number } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM kplc_permits WHERE Id_number = ?",
      [id_number]
    );
    connection.release();

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No permits found for this Id_number" });
    }

    const permits = rows.map((permit) => ({
      ...permit,
      work_details: tryParseJSON(permit.work_details) || [],
      earth_points: tryParseJSON(permit.earth_points) || [],
    }));

    res.status(200).json(permits);
  } catch (error) {
    console.error("Error fetching permits by Id_number:", error);
    res.status(500).json({ error: "Failed to fetch permits" });
  }
};

// CREATE permit
exports.createPermit = async (req, res) => {
  try {
    const {
      permit_number,
      issued_to,
      substation,
      work_details,
      safe_work_limits,
      safe_hv_work_limits,
      mv_lv_equipment,
      earth_points,
      additional_earth_connections,
      consent_person,
      issue_date,
      issue_time,
      submitted_at,
      urgency,
      status,
      comments,
      approver_name,
      approval_date,
      approval_time,
      clearance_date,
      clearance_time,
      clearance_signature,
      connections,
      cancellation_consent_person,
      Id_number,
    } = req.body;

    if (!permit_number) {
      return res.status(400).json({ error: "permit_number is required" });
    }

    const connection = await pool.getConnection();

    const query = `
      INSERT INTO kplc_permits (
        permit_number, issued_to, substation, work_details, safe_work_limits,
        safe_hv_work_limits, mv_lv_equipment, earth_points, additional_earth_connections,
        consent_person, issue_date, issue_time, submitted_at, urgency, status,
        comments, approver_name, approval_date, approval_time, clearance_date,
        clearance_time, clearance_signature, connections, cancellation_consent_person, Id_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      permit_number,
      safeValue(issued_to),
      safeValue(substation),
      safeValue(work_details),
      safeValue(safe_work_limits),
      safeValue(safe_hv_work_limits),
      safeValue(mv_lv_equipment),
      safeValue(earth_points),
      safeValue(additional_earth_connections),
      safeValue(consent_person),
      safeValue(issue_date),
      safeValue(issue_time),
      safeValue(submitted_at) || new Date(),
      safeValue(urgency),
      safeValue(status),
      safeValue(comments),
      safeValue(approver_name),
      safeValue(approval_date),
      safeValue(approval_time),
      safeValue(clearance_date),
      safeValue(clearance_time),
      safeValue(clearance_signature),
      safeValue(connections),
      safeValue(cancellation_consent_person),
      safeValue(Id_number),
    ];

    await connection.query(query, values);
    connection.release();

    res.status(201).json({ message: "Permit created successfully" });
  } catch (error) {
    console.error("Error creating permit:", error.message);
    res.status(500).json({ error: "Failed to create permit" });
  }
};

// UPDATE permit status by ID
exports.updatePermitStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Check if status is provided
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const connection = await pool.getConnection();

    // Check if the permit with the given ID exists
    const [permitCheck] = await connection.query(
      "SELECT * FROM kplc_permits WHERE id = ?",
      [id]
    );

    if (permitCheck.length === 0) {
      connection.release();
      return res.status(404).json({ error: "Permit not found" });
    }

    // Update the permit status
    const [result] = await connection.query(
      "UPDATE kplc_permits SET status = ? WHERE id = ?",
      [status, id]
    );
    connection.release();

    // If no rows were affected, the permit doesn't exist
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Permit not found" });
    }

    res.status(200).json({ message: "Permit status updated successfully" });
  } catch (error) {
    console.error("Error updating permit status:", error.message);
    res.status(500).json({ error: "Failed to update permit status" });
  }
};

// UPDATE clearance info by permit_number
exports.updateClearanceInfo = async (req, res) => {
  const { permit_number } = req.params;

  const updatedData = {
    clearance_date: req.body.clearance_date,
    clearance_time: req.body.clearance_time,
    clearance_signature: req.body.clearance_signature,
    connections: req.body.connections,
    cancellation_consent_person: req.body.cancellation_consent_person,
  };

  Object.keys(updatedData).forEach(
    (key) => updatedData[key] == null && delete updatedData[key]
  );

  if (Object.keys(updatedData).length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided to update." });
  }

  try {
    const connection = await pool.getConnection();

    const fields = Object.keys(updatedData);
    const values = Object.values(updatedData);

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    values.push(permit_number);

    const sql = `UPDATE kplc_permits SET ${setClause} WHERE permit_number = ?`;

    const [result] = await connection.execute(sql, values);

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Permit not found" });
    }

    res.status(200).json({ message: "Permit updated successfully" });
  } catch (error) {
    console.error("Error updating permit:", error.message);
    res
      .status(500)
      .json({ error: "Failed to update permit", details: error.message });
  }
};

//update approval info by permit id
exports.updateApprovalForm = async (req, res) => {
  const { id } = req.params;

  const updatedData = {
    approver_name: req.body.approver_name,
    approval_date: req.body.approval_date,
    approval_time: req.body.approval_time,
    comments: req.body.comments,
    status: req.body.status,
  };

  Object.keys(updatedData).forEach(
    (key) => updatedData[key] == null && delete updatedData[key]
  );

  if (Object.keys(updatedData).length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided to update." });
  }

  try {
    const connection = await pool.getConnection();

    const fields = Object.keys(updatedData);
    const values = Object.values(updatedData);

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    values.push(id);

    const sql = `UPDATE kplc_permits SET ${setClause} WHERE id = ?`;

    const [result] = await connection.execute(sql, values);

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Permit not found" });
    }

    res.status(200).json({ message: "Permit updated successfully" });
  } catch (error) {
    console.error("Error updating permit:", error.message);
    res
      .status(500)
      .json({ error: "Failed to update permit", details: error.message });
  }
};
