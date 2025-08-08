import {getUserById} from "../controllers/user.controller";
import express from 'express';

const router = express.Router();
router.get('/', getUserById);

export default router;
