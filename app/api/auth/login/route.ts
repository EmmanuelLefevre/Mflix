import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

// Simuler une base de données (remplacez par une vraie DB)
const users = [
  { username: "admin", password: bcrypt.hashSync("password", 10) } // Hasher le mot de passe
];

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Générer les tokens
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: "7d" });

  // Stocker les tokens en cookies
  const response = NextResponse.json({ message: "Authenticated", jwt: token });
  response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
  response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, path: "/" });

  return response;
}
