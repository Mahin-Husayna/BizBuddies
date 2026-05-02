const Announcement = require("../models/Announcement");

// =========================
// CREATE ANNOUNCEMENT
// =========================
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, type, createdBy, role, business } = req.body;

    if (!title || !message || !createdBy || !role) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const announcement = new Announcement({
      title,
      message,
      type,
      createdBy,
      role,
      business: business || null, // ✅ FIXED
    });

    await announcement.save();

    res.status(201).json(announcement);
  } catch (err) {
    console.error("CREATE ANNOUNCEMENT ERROR:", err);
    res.status(500).json({
      message: "Error creating announcement",
    });
  }
};

// =========================
// GET ALL ANNOUNCEMENTS
// =========================
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("business", "name coverImage") // ✅ FIXED
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(announcements);
  } catch (err) {
    console.error("GET ANNOUNCEMENTS ERROR:", err);
    res.status(500).json({
      message: "Error fetching announcements",
    });
  }
};

// =========================
// DELETE ANNOUNCEMENT
// =========================
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }

    // ✅ ONLY CREATOR OR ADMIN
    if (
      announcement.createdBy.toString() !== userId &&
      role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed to delete",
      });
    }

    await Announcement.findByIdAndDelete(id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error("DELETE ANNOUNCEMENT ERROR:", err);
    res.status(500).json({
      message: "Delete failed",
    });
  }
};