import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/tasks.controller.js";
import { createSubtask, updateSubtask, deleteSubtask, getSubtasks } from "../controllers/subtasks.controller.js";
import { decodeJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("").get(decodeJWT,getTasks);
router.route("").post(decodeJWT,createTask);
router.route("").patch(decodeJWT,updateTask);
router.route("/:task_id").delete(decodeJWT,deleteTask);
router.route("/:task_id/subtasks").get(decodeJWT,getSubtasks);
router.route("/subtasks").post(decodeJWT,createSubtask);
router.route("/subtasks").patch(decodeJWT,updateSubtask);
router.route("/subtasks/:subtask_id").delete(decodeJWT,deleteSubtask);

export default router;