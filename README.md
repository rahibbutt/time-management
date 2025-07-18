# Time Management System

A simple and functional time tracking web application built with Vue 3 and PrimeVue, designed for employee time recording. This project simulates the essential features of a basic time management system and demonstrates modern full-stack development skills, including component-driven architecture, API integration, form handling, and persistent data storage.

Additionally, the project incorporates Docker integration for consistent development and deployment for local environments, semantic versioning to manage releases and track changes clearly and automated CI/CD pipelines to ensure reliable testing, building, and deployment workflows essential for project lifecycle.

## Run project locally with Docker
1. Git clone using the Github URL:
```
https://github.com/rahibbutt/time-management.git
```
2. Run project using docker-compose.yml
```
docker compose -f docker-compose.yml up -d 
```
Frontend serving at: [http://localhost:5173](http://localhost:5173) &
Backend serving at: [http://localhost:4000](http://localhost:4000)

```
#User login 
username: rahib
password: rahib 

#Admin login 
username: admin
password: admin 
```

3. Shutdown docker containers using docker-compose
```
docker compose -f docker-compose.yml down
```
## Run project locally without Docker
1. Git clone using the web URL:
```
https://github.com/rahibbutt/time-management.git
```
2. From the root of the directory install dependencies for frontend
```
npm install
```
3. Build the project:
```
npm run build
```
4. Run project locally:
```
npm run dev
```
Frontend serving at: [http://localhost:5173](http://localhost:5173)

5. Similarly, switch to the backend directory
```
cd backend/
```
6. Install npm dependencies
```
npm install
```
7. Run backend locally:
```
npm run dev
```
Backend serving at: [http://localhost:4000](http://localhost:4000)

```
#User login 
username: rahib
password: rahib 

#Admin login 
username: admin
password: admin 
```

## 💻 Frontend

- **Framework:** Vue 3 with Composition API
- **UI Library:** PrimeVue
- **Styling:** Tailwind CSS
- **Routing:** Vue Router
- **State Management:** Pinia
- **UI Components:** PrimeVue-based forms, tables, dropdowns and charts
- **ESLint:** For code quality

## 🖥️ Backend

- **Runtime & Framework:** Node.js + Express
- **Database:** SQLite3
- **API:** RESTful endpoints for auth, users, customers, projects and time blocks
- **Authentication:** JWT-based user sessions
- **HTTP Client:** Axios (used on frontend to communicate with backend)

## ⚙️ DevOps & Tooling
- Containerization: Docker integration for easy and simple environment setup
- Versioning: Semantic Versioning for consistent release management
- Continuous Integration / Continuous Deployment (CI/CD): Automated pipelines to test, build, and deploy the app for development

## 🚀 Features

### 1. User Authentication
- JWT-based login and registration system
- Role-based access (admin vs. employee)

### 2. Clock In / Clock Out
- Button to start and stop working time
- Time periods are saved to the database
- Multiple time blocks possible per day

### 3. Customer Management
- Create, edit and delete customers
- Customer fields: name, email, phone

### 4. Project Management
- Projects are assigned to specific customers
- Fields: project name, description and customer associated

### 5. Task Entries
After clocking in, users can optionally select or describe a task, 
assign the task to a project. This information is saved with the time block

### 6. Daily Working Time Overview
- Visualization of tracked time per day
- Table and bar chart views (via PrimeVue Chart)
