import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});




export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});


export const forgot_password = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password Link',
    text: `http://localhost:5173/reset-password/${user._id}/${token}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return next(new ErrorHandler("Failed to send email", 500));
    } else {
      res.status(200).send({ Status: "Success", message: "Check your mail" });
    }
  });
});

export const reset_password = catchAsyncErrors(async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new ErrorHandler("Please provide a new password", 400));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return next(new ErrorHandler("Invalid or expired token", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).send({ Status: "Success", message: "Password reset successfully" });
  });
});

export const getTotalEmployers = catchAsyncErrors(async (req, res, next) => {
  const totalEmployers = await User.countDocuments({ role: 'Employer' });
  res.status(200).json({
    success: true,
    totalEmployers,
  });
});

export const getTotalJobSeekers = catchAsyncErrors(async (req, res, next) => {
  const totalJobSeekers = await User.countDocuments({ role: 'Job Seeker' });
  res.status(200).json({
    success: true,
    totalJobSeekers,
  });
});