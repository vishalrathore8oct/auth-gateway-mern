# MERN Authentication System

A full-featured authentication system built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). This project offers secure user authentication, seamless Google OAuth integration, and a modern, responsive user interface. Designed for performance and security, it serves as a comprehensive solution for managing user access in web applications.

----

## 🚀 Features

### 🔐 Authentication
- **JWT Authentication** – Secure access to protected routes with JSON Web Tokens.
- **Google OAuth Login** – Easily sign in using Google accounts.
- **Password Recovery** – Forgot/reset password flows via email.
- **Encrypted Passwords** – Passwords are hashed securely using `bcryptjs`.

### 🌐 Frontend Features
- **State Management with Redux Toolkit** – 
  - Centralized state management for seamless global access to user data.
  - Persistent storage using `redux-persist` ensures user sessions are maintained even after a page refresh.
  - Efficient reducers and actions for handling authentication, user updates, and account deletion.
- **Image Upload with ImageKit** – 
  - Profile picture uploads are handled via ImageKit or Cloudinary for optimized image storage and delivery.
  - Real-time progress tracking during uploads with error handling for failed uploads.
- **Responsive Design** – Built with React and styled using Tailwind CSS for a modern and mobile-friendly user interface.
- **Private Routes** – Protected routes implemented using React Router and Redux to restrict access to authenticated users only.
- **Reusable Components** – Modular and reusable components like `Navbar`, `OAuth`, and `PrivateRoute` for better code organization.

### 📸 Profile Management
- **Profile Picture Upload** – Users can upload and update their profile pictures with real-time previews.
- **Account Management** – Users can update their account details (username, email, password) or delete their account entirely.

### ⚡ Performance
- **Vite for Development** – Lightning-fast development server with hot module replacement (HMR).
- **Optimized Builds** – Efficient production builds with Vite for faster load times.

---

## Folder Structure
```
.
├── client/                        # Frontend (React)
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── firebase/              # Firebase OAuth config
│   │   ├── pages/                 # Page views (e.g., Login, Home)
│   │   ├── redux/                 # State management with Redux
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # React entry point
│   ├── index.html                 # Template HTML
│   ├── tailwind.config.js         # Tailwind config
│   ├── vite.config.js             # Vite config
│   └── package.json               # Frontend dependencies
│
├── server/                        # Backend (Node.js)
│   ├── controllers/               # Route controllers
│   ├── middlewares/               # Express middleware
│   ├── models/                    # MongoDB models
│   ├── routes/                    # API routes
│   ├── utils/                     # Utility functions
│   ├── main.js                    # Server entry point
│   └── package.json               # Backend dependencies
│
├── .env                           # Environment variables
└── README.md                      # Project documentation

```


## 🛠 Installation

### 📦 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Firebase Project (for Google OAuth)

---

### ⚙️ Environment Variables

Create a `.env` file inside the **`server/`** directory with:

```env
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=3000
VITE_FIREBASE_API_KEY=<your-firebase-api-key>

```
## 🛠️ Installation & Setup

```bash
git clone https://github.com/vishalrathore8oct/MERN-AuthDashboard.git

cd client
npm install

cd ../server
npm install

# In server/
npm run dev

# In client/
npm run dev

The frontend will be available at:
🌐 http://localhost:5173
```

## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)
- `POST /api/auth/sign-in` – Register a new user  
- `POST /api/auth/log-in` – Log in an existing user  
- `POST /api/auth/google` – Google OAuth login  
- `POST /api/auth/log-out` – Log out an existing user  

### 👤 User Routes (`/api/user`)
- `POST /api/user/update/:id` – Update user profile (protected route)
- `DELETE /api/user/delete/:id` – Delete user profile (protected route)

## 🧰 Technologies Used

### Frontend
- React
- Tailwind CSS
- Firebase (OAuth)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication

---

## License
This project is licensed under the **MIT License**.

## Author
Developed by **Vishal Rathore**
- GitHub: [@vishalrathore8oct](https://github.com/vishalrathore8oct)
- LinkedIn: [Vishal Rathore](https://linkedin.com/in/vishalrathore8oct)

---


