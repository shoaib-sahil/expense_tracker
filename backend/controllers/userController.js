import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const generateToken = (user, jwtKey, expiresIn) => {
    const payload = {
        id: user._id,
        email: user.email,
        UserType: user.UserType,
    };
    const token = Jwt.sign(payload, jwtKey, { expiresIn });
    return token;
};

export const registerControllers = async (req, res, next) => {
    const jwtKey = process.env.JWT_SECRET; // Use environment variable for secret key
    const expiresIn = "2h";

    try {
        const { name, email, password, UserType } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            UserType,
        });

        newUser.password = undefined; // Remove password from user object

        const token = generateToken(newUser, jwtKey, expiresIn);

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user: newUser,
            dashboard: newUser.UserType,
            token
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const loginControllers = async (req, res, next) => {
    const jwtKey = process.env.JWT_SECRET; // Use environment variable for secret key
    const expiresIn = "2h";

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            });
        }

        user.password = undefined; // Remove password from user object

        const token = generateToken(user, jwtKey, expiresIn); // Generate token using a separate function

        if (user.UserType === "admin") {
            return res.status(200).json({
                success: true,
                message: `Welcome back, ${user.name}`,
                user,
                dashboard: "admin", // render admin dashboard
                token
            });
        } else {
            return res.status(200).json({
                success: true,
                message: `Welcome back, ${user.name}`,
                user,
                dashboard: "user",
                token, // render user dashboard
            });
        }
    } catch (err) {
        console.error(err); // Log error for debugging purposes
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const setAvatarController = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const imageData = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        },
            { new: true });

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });

    } catch (err) {
        next(err);
    }
};

export const allUsers = async (req, res, next) => {
    try {
        const user = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(user);
    }
    catch (err) {
        next(err);
    }
};

export const verifyUser = async (req, res, next) => {
    const token = req.get("x-access-token") || req.get("Authorization");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        const decoded = Jwt.verify(token.slice(7), process.env.JWT_SECRET);
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};