const notesBox = document.querySelector(".notesBoard");
const closeModalButton = document.getElementById("closeModalButton");
const addNoteButton = document.getElementById("createNote");
const saveNoteButton = document.getElementById("saveNote");
let notes = [];

fetchNotes();

closeModalButton.addEventListener("click", event => {
    const form = document.getElementById("noteForm");
    form.classList.replace('visible', 'hidden');
});

addNoteButton.addEventListener("click", event => {
    const form = document.getElementById("noteForm");
    form.classList.replace('hidden', 'visible');
});

saveNoteButton.addEventListener("click", saveNote);

function fetchNotes() {
    const storageNotes = localStorage.getItem("notes");

    if (storageNotes != null) {
        notes = JSON.parse(storageNotes);
    }
    
    if (Object.keys(notes).length === 0) {
        notesBox.innerHTML = "<p>No notes found please add new notes...<p>";
    } else {
        notesBox.innerHTML = "";
        notes.forEach(note => {
            createHtmlNote(note);
        });
    }
}

function saveNote() {
    const note = {
        title: document.getElementById("noteTitle").value,
        date: document.getElementById("noteDate").value,
        content: document.getElementById("noteContent").value
    }

    notes.push(note);
    const notesToString = JSON.stringify(notes);
    localStorage.setItem("notes", notesToString);

    fetchNotes();
}

function createHtmlNote(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    createNoteHeader(noteDiv, note);
    createNoteContent(noteDiv, note.content);

    notesBox.appendChild(noteDiv);
}

function createNoteHeader(element, note) {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add("noteHeader");
    createTitle(headerDiv, note)

    element.appendChild(headerDiv);
}

function createNoteContent(element , content) {
    const noteContentDiv = document.createElement('div');
    noteContentDiv.classList.add("noteContent");
    noteContentDiv.textContent = content;

    element.appendChild(noteContentDiv);
}

function createTitle(element, note) {
    const titleDiv = document.createElement('div');
    titleDiv.classList.add("noteTitle");
    titleDiv.textContent = note.title;
    
    if (note.tag) {
        createNoteTag(titleDiv, note.tag);
    }

    if (note.date) {
        addNoteDate(titleDiv, note.date)
    }

    element.appendChild(titleDiv);
}

function createNoteTag(element, tag) {
    const tagBox = document.createElement('span');
    tagBox.textContent = tag;
    
    element.appendChild(tagBox);
}

function addNoteDate(element, date) {
    const noteDateDiv = document.createElement('div');
    noteDateDiv.classList.add("noteDate");
    noteDateDiv.textContent = date;

    element.appendChild(noteDateDiv);
}