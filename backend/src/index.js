import app from "./app.js";

const port = Number(process.env["PORT"]) || 8080;

app.listen(port, (err) => {
  if (err) {
    console.error("Error listening on port", err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
