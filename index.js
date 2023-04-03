const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { prisma } = require("./db");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.post("/", async (req, res) => {
  try {
    const { body } = req;
    if (!body.name || !body.email || !body.phone || !body.metaData) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    if (typeof body.metaData !== "object") {
      return res.status(400).json({
        message: 'metaData must be an object e.g {"CRUST": "value"}',
      });
    }
    await prisma.entry.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        metaData: body.metaData,
      },
    });
    res.json({
      message: "User created",
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});
