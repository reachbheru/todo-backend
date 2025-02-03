import mongoose,{ Schema } from "mongoose";

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
            enum: ["pending", "todo-next", "in-progress", "completed"],
            default: "pending"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: {
            type: Date,
            required: false,
            default: () => new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            validate: {
                    validator: function (value) {
                        if(!value) return true;
                        return value.getTime() > Date.now();
                    },
                    message: "Due date can not be in past."
            }
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "owner is required for a task"],
            index: true
        }
    }
    ,
    {timestamps: true});


export const Task = mongoose.model("Task", taskSchema);