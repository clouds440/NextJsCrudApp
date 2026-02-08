# Environment Variables Configuration

## Summary of All Required Environment Variables

### Backend Environment Variables (.env)

#### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/crud_db?retryWrites=true&w=majority` | **REQUIRED** - Get from MongoDB Atlas |
| `PORT` | Server port | `5000` | Optional, defaults to 5000 |
| `NODE_ENV` | Environment mode | `development` or `production` | Optional, defaults to development |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:3000` | Optional, defaults to http://localhost:3000 |

### Frontend Environment Variables (.env.local)

#### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` | Optional, defaults to http://localhost:5000/api |

---

## Getting MongoDB Connection String

### Step 1: MongoDB Atlas Account
- Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up or log in

### Step 2: Create Cluster
- Click "Create Deployment"
- Choose "Shared" (free tier)
- Select your region
- Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Authentication Method: Password
3. Username: `crud_user` (or any username)
4. Password: Create a strong password (remember it!)
5. Click "Add User"

### Step 4: Add IP to Whitelist
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere"
4. For production: Add your server IP address
5. Confirm

### Step 5: Get Connection String
1. Go to "Databases"
2. Click "Connect" button
3. Click "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `crud_db` with your database name

### Example Connection String
```
mongodb+srv://crud_user:MySecurePassword123@cluster0.mongodb.net/crud_db?retryWrites=true&w=majority
```

---

## Backend .env File Setup

### Step 1: Create .env File

Navigate to the `backend` folder and create a `.env` file:

```bash
cd backend
echo. > .env  # On Windows
# or
touch .env   # On macOS/Linux
```

### Step 2: Add Variables

Copy and paste the following content and fill in your actual values:

```env
# Required: MongoDB connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://crud_user:YourPasswordHere@cluster0.mongodb.net/crud_db?retryWrites=true&w=majority

# Optional: Server port (default: 5000)
PORT=5000

# Optional: Environment (development or production)
NODE_ENV=development

# Optional: Frontend URL for CORS (default: http://localhost:3000)
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Fill in Your Values

Replace the following:
1. **MONGODB_URI**: Your actual MongoDB connection string from Atlas
2. **Port**: If you want to use a different port
3. **NODE_ENV**: Set to "production" for deployment
4. **CORS_ORIGIN**: Your frontend URL (important for security)

### Example .env File

```env
MONGODB_URI=mongodb+srv://crud_user:MyPassword123@cluster0.qh1j7.mongodb.net/crud_db?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## Frontend .env.local File Setup

### Step 1: Create .env.local File

Navigate to the `crud` folder and create/edit `.env.local`:

```bash
cd crud
echo. > .env.local  # On Windows
# or
touch .env.local   # On macOS/Linux
```

### Step 2: Add Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Development Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Production Environment (Example)

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

---

## Special Characters in MongoDB Password

If your MongoDB password contains special characters, you need to URL encode them:

| Character | Encoded |
|-----------|---------|
| @ | %40 |
| : | %3A |
| / | %2F |
| # | %23 |
| ? | %3F |
| ! | %21 |
| & | %26 |

### Example:
Password: `MyPass@word#123`
Encoded: `MyPass%40word%23123`

Connection String:
```
mongodb+srv://crud_user:MyPass%40word%23123@cluster0.mongodb.net/crud_db?retryWrites=true&w=majority
```

---

## Verification

### Backend Verification

1. Start backend:
```bash
cd backend
npm run dev
```

2. Check MongoDB connection message:
```
MongoDB connected successfully
Server is running on port 5000
API available at http://localhost:5000/api
```

3. Test health endpoint:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

### Frontend Verification

1. Start frontend:
```bash
cd crud
npm run dev
```

2. Check console for any errors
3. Open http://localhost:3000
4. Try creating a user to verify API connection

---

## Common Issues & Solutions

### Issue: "MONGODB_URI is not set"
**Solution**: Ensure MONGODB_URI is in your .env file and MongoDB is running

### Issue: "connect ECONNREFUSED"
**Solution**: 
- Verify MongoDB URI is correct
- Check your IP is whitelisted in MongoDB Atlas
- Ensure database user exists

### Issue: "CORS error"
**Solution**:
- Verify CORS_ORIGIN matches your frontend URL
- Check frontend NEXT_PUBLIC_API_URL matches backend address
- Restart backend after changing .env

### Issue: "Cannot reach backend from frontend"
**Solution**:
- Verify backend is running (check port 5000)
- Check NEXT_PUBLIC_API_URL is correct
- Ensure both URLs are accessible

---

## Security Best Practices

1. **Never commit .env files** to git
   - Add to .gitignore (already done)

2. **Use strong passwords** for MongoDB
   - Minimum 12 characters
   - Mix uppercase, lowercase, numbers, special characters

3. **Restrict IP whitelist** in production
   - Add only your server IP
   - Don't use "Allow Access from Anywhere" in production

4. **Rotate passwords** regularly
   - Change MongoDB user password periodically
   - Update .env accordingly

5. **Use environment-specific variables**
   - Development: localhost URLs
   - Production: your domain URLs

---

## Deployment Checklist

### Before Deploying Backend

- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to your frontend URL
- [ ] Verify MONGODB_URI is accessible from server
- [ ] Test API endpoints from your server
- [ ] Set up error logging
- [ ] Configure database backups

### Before Deploying Frontend

- [ ] Update NEXT_PUBLIC_API_URL to your backend URL
- [ ] Run `npm run build` and verify no errors
- [ ] Test all features with production backend
- [ ] Verify CORS configuration
- [ ] Clear browser cache before testing

---

## Variable Reference

### MONGODB_URI Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

### PORT
- Development: 5000
- Production: 80 or 443 (via reverse proxy)

### NODE_ENV Values
- `development`: Detailed logs, hot reload
- `production`: Optimized, minimal logs

### CORS_ORIGIN Format
- Local: `http://localhost:3000`
- Remote: `https://yourdomain.com`
- Multiple: Configure in code as array

### NEXT_PUBLIC_API_URL Format
- Local: `http://localhost:5000/api`
- Remote: `https://api.yourdomain.com/api`

---

## Quick Reference for Copy-Paste

### Backend .env Template
```env
MONGODB_URI=
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend .env.local Template
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

**All environment variables are now documented!** 🎉

Fill in your actual values and your application will be ready to run.
