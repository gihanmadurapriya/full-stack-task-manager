# 📋 Full-Stack Task Manager Application

A clean, beginner-friendly full-stack application designed to demonstrate the core fundamentals of web development using **React**, **Node.js/Express**, and **MySQL**.

This project provides a complete end-to-end implementation of CRUD (Create, Read, Update, Delete) operations, illustrating how data flows through every layer of a modern web architecture:

$$\text{React UI} \longleftrightarrow \text{REST API (HTTP/JSON)} \longleftrightarrow \text{Express Backend} \longleftrightarrow \text{MySQL Database}$$

---

## 1. What the Project Does

The Task Manager allows users to organize their daily tasks through an intuitive, responsive interface:

- **View Tasks**: Lists all tasks stored in MySQL, ordered with newest first.
- **Add New Task**: Create tasks with a title and optional description.
- **Edit Task**: Modify title and description inline without page reloads.
- **Toggle Completion**: Mark tasks as completed or active with a single checkbox click.
- **Filter Tasks**: Switch between **All**, **Active**, and **Completed** views with live count badges.
- **Delete Task**: Permanently remove tasks from the MySQL database with confirmation.
- **Real-Time Feedback**: Visual alerts for success states and helpful error messages when the backend or database is unreachable.

---

## 2. Technologies Used

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [React 19](https://react.dev/) + [Vite](https://vite.dev/) | High-performance user interface, component-driven state management |
| **Backend** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | RESTful API server, routing, request validation, CORS middleware |
| **Database** | [MySQL](https://www.mysql.com/) / MariaDB | Relational database storage, schema management, and SQL queries |
| **Database Driver** | [`mysql2/promise`](https://www.npmjs.com/package/mysql2) | Secure parameterized queries (SQL injection prevention) & connection pooling |
| **Environment** | [`dotenv`](https://www.npmjs.com/package/dotenv) | Secure configuration for database credentials and server ports |
| **Language** | JavaScript (ES6+ / CommonJS) | Standard JavaScript across the entire stack |

---

## 3. Project Structure

```text
task-manager/
├── frontend/
│   ├── index.html                # Vite HTML entry point
│   ├── vite.config.js            # Vite configuration with API proxy
│   ├── package.json              # Frontend dependencies and scripts
│   └── src/
│       ├── main.jsx              # React DOM mounting
│       ├── App.jsx               # Main application container & state logic
│       ├── index.css             # Responsive styling and CSS variables
│       ├── components/
│       │   ├── TaskForm.jsx      # Form to input and submit new tasks
│       │   ├── TaskFilter.jsx    # Filter tabs (All, Active, Completed)
│       │   ├── TaskList.jsx      # Task collection renderer & empty states
│       │   └── TaskItem.jsx      # Individual task card (view/edit/delete/toggle)
│       └── services/
│           └── api.js            # Centralized API service layer (fetch calls)
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool & connection test
│   ├── controllers/
│   │   └── taskController.js     # Business logic, query execution & validation
│   ├── routes/
│   │   └── taskRoutes.js         # REST route definitions
│   ├── .env                      # Environment variables (DB credentials)
│   ├── .env.example              # Template for environment configuration
│   ├── server.js                 # Express server bootstrap & middleware
│   └── package.json              # Backend dependencies and scripts
│
├── database/
│   └── schema.sql                # SQL script to create DB, table & seed data
│
└── README.md                     # Documentation and setup instructions
```

---

## 4. How to Configure MySQL

### Step 1: Start MySQL Server
Ensure your MySQL server is running (e.g., via XAMPP Control Panel, MySQL Workbench, or system service).

### Step 2: Initialize Database and Table
Open your terminal or MySQL command line and run the script located at `database/schema.sql`:

```bash
# Using MySQL CLI
mysql -u root -p < database/schema.sql
```

*Or via XAMPP MySQL (if no password is set for root):*
```powershell
Get-Content "database\schema.sql" | & "C:\xampp\mysql\bin\mysql.exe" -u root
```

*Or in phpMyAdmin / MySQL Workbench:*
1. Open the SQL query tab.
2. Paste the contents of `database/schema.sql`.
3. Click **Execute / Go**.

The script will:
1. Create a database named `task_manager`.
2. Create the `tasks` table with columns:
   - `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
   - `title` (VARCHAR(255), NOT NULL)
   - `description` (TEXT)
   - `completed` (BOOLEAN / TINYINT(1), DEFAULT FALSE)
   - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
3. Populate 4 sample starter tasks for demonstration.

### Step 3: Configure Environment Variables
Inside the `backend/` directory, verify or create the `.env` file (copied from `.env.example`):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=task_manager
DB_PORT=3306
```

> **Security Note:** Never commit sensitive passwords to version control. Keep `.env` listed in `.gitignore`.

---

## 5. How to Start the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   # Production start
   npm start

   # Or development mode (with auto-restart)
   npm run dev
   ```

4. The server will run at:
   ```text
   http://localhost:5000
   ```
   You will see the console confirmation:
   ```text
   ===============================================
    Task Manager Backend running on http://localhost:5000
   ===============================================
   ✓ Successfully connected to MySQL database: task_manager
   ```

---

## 6. How to Start the Frontend

1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 7. REST API Endpoints

All task endpoints are prefixed with `/api/tasks`.

| Method | Endpoint | Description | Request Body | Success Response | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Retrieve all tasks | *None* | Array of task objects | `200 OK` |
| `GET` | `/api/tasks/:id` | Retrieve a single task by ID | *None* | Single task object | `200 OK` / `404` |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "string", "description": "string" }` | Created task object with generated `id` & `created_at` | `201 Created` / `400` |
| `PUT` | `/api/tasks/:id` | Update an existing task | `{ "title"?: "string", "description"?: "string", "completed"?: boolean }` | Updated task object | `200 OK` / `400` / `404` |
| `DELETE` | `/api/tasks/:id` | Delete a task | *None* | `{ "message": "Task deleted successfully.", "id": 1 }` | `200 OK` / `404` |

### Sample Request & Response (POST `/api/tasks`)

**Request:**
```http
POST /api/tasks HTTP/1.1
Content-Type: application/json

{
  "title": "Complete full-stack tutorial",
  "description": "Understand communication between React, Express, and MySQL"
}
```

**Response (`201 Created`):**
```json
{
  "id": 5,
  "title": "Complete full-stack tutorial",
  "description": "Understand communication between React, Express, and MySQL",
  "completed": false,
  "created_at": "2026-10-08T05:50:00.000Z"
}
```

---

## 8. How the Architecture Communicates

The application demonstrates the complete full-stack request-response cycle:

```
[ User Interaction ]
        │ (e.g. Clicks "Add Task" button)
        ▼
[ React Component (TaskForm.jsx) ]
        │ Reads state { title, description }
        ▼
[ API Client Service (src/services/api.js) ]
        │ Executes HTTP POST request using fetch()
        ▼
[ HTTP Request (JSON Body) ]
        │ Network call over localhost (Port 5000)
        ▼
[ Express Server (server.js) ]
        │ Applies middleware: cors(), express.json()
        ▼
[ Express Router (routes/taskRoutes.js) ]
        │ Matches POST /api/tasks
        ▼
[ Controller (controllers/taskController.js) ]
        │ 1. Validates request (checks title is non-empty)
        │ 2. Prepares parameterized SQL query
        ▼
[ MySQL Pool (config/db.js) ]
        │ Executes: INSERT INTO tasks (title, description, completed) VALUES (?, ?, false)
        ▼
[ MySQL Database Engine ]
        │ Stores record in `task_manager.tasks` table
        │ Returns auto-incremented insertId
        ▲
[ Controller (taskController.js) ]
        │ Fetches newly created row (SELECT * FROM tasks WHERE id = ?)
        │ Returns res.status(201).json(newTask)
        ▲
[ HTTP Response (Status 201 Created) ]
        │ Sends JSON representation back to client
        ▲
[ React State Update (App.jsx) ]
        │ Prepends newTask to `tasks` state: setTasks([newTask, ...prev])
        ▲
[ UI Re-render (TaskList.jsx & TaskItem.jsx) ]
        │ React dynamically renders the new task card on screen
```

### Key Architectural Concepts Demonstrated:
1. **Separation of Concerns**: UI rendering is isolated in React components, HTTP network logic is abstracted into `services/api.js`, route definitions belong in `routes/`, business logic and SQL execution live in `controllers/`, and connection management is centralized in `config/db.js`.
2. **Security & Parameterized Queries**: The backend uses parameterized placeholders (`?`) via `mysql2` rather than string concatenation, protecting the database against SQL Injection attacks.
3. **Environment Security**: Sensitive information (passwords, hosts, ports) is stored in `.env` and accessed through `process.env`.
4. **Resilient Error Handling**: Invalid requests produce standard HTTP error codes (`400 Bad Request`, `404 Not Found`, `500 Internal Server Error`) accompanied by informative JSON error messages that the React UI surfaces gracefully.
