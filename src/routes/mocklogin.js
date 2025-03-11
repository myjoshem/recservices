import express from "express";
import { mockLogin } from "../controllers/mocklogin.js";

const router = express.Router();

router.post("/", mockLogin);

export default router;
