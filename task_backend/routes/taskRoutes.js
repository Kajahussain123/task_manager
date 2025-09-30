const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require("../controller/taskController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect); 

router.get("/get", getTasks);
router.post("/create", createTask);
router.patch("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);

module.exports = router;
