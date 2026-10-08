# QuickNotes Data Model

## 1. Entities

QuickNotes uses four main entities:

### Users

Stores the people who own notes.

| Column | Type | Key | Description |
|---|---|---|---|
| user_id | INTEGER | PRIMARY KEY | Unique user ID |
| name | VARCHAR(100) | | User's name |
| email | VARCHAR(255) | UNIQUE | User's email |
| created_at | TIMESTAMP | | Account creation time |

### Notes

Stores notes created by users.

| Column | Type | Key | Description |
|---|---|---|---|
| note_id | INTEGER | PRIMARY KEY | Unique note ID |
| user_id | INTEGER | FOREIGN KEY | User who owns the note |
| title | VARCHAR(100) | | Note title |
| body | TEXT | | Note content |
| created_at | TIMESTAMP | | Creation time |
| updated_at | TIMESTAMP | | Last update time |

### Tags

Stores reusable labels that can be attached to notes.

| Column | Type | Key | Description |
|---|---|---|---|
| tag_id | INTEGER | PRIMARY KEY | Unique tag ID |
| name | VARCHAR(50) | UNIQUE | Tag name |

### Note_Tags

Connects notes to tags.

| Column | Type | Key | Description |
|---|---|---|---|
| note_id | INTEGER | PRIMARY KEY, FOREIGN KEY | Related note |
| tag_id | INTEGER | PRIMARY KEY, FOREIGN KEY | Related tag |

## 2. Relationships

- One user can create many notes. This is a **one-to-many** relationship between `users` and `notes`.
- A note can have many tags, and a tag can belong to many notes. This is a **many-to-many** relationship between `notes` and `tags`.
- The `note_tags` table resolves the many-to-many relationship.

## 3. SQL Table Definitions

```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    note_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tags (
    tag_id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(note_id),
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
);

## Example SQL Queries

### 1. Get all notes for a user

```sql
SELECT note_id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY created_at DESC;
```

### 2. Find notes containing a keyword

```sql
SELECT note_id, title, body
FROM notes
WHERE user_id = 1
  AND (title LIKE '%project%' OR body LIKE '%project%');
```

### 3. Get notes together with their tags

```sql
SELECT
    n.note_id,
    n.title,
    t.tag_id,
    t.name AS tag_name
FROM notes n
JOIN note_tags nt ON n.note_id = nt.note_id
JOIN tags t ON nt.tag_id = t.tag_id
WHERE n.user_id = 1
ORDER BY n.created_at DESC;
```

The third query uses JOINs to connect notes, the note_tags junction table, and tags.

## Indexing

An index should be created on the `notes.user_id` column because most note queries are performed for a specific authenticated user. The index helps the database find that user's notes faster without scanning the entire notes table.

```sql
CREATE INDEX idx_notes_user_id
ON notes(user_id);
```

An additional index can support searches by creation date:

```sql
CREATE INDEX idx_notes_user_created
ON notes(user_id, created_at);
```

## SQL vs NoSQL Decision

QuickNotes should use a SQL relational database such as PostgreSQL. The system has clear relationships between users, notes, tags, and the note_tags junction table. SQL provides foreign keys, constraints, transactions, and JOINs that help maintain data integrity. A relational database is therefore a good fit for the structured data and many-to-many relationships in QuickNotes. It can also scale through indexing, read replicas, caching, and other architectural techniques.