# Restaurant Onboarding & Approval System

## Overview
This feature enables restaurants to apply for partnership with Eat2Day through a public application form. Admin users can review, approve, or reject applications from a dedicated dashboard. Upon approval, a vendor account is automatically created for the restaurant owner.

## Features Implemented

### Backend (Java Spring Boot)

#### 1. Database Schema
- **RestaurantApplication Entity**: New table `restaurant_applications` with fields:
  - `id`, `name`, `email`, `phone`, `address`, `description`
  - `status` (PENDING, APPROVED, REJECTED)
  - `submitted_at`, `processed_at`, `processed_by`, `rejection_reason`

- **User Entity**: Added `VENDOR` role to support restaurant owners

- **Restaurant Entity**: Added `owner_id` foreign key to link restaurants with vendor users

#### 2. API Endpoints

**Public Endpoint (No Authentication Required):**
- `POST /api/applyRestaurant` - Submit a restaurant application

**Admin Endpoints (Requires Admin Token):**
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/applications/pending` - Get pending applications only
- `GET /api/admin/applications/{id}` - Get application by ID
- `POST /api/admin/applications/{id}/approve` - Approve an application
- `POST /api/admin/applications/{id}/reject` - Reject an application

#### 3. Business Logic (RestaurantApplicationService)
- Validates email uniqueness across applications and users
- Auto-generates secure temporary password for vendor accounts
- Creates both User (VENDOR role) and Restaurant entries upon approval
- Tracks approval/rejection with admin email and timestamp
- Sets default restaurant values (cuisine, rating, delivery time, etc.)

#### 4. Security Configuration
- Public access allowed to `/api/applyRestaurant`
- Admin endpoints protected with JWT token validation
- CORS configured for frontend origins

### Frontend (React + TypeScript)

#### 1. Apply Restaurant Page (`/apply-restaurant`)
- **Location**: `src/pages/ApplyRestaurant.tsx`
- **Features**:
  - Beautiful gradient design with form validation
  - Fields: Restaurant Name, Email, Phone, Address, Description
  - Character counter for description (minimum 50 characters)
  - Success toast notification and auto-redirect
  - Info section explaining the approval process

#### 2. Admin Applications Page (`/admin/applications`)
- **Location**: `src/pages/admin/Applications.tsx`
- **Features**:
  - Filter tabs: All, Pending, Approved, Rejected
  - Table view with application details
  - Status badges with icons and colors
  - Detailed view dialog with full application information
  - Approve/Reject actions with confirmation
  - Rejection reason input field
  - Real-time updates after actions

#### 3. Navigation Updates
- Added "Partner with Us" link in public navbar
- Added "Applications" link in admin navbar
- Routes configured in `App.tsx`

## How to Use

### For Restaurant Owners:
1. Visit the website and click "Partner with Us" in the navigation
2. Fill out the application form with restaurant details:
   - Restaurant name
   - Contact email
   - Phone number
   - Full address
   - Description (min 50 characters)
3. Submit the application
4. Wait for admin approval (typically 24-48 hours)
5. Receive login credentials via email (future enhancement)

### For Admin Users:
1. Log in to the admin dashboard
2. Click "Applications" in the navigation
3. View pending applications (default filter)
4. Click "View Details" on any application
5. Review the restaurant information
6. Choose to either:
   - **Approve**: Creates vendor account + restaurant entry automatically
   - **Reject**: Provide a rejection reason for the applicant

## API Request/Response Examples

### Submit Application
```bash
POST http://localhost:8081/api/applyRestaurant
Content-Type: application/json

{
  "name": "The Golden Spoon",
  "email": "contact@goldenspoon.com",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main Street, City, State, ZIP",
  "description": "A family-owned restaurant serving authentic Italian cuisine..."
}
```

### Approve Application (Admin)
```bash
POST http://localhost:8081/api/admin/applications/1/approve
Authorization: Bearer <admin-jwt-token>
```

### Reject Application (Admin)
```bash
POST http://localhost:8081/api/admin/applications/1/reject
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "rejectionReason": "Location not in our service area"
}
```

## Database Migration

The following tables will be automatically created when you start the backend:

```sql
CREATE TABLE restaurant_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    status VARCHAR(20) NOT NULL,
    submitted_at DATETIME NOT NULL,
    processed_at DATETIME,
    processed_by VARCHAR(255),
    rejection_reason VARCHAR(255)
);

ALTER TABLE restaurants ADD COLUMN owner_id BIGINT;
ALTER TABLE restaurants ADD FOREIGN KEY (owner_id) REFERENCES users(id);
```

## Environment Configuration

### Backend
Ensure your `application.properties` includes:
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/tastetrack_db
spring.jpa.hibernate.ddl-auto=update
```

### Frontend
Create `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8081
```

## Testing the Feature

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Public Application**:
   - Navigate to http://localhost:5173/apply-restaurant
   - Fill out and submit the form
   - Verify success message

4. **Test Admin Approval**:
   - Log in as admin at http://localhost:5173/admin/login
   - Navigate to Applications page
   - Approve or reject the submitted application
   - Verify vendor account creation in database

## Future Enhancements

- [ ] Email notifications to applicants on approval/rejection
- [ ] Email vendor credentials on approval
- [ ] File upload for restaurant images/documents
- [ ] Multi-step application form with business verification
- [ ] Vendor dashboard for approved restaurants
- [ ] Application status tracking page for applicants
- [ ] Admin notes/comments on applications
- [ ] Bulk approval/rejection actions

## Technical Stack

- **Backend**: Java 17, Spring Boot 3.2.0, Spring Security, JPA/Hibernate, MySQL
- **Frontend**: React 18, TypeScript, React Router, TanStack Query, Shadcn/ui, Tailwind CSS
- **Authentication**: JWT tokens
- **Validation**: Jakarta Validation, Zod (future)

## Files Modified/Created

### Backend
- ✅ `entity/User.java` - Added VENDOR role
- ✅ `entity/Restaurant.java` - Added owner relationship
- ✨ `entity/RestaurantApplication.java` - New entity
- ✨ `repository/RestaurantApplicationRepository.java` - New repository
- ✨ `dto/RestaurantApplicationRequest.java` - New DTO
- ✨ `dto/RestaurantApplicationResponse.java` - New DTO
- ✨ `dto/ApplicationActionRequest.java` - New DTO
- ✨ `service/RestaurantApplicationService.java` - New service
- ✨ `controller/RestaurantApplicationController.java` - New controller
- ✅ `config/SecurityConfig.java` - Updated with public endpoint

### Frontend
- ✨ `pages/ApplyRestaurant.tsx` - New page
- ✨ `pages/admin/Applications.tsx` - New page
- ✅ `App.tsx` - Added routes
- ✅ `components/Navbar.tsx` - Added navigation links

Legend: ✨ New file | ✅ Modified file

---

**Status**: ✅ Feature Complete and Ready for Testing
