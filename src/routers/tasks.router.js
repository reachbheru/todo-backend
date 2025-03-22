import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/tasks.controller.js";
import { createSubtask, updateSubtask, deleteSubtask, getSubtasks } from "../controllers/subtasks.controller.js";
import { decodeCognitoToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("").get(decodeCognitoToken,getTasks);
router.route("").post(decodeCognitoToken,createTask);
router.route("").patch(decodeCognitoToken,updateTask);
router.route("/:task_id").delete(decodeCognitoToken,deleteTask);
router.route("/:task_id/subtasks").get(decodeCognitoToken,getSubtasks);
router.route("/subtasks").post(decodeCognitoToken,createSubtask);
router.route("/subtasks").patch(decodeCognitoToken,updateSubtask);
router.route("/subtasks/:subtask_id").delete(decodeCognitoToken,deleteSubtask);

export default router;