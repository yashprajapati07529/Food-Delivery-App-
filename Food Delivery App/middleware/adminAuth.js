import jwt from "jsonwebtoken";

const readAdminToken = (req) => {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("dashbite_admin="));

  return cookie?.slice("dashbite_admin=".length);
};

export const getAdminSession = (req) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  const token = readAdminToken(req);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload === "string" || payload.role !== "admin") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
};

export const requireAdminApi = (req, res, next) => {
  let admin;
  try {
    admin = getAdminSession(req);
  } catch (error) {
    console.error("Could not verify admin session:", error);
    return res.status(503).json({ success: false, message: "Admin authentication is not configured." });
  }

  if (!admin) {
    return res.status(401).json({ success: false, message: "Sign in as an admin to manage records." });
  }

  req.admin = admin;
  next();
};
