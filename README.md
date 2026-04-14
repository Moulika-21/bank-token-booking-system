# 🏦 Bank Token Management System

## 📌 Project Overview

The **Bank Token Management System** is a full-stack web application designed to reduce waiting time and improve customer experience in banks.
It allows users to book tokens online for banking services and helps administrators efficiently manage queues, monitor transactions, and generate reports.

The system ensures **secure authentication, real-time slot booking, OTP verification, and admin analytics dashboards**.

---

## 🚀 Key Features

### 👤 User Features

* 🔐 **User Authentication**

  * Secure login & registration using JWT
  * Access & refresh token mechanism
* 👤 **Profile Management**

  * View and update personal details
* 🎟️ **Token Booking**

  * Book tokens for bank services
  * Slot-based booking system
* ⏱️ **Smart Slot Allocation**

  * Time slots based on service type:

    * Deposit/Withdraw → 5 mins
    * Loan Enquiry → 20 mins
  * Excludes:

    * Lunch break (1:00 PM – 2:00 PM)
    * Tea breaks
    * Weekends
    * Past time slots (for current day)
* 📧 **OTP Verification**

  * OTP sent to email before booking
  * OTP expiry handling
* 📋 **My Tokens**

  * View booked tokens
  * Track status (Booked, Processing, Served, Cancelled, Expired)

---

### 🛠️ Admin Features

* 📊 **Dashboard**

  * Visual representation using charts (Bar & Pie)
  * Token distribution:

    * By Branch
    * By Service
* 📈 **Summary Panel**

  * Total Tokens
  * Booked / Completed / Processing / Cancelled / Expired
* 🔍 **Advanced Filtering**

  * Filter tokens by:

    * Branch
    * Service
    * Date & Time range
* 🔄 **Token Status Management**

  * Update token status (Processing, Served, etc.)
  * Email notification on completion
* 📥 **Report Generation**

  * Download CSV reports:

    * Branch-wise
    * Service-wise
  * Includes:

    * Bank Name
    * Branch Name
    * Service Name
    * Token Count

---

## 🧠 Core Functionalities

### 🔑 Authentication System

* JWT-based authentication
* Access Token (short-lived)
* Refresh Token (stored in HTTP-only cookies)
* Automatic token refresh using Axios interceptors

---

### 📅 Slot Management Logic

* Dynamic slot generation based on:

  * Service duration
  * Working hours (9 AM – 5 PM)
* Skips:

  * Lunch & tea breaks
  * Already booked slots
  * Past time slots

---

### 🔐 Security Features

* Role-based access control (User / Admin)
* Protected routes (frontend & backend)
* Secure cookie handling
* Email OTP verification

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React.js
* Axios (API handling)
* React Router
* CSS (Custom styling)

### 🔹 Backend

* Spring Boot
* Spring Security
* JWT Authentication
* JPA / Hibernate

### 🔹 Database

* MySQL

### 🔹 Tools

* Postman (API testing)
* Git & GitHub (version control)
* Spring Tool Suite (STS)
* VS Code

---

## ⚙️ Project Architecture

```
Frontend (React)
        ↓
Axios API Calls
        ↓
Spring Boot Backend (REST APIs)
        ↓
Service Layer (Business Logic)
        ↓
Repository Layer (JPA)
        ↓
MySQL Database
```

---

## 📌 API Highlights

* `/api/users/login` → Login user
* `/api/users/auth/refresh` → Refresh token
* `/api/tokens/send-otp` → Send OTP
* `/api/tokens/verify-otp` → Verify OTP & book token
* `/api/tokens/count-by-branch` → Dashboard data
* `/api/tokens/filter` → Filter tokens

---

## 🎯 Unique Points of the Project

* ✅ Real-time slot booking with constraints
* ✅ OTP-based secure token booking
* ✅ Admin analytics dashboard
* ✅ JWT + Refresh Token implementation
* ✅ Bank-specific admin data isolation
* ✅ CSV report generation
* ✅ Full-stack integration (React + Spring Boot)

---

## 📸 Screens (Optional)

* Login Page
* Home Page
* Token Booking Page
* My tokens Page
* User Profile Page
* Admin Dashboard
* Summary Page

---





## ⭐ Conclusion

This project demonstrates a complete real-world application with **authentication, scheduling logic, secure transactions, and analytics**, making it highly relevant for banking and service-based systems.
