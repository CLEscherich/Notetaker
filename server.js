const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const mainDir = path.join(__dirname, "/public");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//the routes for the app
app.get("/notes", (req, res) => {
  res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", (req, res) => {
  const savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(mainDir, "index.html"));
});
//adding a note
app.post("/api/notes", (req, res) => {
  const savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const newNote = req.body;
  const uniqueID = savedNotes.length.toString();
  newNote.id = uniqueID;
  savedNotes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  console.log("Note saved to db.json. Content: ", newNote);
  res.json(savedNotes);
});
//deleting a note
app.delete("/api/notes/:id", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const noteID = req.params.id;
  let newID = 0;
  console.log(`Deleting note with ID ${noteID}`);
  savedNotes = savedNotes.filter(currNote => {
    return currNote.id !== noteID;
  });

  for (currNote of savedNotes) {
    currNote.id = newID.toString();
    newID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.listen(PORT, () => {
  console.log("App listening on PORT: " + PORT);
});
