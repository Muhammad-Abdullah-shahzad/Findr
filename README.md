
# 🔍 Findr – Lost & Found Web Application

**Findr** is a full-stack Lost & Found platform that allows users to report, search, and recover lost items. It features a **React.js** frontend and a **Node.js** backend (using custom MVC architecture), with **JWT authentication** and **bcrypt** for secure password handling. The backend and **SQL Server** database are deployed on **Microsoft Azure**.

🔗 **Live Site:** [https://findr-web.netlify.app](https://findr-web.netlify.app)

---

## 📸 Preview

> *(Screenshots coming soon)*

---

## ✨ Features

| Category              | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| 📝 Item Reporting      | Post lost/found items with full details and images                         |
| 🔍 Smart Search        | Search and filter by category, location, or keywords                        |
| 🔐 Authentication      | JWT-based login with bcrypt-hashed passwords                               |
| 👤 User Dashboard      | Manage posted and claimed items                                             |
| 📥 Claim Request       | Users can send and manage claims to recover items                          |
| 🧱 MVC Architecture     | Organized backend folder structure for scalability                         |
| 📱 Responsive Design   | Optimized for mobile, tablet, and desktop devices                          |

---

## 🛠️ Tech Stack

| Layer          | Technologies Used                                           |
|----------------|-------------------------------------------------------------|
| Frontend       | React.js, HTML5, CSS3                                       |
| Backend        | Node.js (Custom MVC Architecture)                           |
| Authentication | JWT (JSON Web Token), bcrypt                                |
| Database       | SQL Server                                                  |
| Deployment     | Netlify (Frontend), Microsoft Azure (Backend & Database)    |

---

## 📂 Folder Structure

```bash
findr/
├── client/                   # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
├── server/                   # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── views/                # Optional (if using SSR)
│   ├── config/               # DB connection & env config
│   └── app.js
│
├── database/                 # SQL scripts or backups
├── .env                      # Environment variables
└── README.md


---

🚀 Getting Started

🧾 Prerequisites

Node.js and npm installed

SQL Server installed or available

Basic knowledge of React & Node.js (MVC)


🔧 Installation

1. Clone the repository:

git clone https://github.com/yourusername/findr.git
cd findr


2. Install frontend dependencies:

cd client
npm install


3. Install backend dependencies:

cd ../server
npm install


4. Setup environment variables:

Create a .env file inside server/ and add:

PORT=5000
DB_HOST=your_sql_server_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_secret_key


5. Run the app locally:

Start backend:

cd server
node app.js

Start frontend (in separate terminal):

cd client
npm start





---

🌐 Deployment

Component	Platform	URL

Frontend	Netlify	https://findr-web.netlify.app
Backend	Microsoft Azure	Hosted privately
Database	Microsoft Azure	SQL Server on Azure



---

📬 Contact

Muhammad Abdullah
📧 Email: shahzadabdullah814@gmail.com


---

📃 License

This project is open-source and free to use for educational or personal use.

---

