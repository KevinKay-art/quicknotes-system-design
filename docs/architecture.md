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
- One day has approximately 100,000 seconds for this simplified planning estimate.
- Peak traffic is estimated at 5 times the average traffic.
- Average stored note size, including metadata, is approximately 3 KB.

### Reads per Second

100,000 active users × 50 reads per day:

```text
100,000 × 50 = 5,000,000 reads/day
```

Using approximately 100,000 seconds per day:

```text
5,000,000 ÷ 100,000 = 50 reads/second
```

Peak reads:

```text
50 × 5 = 250 reads/second
```

### Writes per Second

100,000 active users × 1 note per day:

```text
100,000 × 1 = 100,000 writes/day
```

Average writes:

```text
100,000 ÷ 100,000 = 1 write/second
```

Peak writes:

```text
1 × 5 = 5 writes/second
```

### Storage per Year

100,000 new notes per day × 3 KB:

```text
100,000 × 3 KB = 300,000 KB/day
≈ 300 MB/day
```

Annual storage:

```text
300 MB × 365
≈ 109.5 GB/year
```

This is the estimated raw note storage before additional database indexes, backups, replicas, and operational overhead.

## 4. System Architecture

```text
                         ┌──────────────┐
                         │    Client    │
                         │ Browser/App  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │     DNS      │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │     CDN      │
                         └──────┬───────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Load Balancer   │
                       └───────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             ┌─────────────┐       ┌─────────────┐
             │ App Server 1│       │ App Server 2│
             └──────┬──────┘       └──────┬──────┘
                    │                     │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
          ┌─────────────┐             ┌──────────────┐
          │    Cache    │             │    Queue     │
          │   Redis     │             │              │
          └──────┬──────┘             └──────┬───────┘
                 │                           │
                 │                    ┌──────▼──────┐
                 │                    │    Worker   │
                 │                    └──────┬──────┘
                 │                           │
                 └──────────────┬────────────┘
                                ▼
                     ┌────────────────────┐
                     │  Primary Database  │
                     │    PostgreSQL      │
                     └─────────┬──────────┘
                               │
                               │ Replication
                               ▼
                     ┌────────────────────┐
                     │    Read Replica    │
                     │    PostgreSQL      │
                     └────────────────────┘
```

## 5. Component Responsibilities

### Client

The browser or mobile application provides the user interface and sends requests to the backend API.

### DNS

DNS translates the QuickNotes domain name into the appropriate network destination so users can reach the service.

### CDN

The CDN serves static assets such as HTML, CSS, JavaScript, and images from locations closer to users, reducing latency and load on the application servers.

### Load Balancer

The load balancer distributes incoming requests across multiple application servers and prevents one server from becoming a single point of failure.

### App Servers

Multiple application servers run the QuickNotes backend API. Having at least two servers allows the system to continue serving requests if one server fails.

### Cache

A cache such as Redis stores frequently requested data temporarily, reducing repeated database queries and improving response times.

### Primary Database

The primary PostgreSQL database stores authoritative application data and handles writes such as creating, updating, and deleting notes.

### Read Replica

The read replica receives replicated data from the primary database and handles read-heavy workloads, reducing pressure on the primary database.

### Queue

The queue holds background jobs so slow or non-critical operations do not block user requests.

### Worker

Workers process queued background jobs such as notifications, indexing, or other asynchronous tasks.

## 6. GET /notes Request Flow

1. The client sends `GET /notes`.
2. DNS resolves the QuickNotes domain.
3. The CDN handles any cacheable static content and forwards API traffic toward the backend.
4. The load balancer selects a healthy application server.
5. The application server authenticates and authorizes the user.
6. The application checks the cache for the requested notes.
7. If the data is cached, it is returned to the client.
8. If the data is not cached, the application reads the notes from the database read replica.
9. The result can be stored in the cache for future requests.
10. The application returns the notes to the client.

## 7. POST /notes Request Flow

1. The client sends `POST /notes` with the note data and authentication credentials.
2. DNS resolves the QuickNotes domain.
3. The load balancer forwards the request to a healthy application server.
4. The application authenticates the user and validates the note data.
5. The application writes the new note to the primary database.
6. The database confirms the successful transaction.
7. Any non-critical background work can be placed onto the queue.
8. A worker processes queued jobs asynchronously.
9. The application returns `201 Created` and the new note to the client.

## 8. Architecture Trade-Offs

### Performance vs Complexity

Using a CDN, cache, read replica, load balancer, queue, and multiple application servers improves performance and scalability, but increases infrastructure complexity and operational cost. For a service targeting one million users, the additional complexity is justified by the expected traffic and availability requirements.

### Consistency vs Read Performance

Using a read replica improves read performance and reduces load on the primary database. However, replication can introduce a small delay, meaning a recently written note might not immediately appear on a replica. Critical operations should therefore read from the primary when strong consistency is required.

### Synchronous vs Asynchronous Processing

Keeping slow background tasks in a queue improves API response times because users do not have to wait for those tasks. The trade-off is that queued work may be processed slightly later and requires monitoring and retry handling.

## 9. Avoiding Single Points of Failure

The architecture avoids single points of failure by using multiple application servers behind a load balancer. If one application server fails, traffic can be routed to another healthy server.

The database uses a primary database with a read replica to provide redundancy for read workloads and support recovery planning. The cache and queue should also be deployed using highly available configurations in production.

Health checks should continuously monitor application servers and automatically remove unhealthy instances from load-balancer rotation.

Regular database backups should be maintained so the system can recover from data loss or infrastructure failure.

## 10. Conclusion

The proposed QuickNotes architecture separates presentation, application processing, caching, asynchronous work, and persistent storage. This design provides a scalable foundation for supporting one million users while improving performance, availability, reliability, and maintainability.