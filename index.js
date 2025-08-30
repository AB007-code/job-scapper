const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(
  cors({
    origin: "https://resonant-marshmallow-3c4ba8.netlify.app",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.get("/xyz", (req, res, next) => {
//   //   console.log("Hi");
//   res.send(
//     "<form action='/products' method='POST'><input type='text' name='full name'/> <button>submit</button></form>"
//   );
//   next();
// });

app.post("/products", async (req, res, next) => {
  //   console.log(req.body);
  res.json({ message: "Product recived", data: req.body });
  try {
    let response = await fetch(`${process.env.N8N_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(req.body),
    });

    if (response.ok) {
      console.log("Data sent successfully:", await response.json());
    } else {
      console.error("Error:", response.status, await response.text());
    }
  } catch (err) {
    console.log(err.message);
  }

  next();
});

app.post("/signin", (req, res, next) => {
  let { email, password } = req.body;
  const envEmail = process.env.EMAIL_ID;
  const envPassword = process.env.EMAIL_PASS;
  if (email === envEmail && password === envPassword) {
    res.json({ message: true });
  } else {
    res.json({ message: false });
  }
});
let taskStatus = "Submit";
let completedAt = null;

app.post("/workflow-complete", (req, res) => {
  taskStatus = "completed";
  completedAt = Date.now();
  res.json({ ok: true });
});

app.get("/task-status", (req, res) => {
  console.log();
  if (taskStatus === "completed" && completedAt) {
    const diff = Date.now() - completedAt;
    if (diff < 60 * 1000) {
      return res.json({ status: "sleep" }); // sleep for 4 hours
    } else {
      taskStatus = "Submit"; // reset after 4 hours
    }
  }
  res.json({ status: taskStatus });
});

// app.get("/products", (req, res, next) => {
//   //   console.log("My name is Abhilash");
//   res.send("<h1>Hello From Server2</h1>");
//   next();
// });

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running...");
});
// console.log(app);
