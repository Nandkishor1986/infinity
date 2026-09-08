import { Router } from 'express';
import { login, registerAdmin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register-admin', registerAdmin);
router.post('/login', login);

export default router;
