Bank Token Management System
A backend-driven full-stack application designed to reduce waiting time at banks by enabling users to book service tokens online and allowing administrators to manage and monitor service flow efficiently.

Project Overview:
This system allows users to book bank service tokens in advance instead of waiting in long queues. It includes secure authentication, OTP-based booking verification, role-based access control, and real-time dashboard analytics.
The backend is designed with strong emphasis on data consistency, access control, and scalable API design.

Mapping to Assignment Requirements:

Assignment Requirement	                                   Implementation in This Project
User & Role Management	                       Implemented using User and Admin roles with JWT authentication
Financial Records	                       Token bookings are treated as structured records with attributes like date, branch, and status
Dashboard Summary APIs	                       Admin dashboard provides aggregated data such as total bookings, completed, pending, and cancelled tokens
Access Control Logic	                       Role-based restrictions ensure only admins can update token status while users can only book/cancel
Data Persistence	                       MySQL database used for storing users, tokens, slots, and OTP data
Validation & Error Handling	               Includes OTP verification, input validation, and proper error responses
Concurrency Handling	                       Pessimistic locking ensures that multiple users cannot book the same slot simultaneously

✨ Features
👤 User Features
  User Registration & Login (JWT with cookies)
  Book tokens based on bank, branch, and available slots
  OTP-based verification before confirming booking
  Cancel booked tokens
  View booking history
🛠️ Admin Features
 -> View dashboard with:
      Total tokens booked
      Completed tokens
      Pending tokens
      Cancelled tokens
      Filter data based on date and time
 -> Update token status:
      Pending
      In Progress
      Completed
      Cancelled
      
🧠 Backend Highlights
  Role-Based Access Control (RBAC)
  Secure JWT Authentication with cookies
  OTP verification system
  RESTful API design
  Efficient database schema design
  Pessimistic locking for concurrency control
    - Prevents multiple users from booking the same slot at the same time
    - Ensures data consistency and avoids race conditions

🛠️ Tech Stack
  Backend: Spring Boot
  Frontend: React
  Database: MySQL
  Authentication: JWT + Cookies
  Email Service: SMTP (for OTP verification)

API Endpoints (Sample):
  POST /api/users/register → Register user
  POST /api/users/login → Login
  POST /api/tokens/book → Book token (with OTP)
  Put /api/token-id/cancel → Cancel token
  GET /api/banks/user -> Get all the banks of the user 
  GET /api/branches/bank -> get branches of the bank
  GET /api/services/branch -> Get services of the branch
  GET /api/tokens/user → View user bookings
  GET /api/filter -> filter the tokens based on requirements
  GET /api/summary/today -> get summary of todays tokens
  GET /api/count-by-branch -> get the number of tokens by branch for today
  GER /api/count-by-service -> get the number of tokens for a service by branch for today
  PUT /api/token/status → Update token status

🗄️ Database Design

Main tables:
  User
  Token
  Account
  Bank
  Branch
  BranchService
  TokenStatus
<img width="1907" height="914" alt="Screenshot 2025-08-31 225413" src="https://github.com/user-attachments/assets/2cadb0b3-d9bf-445a-abbd-653a1a671b50" />
