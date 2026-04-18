# GetHired

> A college placement analytics platform built for students and placement cells.

GetHired gives students visibility into placement trends at their institution and provides placement cell admins with a centralized panel to manage and publish placement data — including company visits, offer statistics, and student resources like blogs and guides.

---

## Features

### Student-Facing
- Placement analytics dashboard — company-wise, branch-wise, and year-wise stats
- Browse and read placement blogs and preparation guides
- Filter and explore historical placement data

### Admin Panel (Placement Cell)
- Manage placement records and company data
- Create, edit, and publish blogs
- Control over student-visible content

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Context API

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- REST API

**Monorepo Structure**
```
GetHired/
├── client/     # React frontend
├── server/     # Express backend
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (Atlas or local)

### Installation

```bash
# Clone the repo
git clone https://github.com/mukul-work/GetHired.git
cd GetHired

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the App

```bash
# From root — run both client and server (if concurrently is configured)
npm run dev

# Or separately:
cd server && npm run dev   # Backend on http://localhost:5000
cd client && npm run dev   # Frontend on http://localhost:5173
```

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── main.jsx

server/
├── routes/
├── controllers/
├── models/
├── middleware/
└── index.js
```

---

## Contributing

This project is being built as a team project for handoff to the college placement cell. If you're a contributor:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request against `main`

---

## License

MIT

---

Built by [Mukul](https://github.com/mukul-work) and contributors.
