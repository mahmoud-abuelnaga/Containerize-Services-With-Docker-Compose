import express from "express";
import mongoose from "mongoose";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import Note from "../models/Note.js";

const NOTEBOOK_SERVICE_URL = process.env.NOTEBOOK_SERVICE_URL;
if (!NOTEBOOK_SERVICE_URL) {
    console.error(
        "NOTEBOOK_SERVICE_URL is not defined in environment variables. Exiting...",
    );
    process.exit(1);
}

const router = express.Router();

router.get("/", async (req, res) => {
    let notes;
    try {
        notes = await Note.find();
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please try again later",
        });
    }

    return res.status(StatusCodes.OK).json({
        data: notes,
    });
});

router.post("/", async (req, res) => {
    const { title, content, notebookId } = req.body;
    if (!title || !content) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Title and content are required",
        });
    }

    if (notebookId) {
        let response;
        try {
            response = await fetch(`${NOTEBOOK_SERVICE_URL}/${notebookId}`);
        } catch (error) {
            console.error("Error connecting to notebook service:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error occured at the server. Please try again later",
            });
        }

        if (
            response.status == StatusCodes.NOT_FOUND ||
            response.status == StatusCodes.BAD_REQUEST
        ) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Notebook with the given ID does not exist",
            });
        }

        if (response.status == StatusCodes.INTERNAL_SERVER_ERROR) {
            console.error("Notebook service returned 500 error");
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error occured at the server. Please try again later",
            });
        }

        if (!response.ok) {
            console.error(
                "Unexpected response from notebook service:",
                response.status,
            );
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error occured at the server. Please try again later",
            });
        }
    }

    const newNote = new Note({ title, content, notebookId });
    try {
        await newNote.save();
    } catch (error) {
        console.error("Error saving note:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please try again later",
        });
    }

    return res.status(StatusCodes.CREATED).json({ data: newNote });
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Invalid note ID",
        });
    }

    let note;
    try {
        note = await Note.findById(id);
    } catch (error) {
        console.error("Error fetching note:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please try again later",
        });
    }

    if (!note) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: "Note not found",
        });
    }

    return res.status(StatusCodes.OK).json({ data: note });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Invalid note ID",
        });
    }

    let { title, content, notebookId } = req.body;
    title = title?.trim();
    content = content?.trim();

    if (!title && !content && !notebookId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "At least one of title, content or notebookId is required to update",
        });
    }

    if (title && title.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Title cannot be empty",
        });
    }

    if (content && content.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Content cannot be empty",
        });
    }

    if (notebookId) {
        let response;
        try {
            response = await fetch(`${NOTEBOOK_SERVICE_URL}/${notebookId}`);
        } catch (error) {
            console.error("Error connecting to notebook service:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error occured at the server. Please try again later",
            });
        }

        if (
            response.status == StatusCodes.NOT_FOUND ||
            response.status == StatusCodes.BAD_REQUEST
        ) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Notebook with the given ID does not exist",
            });
        }

        if (response.status == StatusCodes.INTERNAL_SERVER_ERROR) {
            console.error("Notebook service returned 500 error");
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error occured at the server. Please try again later",
            });
        }

        if (!response.ok) {
            console.error(
                "Unexpected response from notebook service:",
                response.status,
            );
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error occured at the server. Please try again later",
            });
        }
    }

    let note;
    try {
        note = await Note.findByIdAndUpdate(
            id,
            { title, content, notebookId },
            { new: true },
        );
    } catch (error) {
        console.error("Error fetching note:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please try again later",
        });
    }

    if (!note) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: "Note not found",
        });
    }

    return res.status(StatusCodes.OK).json({ data: note });
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Invalid note ID",
        });
    }

    let note;
    try {
        note = await Note.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Error occured at the server. Please try again later",
        });
    }

    if (!note) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: "Note not found",
        });
    }

    return res.status(StatusCodes.OK).json({ message: "Note was deleted" });
});

export default router;
