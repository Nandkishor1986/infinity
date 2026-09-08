import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function updateAccount(req, res, next) {
  try {
    const { name, email, currentPassword, newPassword } = req.body || {};

    const user = await User.findById(req.user.id).select("+passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update name
    if (name?.trim()) {
      user.name = name.trim();
    }

    // Update email
    if (email?.trim() && email.trim().toLowerCase() !== user.email) {
      const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "This email is already registered"
        });
      }

      user.email = email.trim().toLowerCase();
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required"
        });
      }

      const validPassword = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters"
        });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    res.json({
      success: true,
      message: "Account updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
}