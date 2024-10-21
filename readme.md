# CSE601 Stack Overflow Project: From Monolith to Microservices

This repository contains the implementation of a **Stack Overflow**-like project developed for the **CSE601** course. The project is initially built using a **monolithic architecture**, and then converted into a **microservices architecture**.

## Table of Contents
- [Goal](#goal)
- [Project Overview](#project-overview)
- [Part 1: Monolithic Architecture](#part-1-monolithic-architecture)
- [Part 2: Microservices Architecture](#part-2-microservices-architecture)
- [Transition from Monolithic to Microservices](#transition-from-monolithic-to-microservices)
- [System Assumptions](#system-assumptions)
- [Other Instructions](#other-instructions)
- [Demo](#demo)
- [Installation](#installation)
- [Contributing](#contributing)

## Goal

The goal of this project is to build a monolithic web-based system, then break down the system into microservices following the **microservice architecture**. This project simulates a simple Stack Overflow platform, focusing on distributed systems.

## Project Overview

This project consists of two parts:
1. **Part 1:** Build a monolithic server and client.
2. **Part 2:** Refactor the system into microservices.

### Architecture

The system architecture includes both a client (UI) and a server (backend). The client interacts with the server through RESTful APIs to manage user accounts, posts, and notifications.

## Part 1: Monolithic Architecture

### Client Requirements

The client UI will have the following routes:
- **SignUp Page:** For user registration.
- **SignIn Page:** For user authentication.
- **Home Page:** Displays a list of posts (texts/code snippets) created by other users.
- **Notification Page:** Shows recent post notifications. Clicking on a notification should open the corresponding post.

### Server Requirements

The server will provide the following APIs:

- `/signup`: 
  - Method: **POST**
  - Registers a new user with email and password.
  
- `/signin`: 
  - Method: **POST**
  - Authenticates the user by email and password.

- `/post`: 
  - Method: **GET** | **POST**
  - **GET**: Fetch the latest posts from all users except the logged-in user.
  - **POST**: Create a new post (with optional code snippets).

- `/notification`: 
  - Method: **GET** | **POST**
  - **GET**: Retrieve recent post notifications.
  - **POST**: Create a notification for a new post.

### Jobs

- **Notification Cleaner Job**: Periodically deletes old notifications.

---

## Part 2: Microservices Architecture

### Description

In this part, the monolithic system is refactored into independent services, each responsible for a specific function. The architecture includes the following microservices:
- **User Service:** Manages user sign-up and sign-in.
- **Post Service:** Handles creating and retrieving posts.
- **Notification Service:** Manages notifications for new posts.
- **API Gateway:** Coordinates communication between services.

### Transition from Monolithic to Microservices

The following steps were taken to refactor the monolithic application:
1. **Identify Components:** The components for Users, Posts, and Notifications were isolated.
2. **Create Independent Services:** Each component was turned into a separate microservice.
3. **API Gateway:** Introduced to handle the routing and communication between services.
4. **Decoupled Databases:** Each microservice has its own database for independent data management.

---

## System Assumptions

- No additional features like comments or voting are required.
- Code snippets are stored in an **object store database (MinIO)**.
- Any programming language can be used (Node.js, Python, or Go recommended).
- Frameworks like **Express**, **Flask**, **FastAPI**, or **Gin** can be used for backend development, and **React**, **Vue**, or **Angular** for frontend development.
- Use any database (SQL or NoSQL).

---

## Other Instructions

- Focus on basic requirements and avoid implementing extra features, as they could introduce complexities during the transition to microservices.

---

## Demo

You can view the demo videos for both versions of the project:
- [Monolithic Version Demo](link-to-monolithic-demo)
- [Microservices Version Demo](link-to-microservices-demo)

---

## Installation

To run the project locally:

### Monolithic Version

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stack-overflow-mono.git
   ```

2. Navigate to the monolithic version:
   ```bash
   cd stack-overflow-mono
   ```

3. Install dependencies:
   ```bash
   npm install # or pip install -r requirements.txt for Python
   ```

4. Run the application:
   ```bash
   npm start
   ```

### Microservices Version

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stack-overflow-microservices.git
   ```

2. Navigate to each service directory and install dependencies:
   ```bash
   cd user-service && npm install
   cd post-service && npm install
   cd notification-service && npm install
   ```

3. Start each service:
   ```bash
   npm start
   ```