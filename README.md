# EduLearn - EdTech Platform 🎓

A full-stack EdTech platform built with React (Vite) frontend and Node.js/Express backend, featuring user authentication, profile management, and course browsing.

---

## 🚀 Features

- **Home Page**: A landing page showcasing the platform and popular courses.
- **Course Listing Page**: Displays a list of available courses with an "Enroll" button.
- **Course Details Page**: Provides detailed information about a selected course.
- **Course Purchase Page**: Allows users to complete the purchase of a course (authentication required).
- **Authentication Pages**: User signup & login (JWT authentication).
- **Responsive Design**: Fully responsive UI using Tailwind CSS and daisyUI.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Deployment:** Vercel

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/EduLearn-EdTech_Project.git
cd EduLearn-EdTech_Project
```

### 2. Setup Backend

```sh
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

#### Run Locally

```sh
npm start
```

### 3. Setup Frontend

```sh
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:5000
```

> For production, set `VITE_API_URL` to your deployed backend URL.

#### Run Locally

```sh
npm run dev
```

---

## Deployment

### Deploy on Vercel

- Deploy both `frontend/` and `backend/` as separate projects on Vercel.
- Set environment variables in the Vercel dashboard for each project.
- For the frontend, set `VITE_API_URL` to your deployed backend URL.
- For the backend, set `MONGO_URI` and `JWT_SECRET`.

---

## Folder Structure

```
EduLearn-EdTech_Project/
│
├── backend/
│   ├── index.js
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── data/
    └── .env
```

---

## Environment Variables

### Backend

- `MONGO_URI` – Your MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing
- `PORT` – (optional) Port to run the backend

### Frontend

- `VITE_API_URL` – URL of your backend API

---

## License

This project is licensed under the MIT License.

---

## Credits

- [Unsplash](https://unsplash.com/) for demo images
- [Vercel](https://vercel.com/) for hosting

---

🌐 Live Demo: https://edulearn-rm.vercel.app/

---

## 📫 Contact

For any questions or discussions, feel free to reach out on:
- X (formerly Twitter) : [@MdRizwanMolla](https://x.com/MdRizwanMolla)
- LinkedIn: [@rizwan-molla](https://www.linkedin.com/in/rizwan-molla/)


**Happy Learning!**

---