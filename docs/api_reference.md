```markdown
## Repricer API Specification

### Authentication

#### POST /api/auth/login
- **Description:** Authenticate users and provide a JWT for accessing protected routes.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "token": "JWT_TOKEN_HERE",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "role": "admin"
      }
    }
    ```
- **Error Response:**
  - **Code:** 401 Unauthorized
  - **Content:**
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

#### GET /api/users
- **Description:** Retrieves a list of users. Requires JWT authentication.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "id": 1,
      "email": "user@example.com",
      "role": "admin"
    }]
    ```

#### POST /api/users
- **Description:** Creates a new user. Requires JWT authentication and admin role.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "email": "newuser@example.com",
    "password": "newpassword123",
    "role": "user"
  }
  ```
- **Successful Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "id": 2,
      "email": "newuser@example.com",
      "role": "user"
    }
    ```

#### GET /api/pricing
- **Description:** Retrieves all pricing strategies. Requires JWT authentication.
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "id": "strategy1",
      "name": "Strategy One",
      "criteria": "If stock < 10, increase price by 5%",
      "actions": "Increase price",
      "isActive": true
    }]
    ```

#### POST /api/pricing
- **Description:** Creates a new pricing strategy. Requires JWT authentication.
- **Request Body:**
  ```json
  {
    "name": "Strategy Two",
    "criteria": "If competitor price < our price, decrease price by 3%",
    "actions": "Decrease price",
    "isActive": true
  }
  ```
- **Successful Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "id": "strategy2",
      "name": "Strategy Two",
      "criteria": "If competitor price < our price, decrease price by 3%",
      "actions": "Decrease price",
      "isActive": true
    }
    ```

#### GET /api/subscriptions
- **Description:** Retrieves all subscriptions. Requires JWT authentication.
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "id": "sub1",
      "userId": 1,
      "plan": "Basic",
      "status": "active"
    }]
    ```

#### POST /api/subscriptions
- **Description:** Creates a new subscription. Requires JWT authentication.
- **Request Body:**
  ```json
  {
    "userId": 1,
    "plan": "Premium"
  }
  ```
- **Successful Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "id": "sub2",
      "userId": 1,
      "plan": "Premium",
      "status": "active"
    }
    ```

#### GET /api/tenants
- **Description:** Lists all tenants. Requires JWT authentication.
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "id": "tenant1",
      "name": "Tenant One",
      "apiKey": "API_KEY_HERE",
      "isActive": true
    }]
    ```

#### POST /api/tenants
- **Description:** Creates a new tenant. Requires JWT authentication.
- **Request Body:**
  ```json
  {
    "name": "New Tenant",
    "apiKey": "NEW_API_KEY"
  }
  ```
- **Successful Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "id": "tenant2",
      "name": "New Tenant",
      "apiKey": "NEW_API_KEY",
      "isActive": true
    }
    ```

### Enhanced User Management

#### PUT /api/users/{userId}/role
- **Description:** Updates the role of an existing user.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:**```markdown
  - `userId` - The ID of the user to update.
- **Request Body:**
  ```json
  {
    "role": "editor"
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "User role updated successfully."
    }
    ```
- **Error Response:**
  - **Code:** 404 Not Found
  - **Content:**
    ```json
    {
      "error": "User not found"
    }
    ```

#### DELETE /api/pricing/{strategyId}
- **Description:** Deletes a specific pricing strategy.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `strategyId` - The ID of the strategy to delete.
- **Successful Response:**
  - **Code:** 204 No Content
- **Error Response:**
  - **Code:** 404 Not Found
  - **Content:**
    ```json
    {
      "error": "Strategy not found"
    }
    ```

#### PUT /api/subscriptions/{subscriptionId}
- **Description:** Updates the subscription plan for an existing subscription.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `subscriptionId` - The ID of the subscription to update.
- **Request Body:**
  ```json
  {
    "plan": "Enterprise"
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Subscription updated successfully."
    }
    ```
