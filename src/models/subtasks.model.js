import mongoose,{ Schema } from "mongoose";

const subtaskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "todo-next", "in-progress", "completed"],
            default: "todo-next"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: [true, "parent task is required for subtask"],
            index: true
        }
    }
    ,
    {timestamps: true});

export const Subtask = mongoose.model("Subtask", subtaskSchema);