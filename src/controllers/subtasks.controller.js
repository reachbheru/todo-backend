import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subtask } from "../models/subtasks.model.js";
import { Task } from "../models/tasks.model.js";

const createSubtask = asyncHandler(async (req, res) => {
    const { task_id, title, description, status, priority } = req.body;
    if(!title){
        throw new ApiError(400, "title is required");
    }
    const task = await Task.findById(task_id);
    if(!task){
        throw new ApiError(400, "task not found");
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
        const subtask = await Subtask.create({
            title,
            description: description || null,
            status,
            priority,
            task:task_id
        });
        res.status(201).json( new ApiResponse(201, { subtask }, "subtask created successfully"))
    } 
    catch (error) {
        throw new ApiError(500, "failed to create subtask");
    }
});

const updateSubtask = asyncHandler(async (req, res) => {
    const { subtask_id, title, description, status, priority } = req.body;
    if(!subtask_id){
        throw new ApiError(400, "subtask is required");
    }

    if(!title && !description && !status && !priority){
        throw new ApiError(400, "atleast one field is required");
    }
    const fields_to_update = {};
    ["title","description","status","priority"].forEach((key) => {
        if(req.body[key] && typeof req.body[key] === "string" && req.body[key].trim() !== ""){
            fields_to_update[key] = req.body[key];
        }
        else if(req.body[key]){
            fields_to_update[key] = req.body[key];
        }
    })
    const updatedSubtask = await Subtask.findByIdAndUpdate(subtask_id,{$set:fields_to_update},{new:true, select:"-createdAt -updatedAt"});
    if(!updatedSubtask){
        throw new ApiError(500, "subtask not found");
    }
    res.status(200).json(new ApiResponse(200,{updatedSubtask},"subtask updated"))
});

const deleteSubtask = asyncHandler(async (req, res) => {
    const { subtask_id } = req.params;
    if(!subtask_id){
        throw new ApiError(400, "subtask id is required");
    }
    try {
        const deletedSubtask = await Subtask.findByIdAndDelete(subtask_id);
        if(!deletedSubtask){
            throw new ApiError(400, "subtask not found");
        }
        res.status(200).json(new ApiResponse(200,{},"subtask deleted successfully"))
    } catch (error) {
        throw new ApiError(500, "subtask deletion failed");
    }
});

const getSubtasks = asyncHandler(async (req, res) => {
    const { task_id } = req.params;
    if(!task_id){
        throw new ApiError(400, "task id is required");
    } 
    const isTaskExist = await Task.exists({_id: task_id});
    if(!isTaskExist){
        throw new ApiError(404, "task not found");
    }
    const subtasks = await Subtask.find({task:task_id}).select("-createdAt -updatedAt");
    res.status(200).json(new ApiResponse(200,{task_id,subtasks},"retrieved subtasks successfully"))
});

export { 
    createSubtask,
    updateSubtask,
    deleteSubtask,
    getSubtasks
}