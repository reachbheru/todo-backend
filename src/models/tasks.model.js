import mongoose,{ Schema } from "mongoose";
import { Subtask } from "./subtasks.model.js";

const taskSchema = new Schema(
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
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
            required: [true, "status is required"]
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: {
            type: Date,
            required: false,
            validate: {
                    validator: function (value) {
                        return value > Date.now();
                    },
                    message: "Due date can not be in past."
            }
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "owner is required for a task"],
            index: true
        }
    }
    ,
    {timestamps: true});

taskSchema.pre("remove", async function(next) {
    await Subtask.deleteMany({
        parentTask: this._id
    })
    next();
})

export const Task = mongoose.model("Task", taskSchema);