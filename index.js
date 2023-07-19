import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares.js";

dotenv.config();

const app = express();

app.use(express.json());

const user = {
  username: "admin",
  email: "admin@gmail.com",
  password: "123456",
};
const animalsArray = [
  {
    name: "Gireffe",
    createdAt: new Date(),
  },
  {
    name: "Elephant",
    createdAt: new Date(),
  },
  {
    name: "Lion",
    createdAt: new Date(),
  },
];

let refreshTokens = [];

app.get("/animals", authMiddleware, (req, res) => {
  console.log(req.user);
  res.json(animalsArray);
});

app.post('/logout',(req,res)=>{
    console.log(refreshTokens);
    refreshTokens = refreshTokens.filter(token=> token !== req.body.refreshToken)
    console.log(refreshTokens);
    res.sendStatus(200)
})

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    }
    const accessToken = jwt.sign(
      { email: data.email, username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    return res.status(200).json({accessToken})
  });
});




// giris yapma access ve refresh tokenlerin olusturulma islemi
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email !== user.email || password !== user.password) {
    return res.status(401).json({ msg: "Bilgiler gecersiz..." });
  }
  const accessToken = jwt.sign(
    { email: user.email, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "40s" }
  );
  const refreshToken = jwt.sign(
    { email: user.email, username: user.username },
    process.env.REFRESH_TOKEN_SECRET
  );
  refreshTokens.push(refreshToken);
  res.status(200).json({ accessToken, refreshToken });
});









app.listen(5000, () => {
  console.log("Server 5000 ci portda hazir");
});
