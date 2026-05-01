const express = require("express");
const router = express.Router();
const upload = require("../config/upload");

const businessController = require("../controllers/businessController");

// ================= ADMIN ROUTES =================
router.get("/admin/all", businessController.getAllBusinessesAdmin);
router.get("/admin/stats", businessController.getAdminStats);
router.put("/admin/approve/:id", businessController.approveBusiness);
router.put("/admin/reject/:id", businessController.rejectBusiness);
router.put("/admin/ban/:id", businessController.banBusiness);

// ================= USER ROUTES =================
router.post("/", upload.single("coverImage"), businessController.createBusiness);

// 🔥 ORDER MATTERS HERE
router.get("/single/:id", businessController.getBusinessById);
router.get("/user/:userId", businessController.getBusinessByUser);
router.get("/", businessController.getAllBusinesses);

// ✅ FIXED LEADERBOARD ROUTE
router.get("/leaderboard", businessController.getLeaderboard);

router.delete("/:id", businessController.deleteBusiness);

module.exports = router;