const notesBox = document.querySelector(".notesBoard");
const closeModalButton = document.getElementById("closeModalButton");
const addNoteButton = document.getElementById("createNote");
const saveNoteButton = document.getElementById("saveNote");
const reminderSwitch = document.getElementById("reminder");
const closeDeleteModalButtons = document.querySelectorAll(".closeModalDeleteButton");
const deleteModal = document.getElementById("deleteModal");
const deleteNoteButton = document.getElementById("deleteNoteButton");
const searchButton = document.getElementById("search");
const addElementToList = document.getElementById("addElementToList");
const toDoListCheckbox = document.getElementById("toDoList");
let notes = [];
let noteToDelete = null;

fetchNotes();
setInterval(reminder, 1000);

deleteNoteButton.addEventListener("click", confirmDeleteNote)

closeDeleteModalButtons.forEach(button => {
    button.addEventListener("click", closeDeleteModal)
});

addElementToList.addEventListener("click", addElementToToDoList);

toDoListCheckbox.addEventListener("click", event => {
    const fields = document.getElementById("toDoListForm");
    if (toDoListCheckbox.checked == 1) {
        fields.classList.replace("hidden", "visible");
    } else {
        fields.classList.replace("visible", "hidden");
    }
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
        notes.sort((a,b) => b.createdAt - a.createdAt);
        notes.sort((a, b) => b.pin - a.pin);
    };
    
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
        pin: document.getElementById("notePin").checked ? true : false,
        toDoList: document.getElementById("toDoList").checked ? true : false,
        toDoListContent: document.getElementById("toDoList").checked ? document.getElementById("toDoListContent").outerHTML : null,
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
    const box = document.getElementById("toDoListBox");
    form.classList.replace("hidden", "visible");    
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteIndex").value = notes.indexOf(note);
    document.getElementById("noteId").value = note.id;
    document.getElementById("noteDate").value = note.date;
    document.getElementById("noteContent").value = note.content;
    document.getElementById("noteTag").value = note.tag;
    document.getElementById("reminder").checked = note.reminder;
    document.getElementById("rememberDate").value = note.reminderDate;
    document.getElementById("noteColor").value = note.color;
    document.getElementById("notePin").checked = note.pin;
    document.getElementById("toDoList").checked = note.toDoList;
    note.reminder ? reminderFields.classList.replace("hidden", "visible") : reminderFields.classList.replace("visible", "hidden");
    note.toDoList ? document.getElementById("toDoListForm").classList.replace("hidden", "visible") : document.getElementById("toDoListContent").classList.replace("visible", "hidden");
    document.getElementById("formAction").value = "edit";
    box.innerHtml = "";
    box.innerHTML = note.toDoListContent;
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
    const resetButton = document.getElementById('resetFilters');
    resetButton.addEventListener("click", resetFilters);
    resetButton.classList.remove('hidden');

    if (criteria != "") {
        notesBox.innerHTML = "";
        let searchResults = notes.filter(function (note) {
            return note.title.toLowerCase().indexOf(criteria) >= 0 || note.tag.toLowerCase().indexOf(criteria) >= 0 || note.content.toLowerCase().indexOf(criteria) >= 0;
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

function resetFilters() {
    const resetButton = document.getElementById('resetFilters');
    resetButton.classList.add('hidden');
    fetchNotes();
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
    if (document.getElementById("toDoList").checked) {
        document.getElementById("toDoListContent").textContent = "";
    }

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteDate").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("noteTag").value = "";
    document.getElementById("reminder").checked = "";
    document.getElementById("rememberDate").value = "";
    document.getElementById("formAction").value = "";
    document.getElementById("noteId").value = "";
    document.getElementById("noteIndex").value = "";
    document.getElementById("noteColor").value = "#feff9c";
    document.getElementById("notePin").checked = "";
    document.getElementById("toDoList").checked = "";
    reminderFields.classList.replace("visible", "hidden");
    document.getElementById("toDoElement").value = "";
    document.getElementById("toDoListForm").classList.replace("visible", "hidden");
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

function addElementToToDoList() {
    const elementName = document.getElementById("toDoElement").value;
    const checkBoxField = document.createElement('input')
    const randomString = generateId(12);
    const toDoContent = document.getElementById("toDoListContent");
    checkBoxField.type = "checkbox";
    checkBoxField.id = randomString;
    const label = document.createElement('label');
    label.for = randomString;
    label.textContent = elementName;
    const div = document.createElement('div');
    div.classList.add('to-do-list-element');
    div.appendChild(checkBoxField);
    div.appendChild(label);
    toDoContent.appendChild(div);
}