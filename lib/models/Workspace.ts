import mongoose, { Document, Model, Schema } from "mongoose";

export interface IWorkspace extends Document {
  project: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;

  files: {
    path: string;
    content: string;
  }[];

  messages: {
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    files: [
      {
        path: {
          type: String,
          required: true,
        },

        content: {
          type: String,
          required: true,
        },
      },
    ],

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },

        content: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;