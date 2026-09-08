import express from "express";

import { updateAccount } from "../controllers/account.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.put("/", protect, updateAccount);

export default router;