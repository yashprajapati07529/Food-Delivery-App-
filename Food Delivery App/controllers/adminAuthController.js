import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAdminSession } from "../middleware/adminAuth.js";

const getCookieOptions = (remember) => {
  const options = ["Path=/", "HttpOnly", "SameSite=Lax"];
  if (remember) options.push("Max-Age=2592000");
  if (process.env.NODE_ENV === "production") options.push("Secure");
  return options.join("; ");
};

export const getAdminStatus = (req, res) => {
  try {
    const admin = getAdminSession(req);
    return res.json({ success: true, authenticated: Boolean(admin), email: admin?.email || null });
  } catch (error) {
    console.error("Could not read admin session:", error);
    return res.status(503).json({ success: false, message: "Admin authentication is not configured." });
  }
};

export const loginAdmin = async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !passwordHash || !process.env.JWT_SECRET) {
    console.error("Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and JWT_SECRET in .env to enable admin sign in.");
    return res.status(503).json({
      success: false,
      message: "Admin sign-in is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.",
    });
  }

  const { email, password, remember } = req.body;
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const matchesPassword = await bcrypt.compare(password, passwordHash);
    if (email.trim().toLowerCase() !== adminEmail || !matchesPassword) {
      return res.status(401).json({ success: false, message: "Email or password is incorrect." });
    }

    const rememberMe = remember === true || remember === "true" || remember === "on";
    const token = jwt.sign(
      { role: "admin", email: adminEmail },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : "8h" }
    );

    res.setHeader("Set-Cookie", `dashbite_admin=${token}; ${getCookieOptions(rememberMe)}`);
    return res.json({ success: true, message: "Admin sign-in successful." });
  } catch (error) {
    console.error("Admin sign-in failed:", error);
    return res.status(500).json({ success: false, message: "Unable to complete sign-in." });
  }
};

export const logoutAdmin = (req, res) => {
  const options = ["Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (process.env.NODE_ENV === "production") options.push("Secure");
  res.setHeader("Set-Cookie", `dashbite_admin=; ${options.join("; ")}`);
  return res.json({ success: true, message: "Signed out." });
};
