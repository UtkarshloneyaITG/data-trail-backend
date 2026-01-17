const express = require("express")
const dotenv = require("dotenv").config()
const sequelize = require("./config/db.js")
const authRoute = require("./routes/auth.routes.js")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3050
const corsOptions = {
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

async function startServer() {
  try {

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database synced (Tables created).');
    app.listen(5050, () => {
      console.log('Server running on http://localhost:5050');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();

app.get("/", () => {
  console.log({ message: Date.now() })
})
app.use("/auth", authRoute)


