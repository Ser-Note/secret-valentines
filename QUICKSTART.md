# Quick Start Guide 🚀

## Get Your Secret Valentines App Running in 5 Minutes!

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env` file in the root directory:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SESSION_SECRET=your-random-secret-here
```

### Step 3: Run Database Migration
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left menu
3. Copy and paste the contents of `database/migration.sql`
4. Click "Run" to execute the SQL

### Step 4: Start the Server
```bash
npm start
```

### Step 5: Login
1. Open http://localhost:3000
2. Login with default admin credentials:
   - **Username**: Admin
   - **Password**: admin123
3. **IMPORTANT**: Change this password immediately in the Profile page!

---

## What's Next?

### For Testing:
1. Create a few test users via the register page
2. As admin, authenticate them in the Admin Panel
3. Have users add gifts to their wishlists
4. Click "Assign Secret Valentines" in Admin Panel
5. Check the Secret Valentine page (will show countdown until Feb 1st)

### Common Issues:

**Can't connect to database?**
- Double-check your SUPABASE_URL and SUPABASE_ANON_KEY in `.env`
- Make sure the database migration ran successfully

**Session errors?**
- Ensure SESSION_SECRET is set in `.env`
- Clear your browser cookies and try again

**Login not working?**
- Verify the admin user was created in the database
- Check the console for error messages

---

## Database Table Overview

### `user` table
- Stores user accounts
- Fields: id, user_name, password, isAuthenticated, isAdmin

### `gifts` table
- Stores user wishlists
- Each user can have up to 5 gifts
- Price constraints enforced for first 3 gifts

### `secret_valentines` table
- Stores the random assignments
- Links from_user_id to to_user_id
- One assignment per user

---

## Key Features to Test

✅ User registration (requires admin approval)
✅ Gift wishlist (max 5, with price rules)
✅ Random valentine assignment (admin only)
✅ Date-based reveal (Feb 1st)
✅ Profile management (change name/password)
✅ Admin panel (full user management)

---

## Need Help?

Check the full README.md for detailed documentation!
