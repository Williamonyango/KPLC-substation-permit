require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

// const userRoutes = require("./routes/userRoutes");
// const permitRoutes = require("./routes/permitRoutes");
// const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const permitRoutes = require("./routes/permitRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(helmet());
// app.use(
//   cors({
//     origin: ["http://localhost:5000"], // Adjust in production
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/permits", permitRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
