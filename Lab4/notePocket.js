const notesBox = document.querySelector(".notesBoard");
const closeModalButton = document.getElementById("closeModalButton");
const addNoteButton = document.getElementById("createNote");
const saveNoteButton = document.getElementById("saveNote");
const reminderSwitch = document.getElementById("reminder");
let notes = [];

fetchNotes();

reminderSwitch.addEventListener("click", event => {
    const reminderFields = document.getElementById("reminderFields");
    if (reminderSwitch.checked == 1) {
        reminderFields.classList.replace("hidden", "visible");
    } else {
        reminderFields.classList.replace("visible", "hidden");
    }
});

closeModalButton.addEventListener("click", event => {
    const form = document.getElementById("noteForm");
    document.getElementById("formAction").value = "";
    form.classList.replace('visible', 'hidden');
});

addNoteButton.addEventListener("click", event => {
    const form = document.getElementById("noteForm");
    document.getElementById("formAction").value = "create";
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
        id: generateId(6),
        createdAt: Date.now(),
        title: document.getElementById("noteTitle").value,
        date: document.getElementById("noteDate").value,
        content: document.getElementById("noteContent").value,
        tag: document.getElementById("noteTag").value,
        reminder: document.getElementById("reminder").checked == 1 ? true : false,
        reminderDate: document.getElementById("reminder").checked == 1 ? document.getElementById("rememberDate").value : null,
    }

    notes.push(note);
    clearForm();
    saveNotes()
    const form = document.getElementById("noteForm");
    form.classList.replace('visible', 'hidden');
    clearForm();
}

function createHtmlNote(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.id = note.id;
    createNoteHeader(noteDiv, note);
    createNoteContent(noteDiv, note.content);
    createNoteActions(noteDiv, note);

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

function createNoteActions(element, note) {
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('note-actions');

    createEditNoteButton(actionsDiv, note);
    createDeleteNoteButton(actionsDiv, note);

    element.appendChild(actionsDiv)
}

function createEditNoteButton(element, note) {
    const button = document.createElement('div');
    button.classList.add("edit-note-button");
    button.textContent = "Edit";
    // button.addEventListener("click", editNote(note));

    element.appendChild(button);
}

function createDeleteNoteButton(element, note) {
    const button = document.createElement('div');
    button.classList.add("delete-note-button");
    button.textContent = "Delete";
    button.addEventListener("click", deleteNote(note));

    element.appendChild(button);
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
    tagBox.classList.add("noteTag");
    
    element.appendChild(tagBox);
}

function addNoteDate(element, date) {
    const noteDateDiv = document.createElement('div');
    noteDateDiv.classList.add("noteDate");
    noteDateDiv.textContent = date;

    element.appendChild(noteDateDiv);
}

function generateId(length) {
    let id = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return id;
}

function deleteNote(note) {
    notes.slice(note);
    // saveNotes();
}

function saveNotes() {
    const notesToString = JSON.stringify(notes);
    localStorage.setItem("notes", notesToString);
    fetchNotes();
}

function clearForm() {
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteDate").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("noteTag").value = "";
    document.getElementById("reminder").checked == 0;
    document.getElementById("reminder").checked == 0;
}