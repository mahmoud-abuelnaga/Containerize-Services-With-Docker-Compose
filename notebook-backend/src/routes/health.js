import express from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const router = express.Router();

router.get("/health", (req, res) => {
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
});

export default router;
