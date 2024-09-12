import express from "express";
import { check, GitLabWebHook } from "../controllers/check";

const router = express.Router();

router.get("/check", check);
router.post("/webhook", GitLabWebHook);

export = router;
