

# 🔍 Findr – Lost & Found Web Application

**Findr** is a full-stack Lost & Found platform that allows users to report, search, and recover lost items. Built with **React.js** on the frontend and **Node.js (MVC architecture)** on the backend, with **JWT-based authentication** and **bcrypt** for secure password hashing. The backend and SQL Server database are deployed on **Microsoft Azure**.

🔗 **Live Site:** [https://findr-web.netlify.app](https://findr-web.netlify.app)

---

## 🛠️ Tech Stack

| Layer         | Technology                                   |
|---------------|----------------------------------------------|
| Frontend      | React.js, HTML5, CSS3                        |
| Backend       | Node.js (Custom MVC Architecture)           |
| Authentication| JWT (JSON Web Token), bcrypt                |
| Database      | SQL Server                                   |
| Deployment    | Frontend: Netlify<br>Backend + DB: Microsoft Azure |

---

## ✨ Key Features

| Feature                   | Description                                                              |
|---------------------------|--------------------------------------------------------------------------|
| 📝 Post Lost/Found Items   | Users can report lost or found items with details and image              |
| 🔍 Search Functionality    | Search and filter items by category, location, or keywords               |
| 🔐 Secure Login/Register   | JWT-based auth with bcrypt password hashing                              |
| 👤 User Dashboard          | Users can manage their posted and claimed items                          |
| 📥 Claim Item System       | Users can send claims with details to recover found items                |
| 🧱 Clean Code Structure     | Backend uses organized MVC architecture for maintainability              |
| 📱 Fully Responsive        | Optimized for mobile, tablet, and desktop views                          |

---

## 📂 Project Structure

findr/ ├── client/                  # React frontend │   ├── public/ │   └── src/ │       ├── components/ │       ├── pages/ │       ├── App.js │       └── index.js │ ├── server/                  # Node.js backend │   ├── controllers/ │   ├── models/ │   ├── routes/ │   ├── views/               # Optional if using SSR │   ├── config/              # DB connection and environment │   └── app.js │ ├── database/                # SQL scripts or backups ├── .env └── README.md

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- SQL Server
- Basic knowledge of React and MVC

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/findr.git
   cd findr

2. Install Frontend Dependencies

cd client
npm install


3. Install Backend Dependencies

cd ../server
npm install


4. Configure Environment Variables

Create a .env file in server/:

PORT=5000
DB_HOST=your_sql_server_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_secret_key


5. Run the App

Start backend:

cd server
node app.js

Start frontend (in another terminal):

cd client
npm start





---

☁️ Deployment

Frontend: Deployed on Netlify
🔗 https://findr-web.netlify.app

Backend & Database: Hosted on Microsoft Azure



---

👨‍💻 Author

Muhammad Abdullah
📧 Email: shahzadabdullah814@gmail.com


---

📃 License

This project is open-source and free to use for educational or personal projects.

