import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set token in cookies
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return token;
};

export default generateTokenAndSetCookie;
