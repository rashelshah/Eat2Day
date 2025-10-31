# Vendor System Documentation

## Overview
The vendor system allows restaurant owners to manage their restaurants, menu items, and orders after being approved by an admin.

## Workflow

### 1. Restaurant Application
- A person applies to add their restaurant via `/apply-restaurant`
- Application is submitted with:
  - Restaurant name, email, phone, address, description
  - **Password** (for vendor login after approval)
  - **Confirm Password**
- The password is securely stored in the application (encrypted when creating vendor account)

### 2. Admin Approval
- Admin logs in at `/admin/login`
- Admin views applications at `/admin/applications`
- Admin approves the application
- System automatically:
  - Creates a VENDOR user account (or updates existing user to VENDOR role)
  - Uses the **password provided during application** (not a temporary password)
  - Creates the restaurant entry linked to the vendor

### 3. Vendor Login
- Vendor logs in at `/auth` using their email and password
- System redirects to `/vendor` (Vendor Dashboard) automatically

### 4. Vendor Dashboard Features

#### Restaurant Management
- View restaurant details
- Update restaurant information (name, cuisine, address, delivery time, etc.)
- Toggle restaurant open/closed status

#### Menu Management
- View all menu items
- Add new menu items with:
  - Name, description, price
  - Category
  - Image URL
  - Vegetarian/Non-vegetarian flag
  - Rating
- Edit existing menu items
- Delete menu items

#### Order Management
- View all orders for their restaurant
- Filter by order status:
  - PENDING - Awaiting confirmation
  - CONFIRMED - Order confirmed
  - PREPARING - Being prepared
  - OUT_FOR_DELIVERY - Out for delivery
  - DELIVERED - Successfully delivered
  - CANCELLED - Order cancelled
- Update order status through the workflow:
  - PENDING → CONFIRMED or CANCELLED
  - CONFIRMED → PREPARING
  - PREPARING → OUT_FOR_DELIVERY
  - OUT_FOR_DELIVERY → DELIVERED

## Backend API Endpoints

### Vendor Authentication
All vendor endpoints require `Authorization: Bearer <token>` header with a VENDOR role token.

### Restaurant Endpoints
- `GET /api/vendor/restaurant` - Get vendor's restaurant details
- `PUT /api/vendor/restaurant` - Update restaurant details

### Menu Item Endpoints
- `GET /api/vendor/menu-items` - Get all menu items for vendor's restaurant
- `POST /api/vendor/menu-items` - Create a new menu item
- `PUT /api/vendor/menu-items/{id}` - Update a menu item
- `DELETE /api/vendor/menu-items/{id}` - Delete a menu item

### Order Endpoints
- `GET /api/vendor/orders` - Get all orders for vendor's restaurant
- `PUT /api/vendor/orders/{orderId}/status` - Update order status
  - Request body: `{ "status": "CONFIRMED" }`

## Security
- All vendor endpoints validate the JWT token
- Endpoints verify the user has VENDOR role
- Menu items and orders are scoped to the vendor's restaurant only
- Vendors can only manage their own restaurant and orders

## Frontend Routes
- `/vendor` - Vendor Dashboard (protected route, requires VENDOR role)
- `/vendor/menu/add` - Add new menu item (to be implemented)
- `/vendor/menu/edit/:id` - Edit menu item (to be implemented)
- `/vendor/settings` - Restaurant settings (to be implemented)

## Database Schema Updates
The following changes were made to support vendors:

1. **users table**: Added `VENDOR` to role enum
2. **restaurants table**: Added `owner_id` foreign key to users table
3. **restaurant_applications table**: Tracks restaurant applications

## Next Steps for Enhancement
1. Email notification system to notify vendors when their application is approved
2. Password reset functionality for vendors
3. Analytics dashboard for vendors (sales, popular items, etc.)
4. Inventory management
5. Menu item availability toggle
6. Special offers and discounts management
7. Change password feature in vendor dashboard
