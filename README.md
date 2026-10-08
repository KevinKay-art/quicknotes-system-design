# QuickNotes System Design

## Project Description

QuickNotes is a note-taking application designed to demonstrate how a browser-based application can communicate with an API and how the system could be designed to support up to 1 million users.

The project includes a JavaScript API client using the JSONPlaceholder practice API and three system-design documents covering the proposed REST API, database model, and scalable system architecture.

## Project Structure

```text
quicknotes-system-design/
├── index.html
├── api.js
├── style.css
├── README.md
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

## How to Run the API Client

1. Clone the repository:

```bash
git clone https://github.com/KevinKay-art/quicknotes-system-design.git
```

2. Open the project folder.

3. Open `index.html` in a web browser.

4. Click **Load notes** to retrieve notes from the JSONPlaceholder API.

5. Use the form to create a note and use the Delete buttons to remove notes from the current page.

The API client uses:

`https://jsonplaceholder.typicode.com/posts`

No backend server is required to run the practice client.

## System Design Documents

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

## What I Learned

- I learned how to use JavaScript `fetch()` to communicate with a REST API and handle GET, POST, and DELETE requests.
- I learned how to design REST API endpoints and use HTTP methods and status codes appropriately.
- I learned how to model relational data using tables, primary keys, foreign keys, relationships, indexes, and SQL queries.
- I learned how components such as load balancers, caches, read replicas, queues, and workers can improve the scalability and reliability of a system.
- I learned how to estimate system capacity using expected users, reads, writes, and storage requirements.

## Git History

The project was developed through multiple meaningful commits covering the API client, API design, data model, architecture, styling, and README documentation.