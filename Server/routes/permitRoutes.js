const express = require("express");
const router = express.Router();
const permitController = require("../controllers/permitController");
const authenticateToken = require("../middleware/auth");

// router.get("/", authenticateToken, permitController.getAllPermits);
// router.post("/", authenticateToken, permitController.createPermit);
router.get("/", permitController.getAllPermits);
router.get("/:id", permitController.getPermitById);
router.post("/", permitController.createPermit);
//get permits by Id_number
router.get("/id_number/:id_number", permitController.getPermitsByIdNumber);
// UPDATE permit status by ID
router.put("/:id", permitController.updatePermitStatus);
// UPDATE clearance info by permit_number
router.put("/clearance/:permit_number", permitController.updateClearanceInfo);
//update approval form by permit id
router.put("/approval/:id", permitController.updateApprovalForm);

module.exports = router;
