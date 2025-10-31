# Bug Fixes Applied

## Issues Fixed

### 1. ✅ Backend Compilation Error
**Problem**: Backend wouldn't compile due to missing JWT methods
```
cannot find symbol: method extractEmail(java.lang.String)
cannot find symbol: method extractRole(java.lang.String)
```

**Solution**:
- Added `getRoleFromToken()` method to `JwtUtil.java`
- Updated `RestaurantApplicationController` to use correct method names:
  - `getEmailFromToken()` instead of `extractEmail()`
  - `getRoleFromToken()` instead of `extractRole()`

### 2. ✅ Frontend 404 Error
**Problem**: Frontend calling wrong port
```
Failed to load resource: the server responded with a status of 404 (Not Found)
api/applyRestaurant:1
```

**Solution**:
- Changed API_BASE_URL from `http://localhost:8080` to `http://localhost:8081` in:
  - `src/pages/ApplyRestaurant.tsx`
  - `src/pages/admin/Applications.tsx`

### 3. ✅ React DOM Nesting Warning
**Problem**: Invalid HTML structure
```
Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>
```

**Solution**:
- Moved status Badge from `DialogDescription` to `DialogTitle` in `admin/Applications.tsx`
- Changed DialogDescription to show submission date instead

### 4. ✅ Admin Authorization - Enhanced Debugging
**Problem**: 400 error when admin tries to approve/reject applications

**Solution**: Added comprehensive logging throughout the auth flow:
- Controller level: Request details, token presence
- Token validation: Email, role extraction, validation results
- Service level: Step-by-step approval process logging
- Made Authorization header `required=false` for better error messages

## How to Test

### 1. Start Backend (Already Running)
```bash
cd backend
mvn spring-boot:run
```
Backend should be running on port 8081

### 2. Test Restaurant Application Submission
1. Open browser: `http://localhost:5173/apply-restaurant`
2. Fill out the form:
   - Restaurant Name: "Test Restaurant"
   - Email: "test@restaurant.com"
   - Phone: "+1 555 123 4567"
   - Address: "123 Test Street"
   - Description: "A great restaurant serving delicious food..." (min 50 chars)
3. Click "Submit Application"
4. Should see success toast

### 3. Verify Database Entry
```sql
-- Check application was created
SELECT * FROM restaurant_applications;

-- You should see your new application with status = 'PENDING'
```

### 4. Test Admin Approval
1. Login as admin: `http://localhost:5173/admin/login`
   - Use your admin credentials
2. Navigate to "Applications" in the nav
3. Click "View Details" on the pending application
4. Click "Approve"
5. **Watch backend console for detailed logs**:
   ```
   === APPROVE APPLICATION REQUEST ===
   Application ID: 1
   Authorization header received: YES
   Extracted token: eyJhbGciOiJIUzI1Ni...
   Token validated - Email: admin@example.com, Role: ADMIN
   === APPROVING APPLICATION ===
   Application found: Test Restaurant
   Current status: PENDING
   Creating vendor user...
   Generated temporary password: Abc123XYZ!@#
   Vendor user created with ID: 5
   Creating restaurant entry...
   Restaurant created with ID: 10
   Updating application status...
   Application approved successfully
   ```

### 5. Verify Database Changes After Approval
```sql
-- Check application status changed
SELECT * FROM restaurant_applications WHERE id = 1;
-- status should be 'APPROVED', processed_at should have timestamp

-- Check vendor user created
SELECT * FROM users WHERE role = 'VENDOR';
-- Should see new user with email from application

-- Check restaurant created
SELECT r.*, u.email as owner_email 
FROM restaurants r 
LEFT JOIN users u ON r.owner_id = u.id;
-- Should see new restaurant linked to vendor user
```

## Debugging Tips

### If you still get 400 error on approve:

1. **Check browser console** for the exact error message
2. **Check backend logs** in the terminal running Spring Boot:
   - Look for "=== APPROVE APPLICATION REQUEST ===" 
   - See if token is received
   - Check what error appears

3. **Verify admin token is valid**:
   - Open browser DevTools → Application → Local Storage
   - Check that `token` exists
   - Try logging out and back in as admin to get fresh token

4. **Test with curl**:
```bash
# Get your admin token from localStorage
TOKEN="your-admin-token-here"

# Test approval
curl -X POST http://localhost:8081/api/admin/applications/1/approve \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

## Common Issues

### Token Expired
- Admin tokens expire after 24 hours (86400000 ms)
- Solution: Logout and login again

### Wrong Role
- Token must have role='ADMIN'
- Check with: `SELECT * FROM users WHERE email = 'your-admin-email';`
- Role should be 'ADMIN' not 'CUSTOMER'

### Database Connection
- Ensure MySQL is running
- Database 'tastetrack_db' exists
- Tables auto-created by JPA on startup

## Success Indicators

✅ Application submitted → Toast notification + redirect to home
✅ Admin sees pending applications → Table populated
✅ Approve clicked → Success toast + application disappears from pending
✅ Database shows:
  - Application status = APPROVED
  - New user with role = VENDOR
  - New restaurant with owner_id pointing to vendor

## Next Steps

Once everything works:
1. Remove excessive console.log/System.out.println statements
2. Add email notification feature
3. Add vendor dashboard for approved restaurants
4. Add application status tracking page for applicants
