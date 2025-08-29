import express from "express";
import Notebook from "../models/Notebook.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
    let notebooks;
    try {
        notebooks = await Notebook.find();
    } catch (error) {
        console.error("Error getting notebooks from database", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please retry later",
        });
    }

    return res.status(StatusCodes.OK).json({ data: notebooks });
});

router.post("/", async (req, res) => {
    let { title, description } = req.body;
    if (!title) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Title is required",
        });
    }

    if (description) {
        description = description.trim();
        if (description.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Description cannot be empty string",
            });
        }
    }

    const newNotebook = new Notebook({ title, description });
    try {
        await newNotebook.save();
    } catch (error) {
        console.error("Error saving notebook to database", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please retry later",
        });
    }

    return res.status(StatusCodes.CREATED).json({ data: newNotebook });
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Invalid notebook ID",
        });
    }

    let notebook;
    try {
        notebook = await Notebook.findById(id);
    } catch (error) {
        console.error("Error getting notebook from database", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please retry later",
        });
    }

    if (!notebook) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: "Notebook not found",
        });
    }

    return res.status(StatusCodes.OK).json({ data: notebook });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Invalid notebook ID",
        });
    }

    let { title, description } = req.body;

    if (!title && !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Title or Description is required to update",
        });
    }

    title = title ? title.trim() : title;
    description = description ? description.trim() : description;

    if (title && title.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Title cannot be empty string",
        });
    }

    if (description && description.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Description cannot be empty string",
        });
    }

    let notebook;
    try {
        notebook = await Notebook.findByIdAndUpdate(
            id,
            { title, description },
            { new: true },
        );
    } catch (error) {
        console.error("Error updating notebook in database", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please retry later",
        });
    }

    if (!notebook) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: "Notebook not found",
        });
    }

    return res.status(StatusCodes.OK).json({ data: notebook });
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Invalid notebook ID",
        });
    }

    let notebook;
    try {
        notebook = await Notebook.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error deleting notebook from database", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please retry later",
        });
    }

    if (!notebook) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: "Notebook not found",
        });
    }

    return res.status(StatusCodes.OK).json({ message: "Notebook was deleted" });
});

export default router;
