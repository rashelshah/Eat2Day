# Troubleshooting Guide

## Current Issues Fixed

### 1. Hot Reload Error (transformedMenuItems)
**Error**: `SyntaxError: Identifier 'transformedMenuItems' has already been declared`

**Solution**: This is a Vite hot module reload issue. Simply refresh your browser (Ctrl+R or F5) to clear the error.

### 2. Orders Not Showing After Placement

**Fixed in Checkout.tsx**:
- Added proper validation for cart items
- Ensured `restaurantId` and `menuItemId` are converted to numbers
- Added console logging for debugging
- Improved error messages

**To verify the fix works**:
1. Refresh your browser to clear any hot reload errors
2. Add items to cart from a restaurant
3. Go to checkout and fill in all required fields
4. Place the order
5. Check browser console for logs:
   - "Placing order with restaurantId: X"
   - "Order data being sent: {...}"
   - "Order created successfully: {...}"
6. You should be redirected to /orders page after 1.5 seconds
7. Your order should appear in the "Active Orders" tab

## Common Issues and Solutions

### Backend Not Starting (Port 8081 in use)

**Error**: `Port 8081 was already in use`

**Solution**:
```powershell
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Then restart backend
cd backend
mvn spring-boot:run
```

### CORS Errors

**Error**: `Access to fetch at 'http://localhost:8081/api/...' has been blocked by CORS policy`

**Solution**: The SecurityConfig has been updated to allow:
- http://localhost:3000
- http://localhost:5173
- http://localhost:8080
- http://localhost:8082

If you're running on a different port, add it to the SecurityConfig.java allowed origins list.

### 403 Forbidden Errors

**Error**: `Failed to load resource: the server responded with a status of 403`

**Solution**: All API endpoints are now set to `permitAll()` in SecurityConfig.java:
- /api/auth/**
- /api/restaurants/**
- /api/menu/**
- /api/menu-items/**
- /api/orders/**

If you still get 403 errors, restart the backend server.

### Orders Not Appearing

**Checklist**:
1. ✅ Backend is running on port 8081
2. ✅ Frontend is running (check which port in terminal)
3. ✅ Database is running and connected
4. ✅ No CORS errors in browser console
5. ✅ No 403 errors in browser console
6. ✅ Order placement shows success toast
7. ✅ Console logs show "Order created successfully"

**Debug Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Place an order
4. Check for any error messages
5. Check Network tab for failed requests
6. Verify the order was saved by checking database directly

### Database Connection Issues

**Error**: `Failed to connect to database`

**Check**:
1. MySQL is running
2. Database `tastetrack_db` exists
3. Credentials in `application.properties` are correct:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/tastetrack_db
   spring.datasource.username=root
   spring.datasource.password=password
   ```

### Frontend Build Errors

**Error**: Hot reload or build errors

**Solution**:
1. Stop the dev server (Ctrl+C)
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

## Testing the Complete Flow

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Wait for: `Started TasteTrackApplication in X seconds`

### 2. Start Frontend
```bash
npm run dev
```
Note the port (e.g., http://localhost:8082)

### 3. Test Order Flow
1. Browse restaurants
2. Click on a restaurant
3. Add items to cart (should see cart summary at bottom)
4. Click "View Cart"
5. Click "Proceed to Checkout"
6. Fill in all required fields:
   - First Name, Last Name
   - Phone Number
   - Street Address
   - City, State, ZIP Code
   - Select payment method
   - If card, fill in card details
7. Click "Place Order"
8. Should see success toast
9. Should redirect to Orders page
10. Order should appear in "Active Orders" tab

### 4. Test Order Tracking
1. On Orders page, click "Track Order"
2. Should see order timeline
3. Should see order details

### 5. Test Order Cancellation
1. On Orders page, find an order with status PENDING, CONFIRMED, or PREPARING
2. Click "Cancel Order"
3. Confirm cancellation
4. Order should move to "Past Orders" with CANCELLED status

## Logs to Check

### Backend Logs
Look for:
- `Started TasteTrackApplication` - Backend started successfully
- `Hibernate: insert into orders` - Order being saved to database
- Any SQL errors or exceptions

### Frontend Console Logs
Look for:
- "Placing order with restaurantId: X"
- "Order data being sent: {...}"
- "Order created successfully: {...}"
- Any fetch errors or 403/CORS errors

### Browser Network Tab
Check:
- POST to `/api/orders` - Should return 200 with order data
- GET to `/api/orders/user` - Should return 200 with array of orders
- Any failed requests (red) indicate issues

## Still Having Issues?

1. Check all logs (backend, frontend console, network tab)
2. Verify database has the order data
3. Restart both backend and frontend
4. Clear browser cache and refresh
5. Check that all files have been saved
6. Verify no TypeScript/compilation errors
