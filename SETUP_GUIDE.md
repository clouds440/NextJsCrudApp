# CRUD Application Setup Guide

## Complete Step-by-Step Setup Instructions

### Step 1: MongoDB Atlas Setup

1. **Create MongoDB Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up or log in

2. **Create a Free Cluster**
   - Click "Create" on your dashboard
   - Choose "Shared" (free tier)
   - Select your region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Set Username: e.g., `crud_user`
   - Set Password: Create a strong password
   - Click "Add User"

4. **Whitelist IP**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go back to "Databases"
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `crud_db` with your database name

   Example:
   ```
   mongodb+srv://crud_user:your_password@cluster.mongodb.net/crud_db?retryWrites=true&w=majority
   ```

### Step 2: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (if not already created)
   ```bash
   # On Windows
   echo. > .env
   ```

4. **Add environment variables to .env**
   ```env
   MONGODB_URI=mongodb+srv://crud_user:your_password@cluster.mongodb.net/crud_db?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Test backend connection**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   MongoDB connected successfully
   Server is running on port 5000
   API available at http://localhost:5000/api
   ```

6. **Test API health**
   - Open browser and go to: http://localhost:5000/api/health
   - You should see a success response

### Step 3: Frontend Setup

1. **Navigate to crud folder**
   ```bash
   cd ../crud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify .env.local exists**
   - File should contain:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```

4. **Start frontend**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ▲ Next.js 16.1.6
   - ready started server on 0.0.0.0:3000, url: http://localhost:3000
   ```

5. **Open application**
   - Open browser and go to: http://localhost:3000
   - You should see the User Management System interface

### Step 4: Test the Application

#### Create a User
1. Admins must log in before creating users:
   - Navigate to **Admin Login** (link appears in the header) and enter the credentials you created via the backend register endpoint.
   - After a successful login the "➕ Create User" tab becomes available.

1. Click on "➕ Create User" tab
2. Fill in all required fields:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Address: 123 Main St
   - City: New York
   - State: NY
   - Zip Code: 10001
   - Date of Birth: 1990-01-15
3. Click "Create User"
4. Should see success message

#### View Users
1. Click on "👥 All Users" tab
2. Should see the created user in the list
3. Test pagination buttons

#### Edit User
1. Click "Edit" button on any user
2. Update some fields
3. Click "Update User"
4. Should see success message

#### Delete User
1. Click "Delete" button on any user
2. Confirm deletion in modal
3. User should disappear from list (soft deleted)

#### Search Users
1. On "👥 All Users" tab
2. Use search box to search by name, email, or city
3. Or select "Search by City" and enter city name

#### View Dashboard
1. Click on "📊 Dashboard" tab
2. See statistics:
   - Total users count
   - Inactive users count
   - Users by city chart
   - Recent users list

### Environment Variables Required

#### Backend (.env)
```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crud_db?retryWrites=true&w=majority

# Server port
PORT=5000

# Environment
NODE_ENV=development

# CORS origin (frontend URL)
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### MongoDB Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

Replace:
- `USERNAME`: Your database user username
- `PASSWORD`: Your database user password (URL encode special characters)
- `CLUSTER`: Your cluster name (from MongoDB Atlas)
- `DATABASE_NAME`: Your database name (e.g., crud_db)

### Troubleshooting

#### MongoDB Connection Failed
- Check MONGODB_URI in .env
- Verify username and password are correct
- Check IP whitelist in MongoDB Atlas Network Access
- Ensure password doesn't have special characters (or URL encode them)

#### CORS Error
- Check CORS_ORIGIN in backend .env
- Verify frontend URL matches CORS_ORIGIN
- Ensure backend is running on correct port

#### Cannot connect from frontend
- Verify NEXT_PUBLIC_API_URL in frontend .env.local
- Check backend is running on port 5000
- Check network connectivity

#### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Running Both Simultaneously

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd crud
npm run dev
```

### Production Deployment

#### Backend
1. Set environment variables on hosting platform
2. Ensure NODE_ENV=production
3. Update CORS_ORIGIN to your frontend URL
4. Deploy to Heroku/Railway/Vercel/AWS

#### Frontend
1. Update NEXT_PUBLIC_API_URL to your backend URL
2. Build: `npm run build`
3. Deploy to Vercel/Netlify

### API Testing with Curl

```bash
# Get all users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "dateOfBirth": "1990-01-15"
  }'

# Get user by ID
curl http://localhost:5000/api/users/{USER_ID}

# Search users
curl http://localhost:5000/api/users/search?query=john

# Get statistics
curl http://localhost:5000/api/users/statistics/dashboard
```

### Next Steps

1. Add more features (authentication, file upload, etc.)
2. Deploy to production
3. Set up CI/CD pipeline
4. Add unit tests
5. Implement advanced filtering
6. Add email notifications
7. Create admin dashboard
8. Add data export functionality

---

**Setup Complete! 🎉**

Your CRUD application is now ready to use. Start creating, reading, updating, and deleting users!
