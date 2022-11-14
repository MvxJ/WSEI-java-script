const notesBox = document.getElementById("notes");
const notesFromStorage = localStorage.getItem("notes");
const notesObject = JSON.parse(notesFromStorage);
