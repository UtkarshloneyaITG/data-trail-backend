const express = require("express")
const dotenv = require("dotenv").config()
const sequelize = require("./config/db.js")
const authRoute = require("./routes/auth.routes.js")

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3050

async function startServer() {
  try {
    // .authenticate() checks the connection
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL.');

    // .sync() actually creates the table if it doesn't exist
    // Use { alter: true } during development to update columns without deleting data
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
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`)
})


