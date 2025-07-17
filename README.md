# Time Management System

A simple and functional time tracking web application built with Vue 3 
and PrimeVue, designed for employee time recording.
This project simulates the essential features of a basic time 
management system and demonstrates modern full-stack development 
skills, including component-driven architecture, API integration, 
form handling and persistent data storage.

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

## Run project locally with Docker
1. Git clone using the github URL:
```
https://github.com/rahibbutt/time-management.git
```
2. Run project using docker-compose.yml
```
docker compose -f docker-compose.yml up -d 
```
Access the local server at: [http://localhost:5173](http://localhost:5173) &
Backend serving at: [http://localhost:4000](http://localhost:4000)
3. Shutdown docker containers using docker-compose
```
docker compose -f docker-compose.yml down
```
## Run project locally without Docker
1. Git clone using the web URL:
```
https://github.com/rahibbutt/pokepipeline-frontend.git
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

1. Similarly, install dependencies for backend
```
cd backend/
```
2. Install dependencies for backend
```
npm install
```
3. Run backend locally:
```
npm run dev
```
Backend serving at: [http://localhost:4000](http://localhost:4000)
