# User Management CRUD Application

A professional, full-stack CRUD application with React/Next.js frontend and Node.js/Express backend, featuring MongoDB database integration, comprehensive error handling, and TailwindCSS styling.

## 📋 Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ User listing with pagination
- ✅ Search functionality (by name, email, city)
- ✅ Filter by city
- ✅ Dashboard with statistics
- ✅ Comprehensive validation
- ✅ Error handling with proper HTTP status codes
- ✅ Professional TailwindCSS styling
- ✅ Soft delete functionality
- ✅ MongoDB integration
- ✅ RESTful API design
- ✅ Responsive design
- ✅ Admin authentication (login required for creating users)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder with the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crud_db?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# authentication (admin)
JWT_SECRET=your_jwt_secret_here
ADMIN_SECRET=a_registration_secret_used_for_initial_admin_creation
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to crud directory:
```bash
cd crud
```

2. Install dependencies:
```bash
npm install
```

3. The `.env.local` file is already configured for development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Only administrators are allowed to create new user records.  An admin must log in to receive a JSON Web Token which is then included on subsequent requests.

**Registering an admin**
You can create the first administrator by calling the register endpoint with the `ADMIN_SECRET` defined in your `.env` file. Example using curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"s3cr3t","secret":"<ADMIN_SECRET>"}'
```

After registration future admin accounts can also be created the same way (secret is required).

**Logging in**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "s3cr3t"
}
```

A successful response returns a token you should include in an `Authorization: Bearer <token>` header when creating a user.

---

### Response Format

All API responses follow this format:

**Success Response (2xx)**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

**Error Response (4xx, 5xx)**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": {
    "field": "Field error message"
  },
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

### Endpoints

#### Authentication

**Register Admin** (requires ADMIN_SECRET)
```http
POST /api/auth/register
```

**Login Admin**
```http
POST /api/auth/login
```

---

#### Get All Users
```http
GET /api/users?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 10)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `sortOrder` (optional): asc or desc (default: desc)

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 45,
      "usersPerPage": 10
    }
  },
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

#### Get User by ID
```http
GET /api/users/:id
```

**Status Codes:**
- `200 OK`: User found
- `404 Not Found`: User not found

#### Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "dateOfBirth": "1990-01-15"
}
```

**Status Codes:**
- `201 Created`: User created successfully
- `400 Bad Request`: Validation failed
- `409 Conflict`: Email already exists

#### Update User
```http
PUT /api/users/:id
```

**Request Body:** (All fields are optional)
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "dateOfBirth": "1992-05-20",
  "isActive": true
}
```

**Status Codes:**
- `200 OK`: User updated successfully
- `400 Bad Request`: Validation failed
- `404 Not Found`: User not found
- `409 Conflict`: Email already exists

#### Delete User (Soft Delete)
```http
DELETE /api/users/:id
```

**Status Codes:**
- `200 OK`: User deleted (marked as inactive)
- `404 Not Found`: User not found

#### Permanent Delete User
```http
DELETE /api/users/permanent/:id
```

**Status Codes:**
- `200 OK`: User permanently deleted
- `404 Not Found`: User not found

#### Search Users
```http
GET /api/users/search?query=john&page=1&limit=10
```

**Parameters:**
- `query` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Searches in:** firstName, lastName, email, city

#### Get Users by City
```http
GET /api/users/by-city?city=NewYork&page=1&limit=10
```

**Parameters:**
- `city` (required): City name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

#### Get Statistics
```http
GET /api/users/statistics/dashboard
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalUsers": 45,
    "totalInactiveUsers": 3,
    "usersByCity": [
      { "_id": "New York", "count": 15 },
      { "_id": "Los Angeles", "count": 12 }
    ],
    "recentUsers": [...]
  },
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

## ✅ Validation Rules

### User Fields

| Field | Validation |
|-------|-----------|
| firstName | Required, 2-50 characters |
| lastName | Required, 2-50 characters |
| email | Required, valid email format, unique |
| phone | Required, 10-15 digits |
| address | Required, minimum 5 characters |
| city | Required, minimum 2 characters |
| state | Required |
| zipCode | Required, 5-10 digits |
| dateOfBirth | Required, valid ISO8601 date |

## 🔐 Security Features

- Helmet.js for HTTP headers protection
- CORS configuration
- Input validation with express-validator
- MongoDB injection prevention
- Proper error handling without exposing sensitive data
- Soft delete functionality for data preservation
- Request body size limitation

## 📊 Error Codes

| Code | Status | Message |
|------|--------|---------|
| 200 | OK | Successful GET, PUT request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Validation error or malformed request |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email already exists |
| 500 | Internal Server Error | Server error |

## 🗄️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user (username and password)
4. Get the connection string
5. Replace in `.env`:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/crud_db?retryWrites=true&w=majority
   ```

## 🎨 Frontend Features

- **Dashboard**: View user statistics and recent users
- **User List**: Paginated list with edit/delete functionality
- **Create User**: Form with comprehensive validation
- **Edit User**: Update existing user information
- **Search**: Search by name, email, or city
- **Filter**: Filter users by city
- **Responsive Design**: Works on mobile, tablet, desktop

## 📁 Project Structure

```
CRUD/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── userRoutes.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── database.js
│   │   │   └── responseHandler.js
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
└── crud/
    ├── app/
    │   ├── api/
    │   │   └── client.ts
    │   ├── components/
    │   │   ├── Alert.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── UserForm.tsx
    │   │   ├── UserList.tsx
    │   │   └── SearchUsers.tsx
    │   ├── utils/
    │   │   └── useApi.ts
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── .env.local
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Vercel)

1. Set environment variables on your hosting platform
2. Ensure MongoDB URI is accessible from the hosting environment
3. Deploy the backend folder

### Frontend Deployment (Vercel, Netlify)

1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy the crud folder

## 📝 Environment Variables Summary

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string (required)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Frontend URL for CORS (default: http://localhost:3000)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:5000/api)

## 🤝 Contributing

Feel free to extend this application with additional features like:
- Authentication (JWT)
- Role-based access control
- Email verification
- Password reset
- File upload
- Advanced filtering
- Export to CSV/PDF

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips

- Use MongoDB Atlas for cloud database hosting
- Enable IP whitelist in MongoDB Atlas for security
- Use environment variables for sensitive data
- Test all endpoints with Postman/Insomnia before deployment
- Set up CI/CD pipelines for automated testing and deployment

---

**Happy Coding! 🚀**
