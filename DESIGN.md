# Application Design Document

## Overview

This document outlines the architecture and design of the application, detailing the structure of services, components, and their interactions.

---

## Service Structure

### 1. Frontend

- **Purpose**: Handles user interface and client-side logic.
- **Key Features**:
  - Responsive design.
  - API integration for data fetching.
  - State management using pinia.

---

## Component Interaction

### 1. Frontend and Backend

- Communication via RESTful API endpoints.

### 2. Component Communication

- **Parent-to-Child**: Components pass data to their children using props. For example, the `FlightList` component passes flights data to the `FlightCard` component.
- **Child-to-Parent**: Components emit custom events to notify their parents about user actions. For example, the `LoginModal` emits a `close` event to notify its parent when the modal is closed.

### 3. State Management

- The application uses **Pinia** for centralized state management.
- Shared states include:
  - Authentication state (e.g., `token`, `mobile`).
  - Flights list base on search form fieilds.
- Components access and update the state using Pinia actions and getters.

### 4. API Integration

- Components interact with the backend via RESTful API endpoints.
- Example:
  - The `LoginModal` component sends a login request to the `/api/auth/login` endpoint and updates the authentication state in the Pinia store.

# 4. Dynamic Behavior

- Components dynamically update their UI based on user actions or state changes.
- Example:
  - The `Navbar` component updates its UI to show the profile icon when the user is logged in.
  - The `SelectBox` component filters options as the user types in the search box.

---

## Conclusion

This design ensures a modular, scalable, and maintainable application architecture, enabling efficient development and deployment.
