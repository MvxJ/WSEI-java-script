const notesBox = document.querySelector(".notesBoard");
const closeModalButton = document.getElementById("closeModalButton");
const addNoteButton = document.getElementById("createNote");
const saveNoteButton = document.getElementById("saveNote");
const reminderSwitch = document.getElementById("reminder");
const closeDeleteModalButtons = document.querySelectorAll(".closeModalDeleteButton");
const deleteModal = document.getElementById("deleteModal");
const deleteNoteButton = document.getElementById("deleteNoteButton");
const searchButton = document.getElementById("search");
let notes = [];
let noteToDelete = null;

fetchNotes();
setInterval(reminder, 1000);

deleteNoteButton.addEventListener("click", confirmDeleteNote)

closeDeleteModalButtons.forEach(button => {
    button.addEventListener("click", closeDeleteModal)
});

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
    clearForm();
    form.classList.replace('visible', 'hidden');
});

addNoteButton.addEventListener("click", event => {
    const form = document.getElementById("noteForm");
    document.getElementById("formAction").value = "create";
    form.classList.replace('hidden', 'visible');
});

searchButton.addEventListener("click", searchNotes);

saveNoteButton.addEventListener("click", saveNote);

function fetchNotes() {
    const storageNotes = localStorage.getItem("notes");

    if (storageNotes != null) {
        notes = JSON.parse(storageNotes);
        notes.reverse();
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
    const formAction = document.getElementById("formAction").value;
   
    const note = {
        id: document.getElementById("noteId").value != "" ? document.getElementById("noteId").value : generateId(6),
        createdAt: Date.now(),
        title: document.getElementById("noteTitle").value,
        date: document.getElementById("noteDate").value,
        color: document.getElementById("noteColor").value,
        content: document.getElementById("noteContent").value,
        tag: document.getElementById("noteTag").value,
        reminder: document.getElementById("reminder").checked == 1 ? true : false,
        reminderDate: document.getElementById("reminder").checked == 1 ? document.getElementById("rememberDate").value : null,
        notificationShowed: false
    }

    if (formAction === "create") {
        notes.push(note);
    } else if (formAction === "edit") {
        const noteIndex = document.getElementById("noteIndex").value;
        notes[noteIndex] = note;
    }

    clearForm();
    saveNotes()
    const form = document.getElementById("noteForm");
    form.classList.replace('visible', 'hidden');
    clearForm();
}

function createHtmlNote(note) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.style.backgroundColor = note.color;
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
    button.addEventListener("click", event => {
        editNote(note);
    });

    element.appendChild(button);
}

function createDeleteNoteButton(element, note) {
    const button = document.createElement('div');
    button.classList.add("delete-note-button");
    button.textContent = "Delete";
    button.addEventListener("click", event => {
        deleteNote(note);
    });

    element.appendChild(button);
}

function editNote(note) {
    const form = document.getElementById("noteForm");
    form.classList.replace("hidden", "visible");    
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteIndex").value = notes.indexOf(note);
    document.getElementById("noteId").value = note.id;
    document.getElementById("noteDate").value = note.date;
    document.getElementById("noteContent").value = note.content;
    document.getElementById("noteTag").value = note.tag;
    document.getElementById("reminder").checked == note.reminder;
    document.getElementById("rememberDate").value == note.reminderDate;
    document.getElementById("noteColor").value = note.color;
    reminderFields.classList.replace("hidden", "visible");
    document.getElementById("formAction").value = "edit";
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

function searchNotes() {
    const criteria = document.getElementById("searchText").value;

    if (criteria != "") {
        notesBox.innerHTML = "";
        let searchResults = notes.filter(function (note) {
            return note.title.indexOf(criteria) >= 0 || note.tag.indexOf(criteria) >= 0 || note.content.indexOf(criteria) >= 0;
        });

        if (searchResults.length > 0) {
            notesBox.innerHTML = "";
            searchResults.forEach(note => {
                createHtmlNote(note);
            });
        } else {
            notesBox.innerHTML = "No notes found for this criteria...";
        }
    }
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
    deleteModal.classList.replace("hidden", "visible");
    document.getElementById("noteToDeleteTitle").textContent = note.title;
    noteToDelete = note;
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
    document.getElementById("rememberDate").value = "";
    document.getElementById("formAction").value = "";
    document.getElementById("noteId").value = "";
    document.getElementById("noteIndex").value = "";
    document.getElementById("noteColor").value = "#feff9c";
    reminderFields.classList.replace("visible", "hidden");
}

function closeDeleteModal() {
    noteToDelete = null;
    deleteModal.classList.replace("visible", "hidden");
}

function reminder() {
    const notesToReminder = notes.filter(function (note) {
        return note.reminder == true && note.notificationShowed == false;
    });

    notesToReminder.forEach(note => {
        const reminderDate = new Date(note.reminderDate);
        const currentDate = new Date();

        if (reminderDate < currentDate || currentDate == reminderDate) {
            note.notificationShowed = true;
            notes[notes.indexOf(note)] = note;
            saveNotes();
            window.alert("Do you remember about your note? Please see note " + note.title + "!");
        }
    });
}

function confirmDeleteNote() {
    if (noteToDelete != null) {
        notes.splice(notes.indexOf(noteToDelete), 1);
        noteToDelete = null;
        closeDeleteModal();
        saveNotes();
    }
}