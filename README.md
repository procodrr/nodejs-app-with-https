# E-Commerce Application

A simple e-commerce application built with Node.js and Express, featuring a dark mode UI with blue accents.

## Features

- 🛍️ Product catalog with filtering by category
- 👥 User management endpoint
- 🎨 Beautiful dark mode UI with Tailwind CSS
- 📱 Responsive design
- 🚀 RESTful API endpoints

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Module System**: ES6 Modules
- **Data**: JSON files (mock data)

## Project Structure

```
demo-node-app/
├── app.js                 # Main Express server
├── controllers/           # Controller files
│   ├── productController.js
│   └── userController.js
├── routes/                # Route files
│   ├── productRoutes.js
│   └── userRoutes.js
├── data/                  # Mock data files
│   ├── products.json
│   └── users.json
└── public/                # Static files
    ├── index.html
    └── script.js
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Browse products using the category filters
3. Click "Load Users" to view all registered users
4. Use the "Add to Cart" button on products (currently shows an alert)

## Notes

- All API routes are prefixed with `/api`
- Products are stored in `data/products.json`
- Users are stored in `data/users.json`
- The UI uses Tailwind CSS via CDN with a dark theme and blue color scheme