- **Error Response:**
  - **Code:** 400 Bad Request
  - **Content:**
    ```json
    {
      "error": "Invalid subscription plan"
    }
    ```

#### PUT /api/tenants/{tenantId}
- **Description:** Updates details for an existing tenant.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `tenantId` - The ID of the tenant to update.
- **Request Body:**
  ```json
  {
    "name": "Updated Tenant",
    "isActive": false
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Tenant updated successfully."
    }
    ```
- **Error Response:**
  - **Code:** 404 Not Found
  - **Content:**
    ```json
    {
      "error": "Tenant not found"
    }
    ```

### Error Handling Across All Endpoints

#### General Error Response

- **Code:** 400 Bad Request | 401 Unauthorized | 403 Forbidden | 404 Not Found | 500 Internal Server Error
- **Content:**
  ```json
  {
    "error": "Error description here",
    "code": "SpecificErrorCode",
    "help": "http://docs.api.com/errors/SpecificErrorCode"
  }
  ```

### API Versioning

To anticipate future expansions and maintain backward compatibility, introducing API versioning is essential:

#### Base Path

Version 1: /api/v1/...

Note: Versioning allows the API to evolve over time without breaking existing integrations, a critical aspect for long-term API strategy.
``````markdown
#### Product Management

#### GET /api/products
- **Description:** Retrieves a list of all products along with their pricing information.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "productId": "P12345",
      "name": "Example Product",
      "currentPrice": 29.99,
      "basePrice": 24.99,
      "stockLevel": 100,
      "category": "Electronics"
    }]
    ```

#### POST /api/products
- **Description:** Adds a new product to the inventory.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "name": "New Product",
    "basePrice": 15.99,
    "category": "Books",
    "stockLevel": 50
  }
  ```
- **Successful Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "productId": "P67890",
      "message": "Product added successfully."
    }
    ```

#### GET /api/analytics/sales
- **Description:** Retrieves sales analytics for products, allowing filtering by date range.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Query Parameters:** startDate, endDate
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "productId": "P12345",
      "unitsSold": 150,
      "totalRevenue": 4500.00,
      "averagePrice": 30.00
    }]
    ```

#### GET /api/reports/inventory
- **Description:** Generates an inventory report, detailing stock levels and reorder recommendations.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "productId": "P12345",
      "name": "Example Product",
      "stockLevel": 20,
      "reorderRecommended": true
    }]
    ```

#### GET /api/config/settings
- **Description:** Fetches current system-wide settings, such as pricing margins, API rate limits, etc.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "pricingMargin": 5,
      "apiRateLimit": 1000,
      "inventoryCheckInterval": "24h"
    }
    ```

#### POST /api/config/settings
- **Description:** Updates system-wide settings.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "pricingMargin": 6,
    "apiRateLimit": 1200
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Settings updated successfully."
    }
    ```

#### POST /api/kafka/produce
- **Description:** Sends messages to a specified Kafka topic, facilitating real-time data processing for price updates or inventory changes.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "topic": "price_updates",
    "messages": [
      { "key": "P12345", "value": "{\"newPrice\": 27.99}" }
    ]
  }
  ```
- **Successful Response:**
  - **Code:** 202 Accepted
  - **Content:**
    ```json
    {
      "message": "Message sent to Kafka topic successfully."
    }
    ```
- **Error Response:**
  - **Code:** 500 Internal Server Error
  - **Content:**
    ```json
    {
      "error": "Failed to send message to Kafka"
    }
    ```
```
```markdown
#### Product Feedback Management

