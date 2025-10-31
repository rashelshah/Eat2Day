Eat2Day - Online Food Ordering System
Project Summary
Eat2Day is a full-stack, end-to-end web application designed to revolutionize the online food ordering and delivery process. The system successfully connects three key stakeholders—Customers, Restaurants (Vendors), and Administrators—through a seamless, secure, and feature-rich platform.

The application is built on a robust three-tier architecture using the React/Spring Boot/MySQL stack. It provides a dynamic customer-facing portal for browsing and ordering, a comprehensive Vendor Portal for restaurant management, and a high-privilege Admin Portal for centralized control over all business operations.

Key Features
The application is modular and feature-rich, covering the entire lifecycle of a food order:

Module	Core Functionality	Stakeholders
Customer Interface	Dynamic restaurant discovery, menu browsing, sophisticated shopping cart management, and real-time order tracking (Active/Past Orders).	Customer
Restaurant Onboarding	Public-facing application form for restaurants to partner with the platform. Includes an admin dashboard for reviewing, approving, or rejecting applications.	Admin, Vendor
Vendor Portal	Dedicated dashboard for approved vendors to manage their restaurant profile (info, open/closed status), and perform full CRUD operations on their menu items.	Vendor
Order Management	Handles transactional logic and the complete order status lifecycle: PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED.	Customer, Admin, Vendor
User & Security	Secure registration, login, and profile management for all three roles: CUSTOMER, VENDOR, and ADMIN.	All
Payment Module	Accurate calculation of subtotals, fees, and tax; initiation of payment gateway process and record logging.	Customer, Admin
Delivery Management	Manages order assignment and delivery status updates for timely service.	Admin, Delivery Agent
Technical Stack
Eat2Day is built on modern, industry-standard technologies selected for performance, scalability, and maintainability.

Architecture

The system utilizes a Three-Tier Architecture secured by JWT (JSON Web Tokens) for stateless authentication across all protected API endpoints.

Layer	Technology	Key Role
Frontend (Presentation Tier)	React	Dynamic, component-based user interface; ensures a fast, responsive, and intuitive customer experience.
Backend (Application Tier)	Java (Spring Boot)	Enterprise-grade application logic layer; handles RESTful APIs, business rules, and secure data validation.
Database (Data Tier)	MySQL + JDBC	Reliable relational database for transactional data (Orders, Payments) and critical system records; connected efficiently via JDBC.
Security	JWT Authentication	Provides secure, token-based authorization for all customer, vendor, and administrator interactions.
Administrative Control Panel
A crucial component of the system is the Admin Portal, which provides administrators with complete oversight and operational command:

Universal Data Access: Full CRUD (Create, Read, Update, Delete) control over all users, restaurants, menu items, and order records.

Application Management: Ability to review, approve, and reject new restaurant applications from a dedicated dashboard.

Operational Management: Ability to manually override or confirm order statuses and manage delivery dispatch.

System Configuration: Control over global parameters such as commission rates, tax configurations, and vendor service limits.

🏪 Vendor Portal
Approved restaurant owners gain access to a powerful Vendor Portal to manage their operations autonomously:

Restaurant Management: Update restaurant details, including name, address, cuisine type, delivery times, and toggle the restaurant's open/closed status.

Menu Management: Full CRUD (Create, Read, Update, Delete) capability for all menu items, including details like name, description, price, category, and images.

Order Management: View and process all incoming orders for their restaurant. Vendors can update the order status through the complete workflow (e.g., from PENDING to CONFIRMED, CONFIRMED to PREPARING, etc.).

Future Scope
Real-Time Tracking: Implement map-based geo-location tracking for live delivery updates.

Advanced Notification System: Develop email and in-app notifications for critical order status changes, application approval/rejection, and vendor credential delivery.

Vendor Analytics: Build an analytics dashboard for vendors to track sales, view popular items, and monitor revenue.

Enhanced Vendor Tools:

Implement password reset and "change password" functionality.

Add inventory management and menu item availability toggles (e.g., "Sold Out").

Create tools for managing special offers and discounts.

Healthy Recommendations: Add a feature that suggests nutritious meals based on users’ preferences and calorie goals by processing nutritional data.

Advanced Onboarding: Enhance the application form with file uploads (for restaurant images/documents) and create a multi-step verification process.