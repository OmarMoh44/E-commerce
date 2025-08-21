# E-commerce Platform

## A full-stack e-commerce platform built with React 19, TypeScript, GraphQL, Apollo Server, and Node.js with PostgreSQL database.

![Home Page](imgs/Home%20page.png)
*Modern and responsive home page*

![Products Pages](imgs/Products%20pages.png)  
*Browse products with advanced search and filtering*

![GraphQL Queries](imgs/GraphQL%20queries.png)
*GraphQL queries for efficient data fetching*

![GraphQL Mutations](imgs/GraphQL%20mutations.png)
*GraphQL mutations for data manipulation*

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with cookie storage
- **Role-based Access Control**: Buyer, Seller, and Admin roles with different permissions
- **Product Management**: Complete CRUD operations for products with category management
- **Shopping Cart**: Dynamic cart with add/remove items functionality
- **Wishlist**: Save products for later purchase with easy management
- **Order Management**: Full order lifecycle from creation to tracking
- **Review System**: Product reviews and ratings
- **Address Management**: Multiple shipping addresses per user
- **Category Management**: Hierarchical product categorization
- **Advanced Search**: Product search with suggestions
- **GraphQL API**: Efficient data fetching with Apollo Server
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

### Frontend

- React 19
- TypeScript
- Apollo Client (GraphQL)
- React Router DOM
- Tailwind CSS
- Headless UI
- Heroicons React

### Backend

- Node.js with Express
- Apollo Server v4 (GraphQL)
- Prisma ORM with PostgreSQL
- JWT Authentication with cookies
- TypeScript
- Session management
- CORS enabled
- Input validation with Joi

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd e-commerce
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
copy env.example .env

# Create .env with your configuration

# Run Prisma migrations
npm run migrate:dev

# Seed the database (optional)
npm run seed

# Start development server
npm run start:dev
```

The GraphQL playground will be available at `http://localhost:4000/graphql`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```text
e-commerce/
├── backend/
│   ├── src/
│   │   ├── controllers/     # GraphQL resolvers
│   │   │   ├── admin/      # Admin-specific controllers
│   │   │   ├── buyer/      # Buyer-specific controllers  
│   │   │   ├── seller/     # Seller-specific controllers
│   │   │   └── user/       # User management controllers
│   │   ├── middlewares/     # Authentication & authorization
│   │   ├── prisma/          # Database schema & migrations
│   │   │   ├── schema/     # Prisma schema files
│   │   │   └── migrations/ # Database migrations
│   │   ├── schema/          # GraphQL schema definitions
│   │   ├── services/        # Business logic services
│   │   ├── types/          # TypeScript type definitions
│   │   └── validators/      # Input validation schemas
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── graphql/         # GraphQL queries & mutations
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── imgs/                    # Application screenshots
└── README.md
```

## 🖼️ Application Screenshots

![Profile Page](imgs/Profile%20page.png)
*User profile management with order history*

![Wishlist Page](imgs/Wishlist%20page.png)  
*Save products for later with wishlist functionality*

## 🚀 Deployment

### Backend Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npm run migrate:deploy`
4. Build the project: `npm run build`
5. Start the server: `npm start`

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting platform

## 🛠️ Available Scripts

### Backend Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run migrate:dev` - Run database migrations in development
- `npm run migrate:deploy` - Run database migrations in production
- `npm run seed` - Seed database with sample data
- `npm run studio:dev` - Open Prisma Studio
- `npm run reset:dev` - Reset database and run all migrations
- `npm test` - Run tests

### Frontend Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
