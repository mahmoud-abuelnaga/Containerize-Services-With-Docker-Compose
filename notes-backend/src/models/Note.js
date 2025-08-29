import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        notebookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notebook",
            required: false,
            default: null,
        },
    },
    { timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
