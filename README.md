# **Eat2Day \- Online Food Ordering System**

## **Project Summary**

**Eat2Day** is a full-stack, end-to-end web application designed to revolutionize the online food ordering and delivery process. The system successfully connects three key stakeholders—**Customers**, **Restaurants (Vendors)**, and **Administrators**—through a seamless and secure platform.

The application is built on a robust **three-tier architecture** using the **React/Spring Boot/MySQL** stack. It provides a dynamic customer-facing portal for browsing, ordering, and tracking, alongside a high-privilege **Admin Portal** that offers centralized control over all business operations.

## **Key Features**

The application is modular and feature-rich, covering the entire lifecycle of a food order:

| Module | Core Functionality | Stakeholders |
| :---- | :---- | :---- |
| **Customer Interface** | Dynamic restaurant discovery, menu browsing, sophisticated shopping cart management, and real-time order tracking (Active/Past Orders). | Customer |
| **Order Management** | Handles transactional logic, status lifecycle (PENDING $\\rightarrow$ ACCEPTED $\\rightarrow$ OUT\_FOR\_DELIVERY), and order cancellation. | Customer, Admin, Vendor |
| **User & Security** | Secure user registration, login, profile management, and role-based access control. | All |
| **Payment Module** | Accurate calculation of subtotals, fees, and tax; initiation of payment gateway process and record logging. | Customer, Admin |
| **Restaurant & Menu Management** | Vendor onboarding, menu creation (pricing, images, categories), and control over restaurant availability. | Admin, Vendor |
| **Delivery Management** | Manages order assignment and delivery status updates for timely service. | Admin, Delivery Agent |

## **Technical Stack**

Eat2Day is built on modern, industry-standard technologies selected for performance, scalability, and maintainability.

### **Architecture**

The system utilizes a **Three-Tier Architecture** secured by **JWT (JSON Web Tokens)** for stateless authentication across all protected API endpoints.

| Layer | Technology | Key Role |
| :---- | :---- | :---- |
| **Frontend (Presentation Tier)** | **React** | Dynamic, component-based user interface; ensures a fast, responsive, and intuitive customer experience. |
| **Backend (Application Tier)** | **Java (Spring Boot)** | Enterprise-grade application logic layer; handles RESTful APIs, business rules, and secure data validation. |
| **Database (Data Tier)** | **MySQL \+ JDBC** | Reliable relational database for transactional data (Orders, Payments) and critical system records; connected efficiently via JDBC. |
| **Security** | **JWT Authentication** | Provides secure, token-based authorization for all customer and administrator interactions. |

## **Administrative Control Panel**

A crucial component of the system is the **Admin Portal**, which provides administrators with complete oversight and operational command:

* **Universal Data Access:** Full CRUD (Create, Read, Update, Delete) control over all users, restaurants, menu items, and order records.  
* **Operational Management:** Ability to manually override or confirm order statuses and manage delivery dispatch.  
* **System Configuration:** Control over global parameters such as commission rates, tax configurations, and vendor service limits.

## **Future Scope**

1. **Real-Time Tracking:** Implement map-based geo-location tracking for live delivery updates.  
2. **Healthy Recommendations: **Add a feature that suggests nutritious meals based on users’ preferences and calorie goals. This can be achieved by storing nutritional data in MySQL, processing it through Spring Boot, and displaying “Healthy Choice” options on the React frontend.  
3. **Notification System:** Develop email and in-app notifications for critical order status changes.