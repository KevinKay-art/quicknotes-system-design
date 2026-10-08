# QuickNotes System Architecture

## 1. Functional Requirements

The QuickNotes system should allow users to:

- Create notes.
- View their notes.
- Update notes.
- Delete notes.
- Add and manage tags.
- Authenticate securely.
- Search and retrieve notes quickly.

## 2. Non-Functional Requirements

The system should provide:

- Good availability.
- Fast response times.
- Secure authentication and authorization.
- Reliable data storage.
- Scalability as the number of users grows.
- Monitoring and error handling.
- Backup and recovery capabilities.

## 3. Load Estimate for 1 Million Users

The following estimate uses simple planning assumptions:

- Total users: 1,000,000.
- Daily active users: 10% = 100,000 users.
- Each active user creates 1 note per day.
- Each active user performs about 50 note reads per day.
- One day has approximately 100,000 seconds.
- Peak traffic is estimated at 5 times the average traffic.
- Average stored note size, including metadata, is approximately 3 KB.

### Reads per Second

100,000 active users × 50 reads per day:

```text
100,000 × 50 = 5,000,000 reads/day