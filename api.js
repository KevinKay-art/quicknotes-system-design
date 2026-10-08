const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const submitButton = document.getElementById("submit-btn");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const status = document.getElementById("status");
const notesList = document.getElementById("notes-list");

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
}

function displayNote(note, addToTop = false) {
    const listItem = document.createElement("li");
    listItem.className = "note";

    const title = document.createElement("h2");
    const body = document.createElement("p");
    const deleteButton = document.createElement("button");

    title.textContent = note.title;
    body.textContent = note.body;

    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => deleteNote(note.id, listItem, deleteButton));

    listItem.append(title, body, deleteButton);

    if (addToTop) {
        notesList.prepend(listItem);
    } else {
        notesList.appendChild(listItem);
    }
}

async function deleteNote(id, listItem, deleteButton) {
    deleteButton.disabled = true;
    status.textContent = "Deleting note...";
    status.className = "";

    try {
        // JSONPlaceholder accepts DELETE requests but does not permanently store changes.
        // We remove the note from our page to reflect the successful DELETE response.
        const response = await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            listItem.remove();
            status.textContent = `Note deleted (status ${response.status}).`;
            status.className = "status-success";
        }
    } catch (error) {
        deleteButton.disabled = false;
        status.textContent = "Sorry, we could not delete the note. Please try again.";
        status.className = "status-error";
    } finally {
        deleteButton.disabled = false;
    }
}

async function loadNotes() {
    loadButton.disabled = true;
    status.textContent = "Loading notes...";
    notesList.replaceChildren();

    try {
        const response = await request(`${API_URL}?_limit=10`);
        const notes = await response.json();

        if (notes.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "No notes found.";
            notesList.appendChild(emptyMessage);
            status.textContent = "No notes found.";
            return;
        }

        notes.forEach((note) => displayNote(note));

        status.textContent = `Loaded ${notes.length} notes from the server.`;
        status.className = "status-success";
    } catch (error) {
        status.textContent = "Sorry, we could not load the notes. Please try again.";
        status.className = "status-error";
    } finally {
        loadButton.disabled = false;
    }
}

async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        status.textContent = "Please enter a title.";
        status.className = "status-error";
        return;
    }

    if (title.length > 100) {
        status.textContent = "Title must be 100 characters or fewer.";
        status.className = "status-error";
        return;
    }

    submitButton.disabled = true;
    status.textContent = "Creating note...";
    status.className = "";

    try {
        const response = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const newNote = await response.json();

        displayNote(newNote, true);

        status.textContent = `Note created (status ${response.status}, id ${newNote.id}).`;
        status.className = "status-success";

        noteForm.reset();
    } catch (error) {
        status.textContent = "Sorry, we could not create the note. Please try again.";
        status.className = "staus-error";
    } finally {
        submitButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);