const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const status = document.getElementById("status");
const notesList = document.getElementById("notes-list");

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
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

        notes.forEach((note) => {
            const listItem = document.createElement("li");
            const title = document.createElement("h2");
            const body = document.createElement("p");

            title.textContent = note.title;
            body.textContent = note.body;

            listItem.append(title, body);
            notesList.appendChild(listItem);
        });

        status.textContent = `Loaded ${notes.length} notes from the server.`;
    } catch (error) {
        status.textContent = "Sorry, we could not load the notes. Please try again.";
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);