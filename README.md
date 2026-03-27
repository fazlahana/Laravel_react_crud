# React + Laravel Student Management System

This project is a full-stack student management application featuring:
- **Frontend**: React, Tailwind CSS, Axios, Lucide-React.
- **Backend**: Laravel 11, JWT (Tymon/JWTAuth), SQLite (for ease of setup).
- **Features**: JWT Login, Student CRUD, Responsive UI, Axios Interceptors.

## Project Structure
- `/backend`: Laravel application.
- `/frontend`: React application (Vite).

## Setup Instructions

### 1. Backend Setup (Laravel)
1. Open a terminal in the `backend` folder.
2. Ensure you have PHP and Composer installed.
3. Run `composer install` (already done if you are in the provided workspace).
4. Run the database setup:
   ```bash
   php artisan migrate --seed
   ```
   *Note: If prompted to run in production, type `yes`.*
5. A default user will be created:
   - **Email**: `test@example.com` (from DatabaseSeeder)
   - **Password**: `password` (default password for Laravel factories)
6. Start the backend server:
   ```bash
   php artisan serve
   ```

### 2. Frontend Setup (React)
1. Open a new terminal in the `frontend` folder.
2. Ensure you have Node.js and NPM installed.
3. Run `npm install` (already done if you are in the provided workspace).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## Usage
1. Go to the login page.
2. Enter the credentials (`test@example.com` / `password`).
3. You will be redirected to the Dashboard where you can create, view, update, and delete students.

## Note on Database
This project uses **SQLite** for the database to ensure immediate compatibility. If you want to use MySQL, update the `.env` file in the `backend` folder to use `DB_CONNECTION=mysql` and provide your MySQL credentials.
