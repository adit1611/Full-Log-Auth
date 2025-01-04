import express from "express";
import { login, logout, signup,verifyEmail , forgotPassword,resetPassword,checkAuth} from "../controllers/auth.controllers.js"; // Note the `.js` extension

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// check details

// router.get("/signup", (req,res) => {
//     res.send("Signup routes");
// });

// router.get("/login", (req,res) => {
//     res.send("Login routes");
// });


router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/check-auth", verifyToken, checkAuth);

// router.get("/update-profile", verifyToken, updateProfile);

export default router;
