import { Subtask } from "../models/subtasks.model.js";
import { Task } from "../models/tasks.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    if(!title){
        throw new ApiError(400, "title is required");
    }
    const validStatus = ["pending", "todo-next", "in-progress", "completed"];
    const validPriority = ["low", "medium", "high"];
    if(status && !validStatus.includes(status)){
        throw new ApiError(400, "invalid status");
    }
    if(priority && !validPriority.includes(priority)){
        throw new ApiError(400, "invalid priority");
    }
    try {
        const user_id = req.user._id;
        const task = await Task.create({
            title,
            description: description || null,
            status,
            priority,
            dueDate: dueDate,
            user: user_id
        });
        if(!task){
            throw new ApiError(500, "task not created");
        }
        console.log("task is :",task);
        return res
        .status(201)
        .json( new ApiResponse(201, { task }, "task created successfully"))
    } 
    catch (error) {
        throw new ApiError(500, "task creation failed");
    } 
});

const updateTask = asyncHandler(async (req, res) => {
    const { task_id, title, description, status, priority, dueDate } = req.body;
    if(!task_id){
        throw new ApiError(400, "task_id is required");
    }
    
    if(!title && !description && !status && !priority && !dueDate ){
        throw new ApiError(400, "atleast one field is required");
    }
    try {
        const fields_to_update = {};
        ["title", "description", "status", "priority", "dueDate"].forEach((key) => {
            if (req.body[key] && typeof req.body[key] === "string" && req.body[key].trim() !== "") {
                fields_to_update[key] = req.body[key];
            } 
            else if (req.body[key]) {
                fields_to_update[key] = req.body[key];
            }
        });
        const updatedTask = await Task.findByIdAndUpdate(task_id,{$set: fields_to_update},{new: true}).select("-user -createdAt -updatedAt");
        if(!updatedTask){
            throw new ApiError(500, "task not found");
        }
        res.status(200).json( new ApiResponse(200, {updatedTask} , "task updated successfully"))
    } 
    catch (error) {
        throw new ApiError(500, "task updation failed");
    }
});

const deleteTask = asyncHandler(async (req, res) => {
    const { task_id } = req.params;
    if(!task_id){
        throw new ApiError(400, "task_id is required");
    }
    try {
        await Subtask.deleteMany({task:task_id});
        const deletedTask = await Task.findByIdAndDelete(task_id);
        if(!deletedTask){
            throw new ApiError(404, "task not found");
        }
        res.status(200).json(new ApiResponse(200, {}, "task deleted successfully"))
    } 
    catch (error) {
        throw new ApiError(500, "task deletion failed");
    }
});

const getTasks = asyncHandler(async (req, res) => {
    try {
        let filter = { user: req.user._id };

        if (req.query.status) filter.status = req.query.status;
        if (req.query.priority) filter.priority = req.query.priority;

        const tasks = await Task.find(filter);
        console.log("tasks is :",tasks);
        res.status(200).json(new ApiResponse(200, tasks, "Retrieved tasks successfully"));
    } 
    catch (error) {
        throw new ApiError(500, "Failed to get tasks");
    }
});
 
export { 
    createTask,
    updateTask,
    deleteTask,
    getTasks
}