#### GET /api/products/feedback
- **Description:** Retrieves feedback on product updates processed through Kafka, including success statuses and error logs.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "productId": "P12345",
      "status": "Updated",
      "price": 27.99,
      "lastUpdated": "2024-02-02T12:00:00Z"
    }]
    ```

#### Product Pricing Strategy Activation

#### POST /api/pricing/{strategyId}/activate
- **Description:** Activates or deactivates a pricing strategy dynamically, allowing for responsive adjustments to market conditions.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** strategyId - The ID of the strategy to update.
- **Request Body:**
  ```json
  { "isActive": true }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Pricing strategy activated successfully."
    }
    ```

#### User Subscription Management

#### GET /api/subscriptions/{userId}
- **Description:** Fetches subscription details for a user, considering tenant-specific settings and subscription plans outlined in the files.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `userId` - The ID of the user whose subscription details are to be retrieved.
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "userId": 1,
      "plan": "Premium",
      "features": ["Real-time Pricing Updates", "Advanced Analytics"],
      "status": "active"
    }
    ```

#### System Health Check

#### GET /api/system/health
- **Description:** Returns the current health status of the system, including database connectivity and Kafka broker status.
- **Headers:** None required
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "Healthy",
      "database": "Connected",
      "kafkaBroker": "Connected"
    }
    ```

#### User Activity Logging

#### POST /api/users/{userId}/activity
- **Description:** Logs user activity within the system, aiding in analytics and personalized user experiences.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `userId` - The ID of the user performing the activity.
- **Request Body:**
  ```json
  { "activity": "Viewed Dashboard", "timestamp": "2024-02-02T14:30:00Z" }
  ```
- **Successful Response:**
  - **Code:** 204 No Content

#### Real-time Notifications

#### WebSocket /api/notifications/subscribe
- **Description:** Establishes a WebSocket connection for real-time notifications to the client, such as price updates or alerts.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE

#### Product Category Management

#### GET /api/categories
- **Description:** Retrieves a list of product categories, supporting enhanced product organization and searchability.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "categoryId": "C123",
      "name": "Electronics",
      "description": "Electronic gadgets and devices."
    }]
    ```

#### POST /api/categories
- **Description:** Adds a new product category to the system.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "name": "Home Appliances",
    "description": "Kitchen and home electronic appliances."
  }
  ```
- **Successful Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "message": "Category added successfully."
    }
    ```

#### Feature Flags Management

#### GET /api/features
- **Description:** Lists all feature flags, enabling or disabling specific functionality dynamically.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "featureId": "F123",
      "name": "AdvancedAnalytics",
      "isEnabled": true
    }]
    ```

#### PUT /api/features/{featureId}
- **Description:** Toggles a feature flag on or off.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `featureId` - The ID of the feature to toggle.
- **Request Body```json
  {
    "isEnabled": false
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Feature flag updated successfully."
    }
    ```

#### Environmental Configuration

#### GET /api/config/environment
- **Description:** Retrieves the current environment configuration settings, including API keys, service endpoints, and feature toggles.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "environment": "production",
      "apiKeys": {
        "externalService": "abc123"
      },
      "featureToggles": {
        "newUI": true
      }
    }
    ```

#### POST /api/config/environment
- **Description:** Updates environment-specific configurations, allowing dynamic adjustments without system restarts.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "featureToggles": {
      "newUI": false
    }
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Environment configuration updated successfully."
    }
    ```

#### User Preferences

#### GET /api/users/{userId}/preferences
- **Description:** Fetches user-specific preferences, enabling personalized application behavior.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `userId` - The ID of the user whose preferences are being retrieved.
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "userId": 1,
      "preferences": {
        "notificationSettings": {
          "email": true,
          "sms": false
        },
        "dashboardLayout": "compact"
      }
    }
    ```

#### POST /api/users/{userId}/preferences
- **Description:** Updates preferences for a specific user.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "preferences": {
      "dashboardLayout": "expanded"
    }
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "User preferences updated successfully."
    }
    ```

#### Error Handling

#### General Error Response
- **Code:** 400 Bad Request | 401 Unauthorized | 403 Forbidden | 404 Not Found | 500 Internal Server Error
- **Content:**
  ```json
  {
    "error": "Error description here",
    "code": "SpecificErrorCode",
    "help": "http://docs.api.com/errors/SpecificErrorCode"
  }
  ```

#### API Versioning

To anticipate future expansions and maintain backward compatibility, introducing API versioning is essential:

**Base Path**

Version 1: /api/v1/...
```

