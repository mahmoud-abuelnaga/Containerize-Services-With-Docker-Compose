import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: false, default: null },
    },
    { timestamps: true },
);

const Notebook = mongoose.model("Notebook", notebookSchema);
export default Notebook;
