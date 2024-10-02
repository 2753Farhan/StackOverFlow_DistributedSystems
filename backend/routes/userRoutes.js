import express from "express";
import { login, register, logout, getUser ,forgot_password, reset_password, getTotalEmployers, getTotalJobSeekers} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot_password);
router.post("/reset-password/:id/:token",reset_password)
router.get('/totalemployers',getTotalEmployers )
router.get('/totaljobseekers',getTotalJobSeekers )
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);


export default router;