Note: The provided documentation outlines the complete API specification, including all endpoints, request/response structures, headers, and error handling, ensuring clarity and completeness for developers integrating with the system.Certainly! Let's continue with the documentation:

### Repricer API Specification

#### Real-time Notifications

#### WS /api/notifications/subscribe
- **Description:** Establishes a WebSocket connection for real-time notifications to the client, such as price updates or alerts.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Note:** Implementing WebSocket support addresses the need for real-time communication with clients, a feature implied but not detailed in earlier documentation.

#### Product Category Management

#### GET /api/categories
- **Description:** Retrieves a list of product categories, supporting enhanced product organization and searchability.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "categoryId": "C123",
      "name": "Electronics",
      "description": "Electronic gadgets and devices."
    }]
    ```

#### POST /api/categories
- **Description:** Adds a new product category to the system.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "name": "Home Appliances",
    "description": "Kitchen and home electronic appliances."
  }
  ```
- **Successful Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "message": "Category added successfully."
    }
    ```
#### Feature Flags

#### GET /api/features
- **Description:** Lists all feature flags, enabling or disabling specific functionality dynamically.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    [{
      "featureId": "F123",
      "name": "AdvancedAnalytics",
      "isEnabled": true
    }]
    ```

#### PUT /api/features/{featureId}
- **Description:** Toggles a feature flag on or off.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `featureId` - The ID of the feature to toggle.
- **Request Body:**
  ```json
  {
    "isEnabled": false
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Feature flag updated successfully."
    }
    ```

### Continued in the next message...#### Environmental Configuration

#### GET /api/config/environment
- **Description:** Retrieves the current environment configuration settings, including API keys, service endpoints, and feature toggles.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "environment": "production",
      "apiKeys": {
        "externalService": "abc123"
      },
      "featureToggles": {
        "newUI": true
      }
    }
    ```

#### POST /api/config/environment
- **Description:** Updates environment-specific configurations, allowing dynamic adjustments without system restarts.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **Request Body:**
  ```json
  {
    "featureToggles": {
      "newUI": false
    }
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Environment configuration updated successfully."
    }
    ```

#### User Preferences

#### GET /api/users/{userId}/preferences
- **Description:** Fetches user-specific preferences, enabling personalized application behavior.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `userId` - The ID of the user whose preferences are being retrieved.
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "userId": 1,
      "preferences": {
        "notificationSettings": {
          "email": true,
          "sms": false
        },
        "dashboardLayout": "compact"
      }
    }
    ```

#### PUT /api/users/{userId}/preferences
- **Description:** Updates preferences for a specific user.
- **Headers:** Required: Authorization: Bearer JWT_TOKEN_HERE
- **URL Parameters:** `userId` - The ID of the user whose preferences are being updated.
- **Request Body:**
  ```json
  {
    "preferences": {
      "dashboardLayout": "expanded"
    }
  }
  ```
- **Successful Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "User preferences updated successfully."
    }
    ```

#### Error Handling

#### General Error Response
- **Code:** 400 Bad Request | 401 Unauthorized | 403 Forbidden | 404 Not Found | 500 Internal Server Error
- **Content:**
  ```json
  {
    "error": "Error description here",
    "code": "SpecificErrorCode",
    "help": "http://docs.api.com/errors/SpecificErrorCode"
  }
  ```
#### API Versioning

To anticipate future expansions and maintain backward compatibility, introducing API versioning is essential:

Base Path

Version 1: /api/v1/...

Note: Versioning allows the API to evolve over time without breaking existing integrations, a critical aspect for long-term API strategy.

This concludes the continuation of the Repricer API Specification documentation. Let me know if you need further assistance or additional details!