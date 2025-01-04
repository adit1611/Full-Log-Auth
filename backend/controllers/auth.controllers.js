import { User } from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/codeverification.js'; 
import generateTokenAndSetCookie from '../utils/tokenandcokies.js';  
import {
	sendPasswordResetEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
    sendResetSuccessEmail,
} from "../Mailtrap/email.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if all fields are provided
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        // Check if the user already exists
        const userAlready = await User.findOne({ email });
        if (userAlready) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        // Generate verification token
        const verificationToken = generateVerificationToken();

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        // Save the new user
        await user.save();

        // Generate JWT token and set it in a cookie
        generateTokenAndSetCookie(res, user.id);

      await  sendVerificationEmail(user.email, verificationToken)

        // Return response without the password field
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined, // Hide the password from the response
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({success:false, message:"Invalid credentials"})
        }

        const isPasswordvalid = await bcryptjs.compare(password, user.password)
        if(!isPasswordvalid)
        {
            return res.status(400).json({success:false, message:"Invalid credentials"});
        }

        generateTokenAndSetCookie(res,user._id);
        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
        });
    } catch (error) {
        console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
    }
    
};

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({success:true, message:"Logged out successfully"});
};



export const verifyEmail = async (req, res) => {
    const {code} = req.body;

    try {
          const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
          })
            if(!user) {
                return res.status(400).json({success: false, message: "Invalid or expired verification code"})
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
            await user.save();

            await sendWelcomeEmail(user.email, user.name);

            res.status(200).json({
                success: true,
                message: true,
                message:"Email verification successfully",
                user : {
                    ...user.doc,
                    password: undefined,
                },
            })

    } catch (error) {
          console.log("error in verifyEmail", error);
          res.status(500).json({success: false, message: "Server error"});
    }
}

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
        user.isVerified = true;
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

