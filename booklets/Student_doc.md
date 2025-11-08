# SYSTEM DESCRIPTION:

ByteRisto is a comprehensive internal restaurant management system designed to streamline operations across all aspects of restaurant service. Built with a modern microservices architecture, ByteRisto provides an all-in-one solution for menu management, order processing, and workflow coordination. The system includes menu management with complete control over menu items, pricing, availability, and nutritional information, order processing with full order lifecycle management from taking orders to payment processing, role-based access control for secure access management for different staff roles (Client, Waiter, Chef, Cashier, Manager), real-time communication through REST API for seamless inter-service communication, kitchen display with dedicated interface for kitchen staff to manage order preparation, and payment processing with integrated payment handling system supporting multiple payment methods (cash, card, other).

# USER STORIES:

1) As a customer, I want to view all restaurant menu items with descriptions and prices so that I can see the complete selection available
2) As a customer, I want to filter and view only appetizer menu items so that I can choose starters for my meal
3) As a customer, I want to filter and view only main course items so that I can select my primary course
4) As a customer, I want to filter and view only dessert menu items so that I can choose a sweet ending to my meal
5) As a customer, I want to filter and view only beverage options so that I can select drinks to accompany my meal
6) As a customer, I want to filter and view only side dish options so that I can complement my main course
7) As a customer, I want to see detailed information about each menu item including allergens and nutritional info so that I can make informed dietary choices
8) As a waiter, I want to create a new order for a specific table so that I can start recording customer requests
9) As a waiter, I want to add menu items with quantities to an order so that I can build the complete customer order
10) As a waiter, I want to add special cooking instructions for menu items so that the kitchen knows about customer preferences
11) As a waiter, I want to filter orders by status (confirmed, preparing, ready) so that I can track orders at different stages
12) As a waiter, I want to filter orders by table number so that I can focus on specific tables I'm serving
13) As a waiter, I want to see elapsed time and estimated completion for orders so that I can manage customer expectations
14) As a waiter, I want to add new items to the menu with complete details so that new dishes become available for ordering
15) As a waiter, I want to modify existing menu items' information and pricing so that menu information stays current and accurate
16) As a waiter, I want to mark menu items as available or unavailable so that customers cannot order unavailable items
17) As a waiter, I want to delete a menu item when requested by a manager so that the menu remains always updated
18) As a chef, I want to see all incoming orders in chronological order so that I can prioritize preparation efficiently
19) As a chef, I want to mark confirmed orders as "preparing" so that staff knows I've started cooking
20) As a chef, I want to change preparing orders to "ready" status so that waiters know food is ready for pickup
21) As a chef, I want to see complete order details including special instructions so that I can prepare dishes according to customer requests
22) As a chef, I want to filter orders by preparation status on kitchen display so that I can focus on orders at specific cooking stages
23) As a cashier, I want to see only orders with "ready" status awaiting payment so that I can process completed orders efficiently
24) As a cashier, I want to select cash as payment method and complete transactions so that I can handle cash payments from customers
25) As a cashier, I want to select card as payment method for transactions so that I can handle credit/debit card payments
26) As a cashier, I want to filter payment-ready orders by table number so that I can quickly find orders for specific customers
27) As a cashier, I want to see detailed order breakdown with total amounts so that I can verify charges before processing payment
28) As a manager, I want to view real-time order statistics and counts so that I can track restaurant performance
29) As a manager, I want to view all historical orders regardless of status and system data so that I can analyze past performance and trends
30) As a system user, I want to enable automatic refresh of order data so that I always see current information without manual updates
31) As a system user, I want to manually refresh order and menu data so that I can get the latest information on demand
32) As a system user, I want to access all system roles (customer, waiter, chef, cashier and manager) so that I can oversee all operational aspects


# CONTAINERS:

## CONTAINER_NAME: ByteRisto Backend Services

### DESCRIPTION: 
Container cluster comprising all backend microservices including databases, business logic services, and API gateway. This container orchestrates the complete backend infrastructure using Docker Compose with dedicated networking and persistent storage.

### USER STORIES:
1-32 (All user stories are satisfied by the backend services infrastructure)

### PORTS: 
- 3000: API Gateway
- 3001: Menu & Inventory Service
- 3002: Order Management Service
- 5432: PostgreSQL Menu Database
- 5433: PostgreSQL Orders Database

### PERSISTENCE EVALUATION
The system implements persistent data storage using Docker named volumes for both PostgreSQL databases:
- **postgres_menu_data**: Stores all menu items, categories, allergens, and nutritional information. Data persists across container restarts and rebuilds.
- **postgres_orders_data**: Stores all orders, order items, customer information, and transaction history. Data persists across container restarts and rebuilds.

Database persistence is managed through SQLAlchemy ORM with automatic schema creation on first startup. The databases use PostgreSQL 13 with full ACID compliance for data integrity.

### EXTERNAL SERVICES CONNECTIONS
- **Inter-service Communication**: All microservices communicate via HTTP REST APIs over the internal Docker bridge network (byteristo-network)
- **Menu-Order Integration**: Order Management Service connects to Menu Service (http://menu-inventory-service:3001) to validate menu item availability
- **Gateway Routing**: API Gateway proxies all external requests to appropriate backend services with service discovery

### MICROSERVICES:

#### MICROSERVICE: PostgreSQL Menu Database
- TYPE: database
- DESCRIPTION: PostgreSQL 13 database instance dedicated to storing menu inventory data including items, categories, allergens, and nutritional information
- PORTS: 5432 (exposed externally), 5432 (internal)
- TECHNOLOGICAL SPECIFICATION:
  - Database: PostgreSQL 13 (official Docker image)
  - Character Set: UTF-8
  - Connection Pool: Managed by SQLAlchemy
  - Environment Variables: POSTGRES_DB=menu_inventory_db, POSTGRES_USER=menu_user, POSTGRES_PASSWORD=menu_password
- SERVICE ARCHITECTURE: 
  - Standalone PostgreSQL instance with persistent volume mount
  - Accessed by Menu & Inventory Service via SQLAlchemy ORM
  - Network: byteristo-network (bridge driver)

- DB STRUCTURE:

	**_menu_items_**: | **_id_** (VARCHAR(36) PRIMARY KEY) | name (VARCHAR(100) NOT NULL) | description (TEXT) | price (FLOAT NOT NULL) | category (VARCHAR(20) NOT NULL) | is_available (BOOLEAN DEFAULT TRUE) | preparation_time (INTEGER NOT NULL) | allergens (TEXT - JSON) | nutritional_info (TEXT - JSON) | created_at (DATETIME) | updated_at (DATETIME)

#### MICROSERVICE: PostgreSQL Orders Database
- TYPE: database
- DESCRIPTION: PostgreSQL 13 database instance dedicated to storing order management data including orders, order items, customer information, and payment records
- PORTS: 5433 (exposed externally as 5433, internal 5432)
- TECHNOLOGICAL SPECIFICATION:
  - Database: PostgreSQL 13 (official Docker image)
  - Timezone: Europe/Rome (Italy)
  - Character Set: UTF-8
  - Connection Pool: Managed by SQLAlchemy
  - Environment Variables: POSTGRES_DB=orders_db, POSTGRES_USER=orders_user, POSTGRES_PASSWORD=orders_password
- SERVICE ARCHITECTURE: 
  - Standalone PostgreSQL instance with persistent volume mount
  - Accessed by Order Management Service via SQLAlchemy ORM
  - Network: byteristo-network (bridge driver)

- DB STRUCTURE:

	**_orders_**: | **_id_** (VARCHAR(36) PRIMARY KEY) | order_number (VARCHAR(50) UNIQUE NOT NULL) | table_number (INTEGER) | customer_name (VARCHAR(100)) | status (ENUM: pending, confirmed, preparing, ready, delivered, payed, cancelled) | order_type (ENUM: dine_in, takeout, delivery) | total_amount (NUMERIC(10,2)) | tax_amount (NUMERIC(10,2)) | discount_amount (NUMERIC(10,2)) | final_amount (NUMERIC(10,2)) | special_instructions (TEXT) | estimated_completion_time (DATETIME) | created_at (DATETIME) | updated_at (DATETIME)

	**_order_items_**: | **_id_** (VARCHAR(36) PRIMARY KEY) | order_id (VARCHAR(36) FOREIGN KEY) | menu_item_id (VARCHAR(36) NOT NULL) | menu_item_name (VARCHAR(100) NOT NULL) | quantity (INTEGER NOT NULL) | unit_price (NUMERIC(10,2) NOT NULL) | total_price (NUMERIC(10,2) NOT NULL) | special_instructions (TEXT) | status (ENUM: pending, preparing, ready, served, cancelled) | created_at (DATETIME) | updated_at (DATETIME)

#### MICROSERVICE: Menu & Inventory Service
- TYPE: backend
- DESCRIPTION: RESTful microservice responsible for managing restaurant menu items including CRUD operations, availability tracking, category management, allergen information, and nutritional data
- PORTS: 3001
- TECHNOLOGICAL SPECIFICATION:
  - Framework: Flask 2.3.3 (Python 3.11)
  - ORM: SQLAlchemy 3.0.5
  - Database Driver: psycopg2-binary 2.9.7
  - Validation: Marshmallow 3.20.1
  - CORS: Flask-CORS 4.0.0
  - Container: Python 3.11-slim Docker image
  - Environment: Development mode with auto-reload
- SERVICE ARCHITECTURE: 
  - Blueprint-based routing (/api/menu)
  - PostgreSQL database connection via SQLAlchemy
  - JSON serialization for allergens and nutritional info
  - RESTful API design with consistent response format
  - Error handling with appropriate HTTP status codes
  - UUID-based primary keys for menu items

- ENDPOINTS:
		
	| HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
	| GET | /api/menu | Get all menu items with optional filtering by category and availability | 1, 2, 3, 4, 5, 6 |
	| GET | /api/menu/available | Get only available menu items for ordering | 8, 9 |
	| GET | /api/menu/{menu_id} | Get specific menu item by ID with full details | 7 |
	| POST | /api/menu | Create new menu item with validation | 14 |
	| PUT | /api/menu/{menu_id} | Update existing menu item information | 15, 16 |
	| DELETE | /api/menu/{menu_id} | Delete menu item from system | 17 |

#### MICROSERVICE: Order Management Service
- TYPE: backend
- DESCRIPTION: RESTful microservice responsible for managing the complete order lifecycle including order creation, status tracking, item management, kitchen workflow, and payment processing
- PORTS: 3002
- TECHNOLOGICAL SPECIFICATION:
  - Framework: Flask 2.3.3 (Python 3.11)
  - ORM: SQLAlchemy 3.0.5
  - Database Driver: psycopg2-binary 2.9.7
  - Validation: Marshmallow 3.20.1
  - HTTP Client: requests 2.31.0
  - Timezone: pytz (Europe/Rome)
  - CORS: Flask-CORS 4.0.0
  - Container: Python 3.11-slim Docker image
- SERVICE ARCHITECTURE: 
  - Blueprint-based routing (/api/orders)
  - PostgreSQL database with foreign key relationships
  - Integration with Menu Service for item validation
  - Automatic order number generation (ORD-YYYYMMDD-XXXX)
  - Estimated completion time calculation
  - Italian timezone support for timestamps
  - Cascade delete for order items

- ENDPOINTS:
		
	| HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
	| GET | /api/orders | Get all orders with filtering by status, table_number, order_type | 11, 12, 18, 22, 23, 26, 28, 29 |
	| GET | /api/orders/{order_id} | Get specific order details with items | 21, 27 |
	| POST | /api/orders | Create new order with items and validation | 8, 9, 10 |
	| PUT | /api/orders/{order_id}/status | Update order status (confirmed → preparing → ready → delivered/payed) | 19, 20 |
	| PUT | /api/orders/{order_id}/items/{item_id}/status | Update individual order item status | N/A (removed feature) |
	| POST | /api/orders/{order_id}/pay | Process payment and mark order as paid | 24, 25 |
	| DELETE | /api/orders/{order_id} | Delete order (only pending/cancelled) | N/A |

#### MICROSERVICE: API Gateway
- TYPE: backend
- DESCRIPTION: Central API gateway that serves as the single entry point for all client requests, routing them to appropriate backend microservices and providing unified error handling
- PORTS: 3000
- TECHNOLOGICAL SPECIFICATION:
  - Framework: Flask 2.3.3 (Python 3.11)
  - HTTP Client: requests 2.31.0
  - CORS: Flask-CORS 4.0.0
  - Request Timeout: 30 seconds
  - Container: Python 3.11-slim Docker image
  - Environment Variables: MENU_SERVICE_URL, ORDER_SERVICE_URL
- SERVICE ARCHITECTURE: 
  - Request proxy pattern with service discovery
  - Blueprint-based routing (/api/*)
  - Automatic HTTP method forwarding (GET, POST, PUT, DELETE)
  - Unified error responses (503 for service unavailable)
  - Query parameter and JSON body forwarding
  - Service health monitoring capability

- ENDPOINTS:
		
	| HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
	| GET | /api/menu | Proxy to Menu Service - Get all menu items | 1, 2, 3, 4, 5, 6 |
	| GET | /api/menu/available | Proxy to Menu Service - Get available items | 8, 9 |
	| GET | /api/menu/{menu_id} | Proxy to Menu Service - Get menu item details | 7 |
	| POST | /api/menu | Proxy to Menu Service - Create menu item | 14 |
	| PUT | /api/menu/{menu_id} | Proxy to Menu Service - Update menu item | 15, 16 |
	| DELETE | /api/menu/{menu_id} | Proxy to Menu Service - Delete menu item | 17 |
	| GET | /api/orders | Proxy to Order Service - Get all orders | 11, 12, 18, 22, 23, 26, 28, 29 |
	| GET | /api/orders/{order_id} | Proxy to Order Service - Get order details | 21, 27 |
	| POST | /api/orders | Proxy to Order Service - Create order | 8, 9, 10 |
	| PUT | /api/orders/{order_id}/status | Proxy to Order Service - Update order status | 19, 20 |
	| PUT | /api/orders/{order_id}/items/{item_id}/status | Proxy to Order Service - Update item status | N/A |


## CONTAINER_NAME: ByteRisto Frontend

### DESCRIPTION: 
React-based web application providing the user interface for all restaurant operations. Served through Nginx web server in production mode with role-based access control and real-time data updates.

### USER STORIES:
1-32 (All user stories have corresponding UI components)

### PORTS: 
8080 (external) → 80 (internal Nginx)

### PERSISTENCE EVALUATION
The frontend is stateless and does not persist data locally. All data is managed through API calls to the backend services. User role selection is maintained in component state during the session but is not persisted across page refreshes.

### EXTERNAL SERVICES CONNECTIONS
- **API Gateway**: All HTTP requests are sent to http://localhost:3000/api (configurable)
- **Real-time Updates**: Automatic polling every 30 seconds for order and kitchen displays
- **CORS**: Enabled for cross-origin requests to backend services

### MICROSERVICES:

#### MICROSERVICE: React Web Application
- TYPE: frontend
- DESCRIPTION: Single Page Application (SPA) built with React 18.2.0 providing role-based interfaces for all restaurant staff roles with real-time data synchronization
- PORTS: 80 (Nginx serves on port 80, exposed as 8080)
- TECHNOLOGICAL SPECIFICATION:
  - Framework: React 18.2.0
  - Build Tool: react-scripts 5.0.1
  - HTTP Client: Fetch API (native)
  - Styling: Custom CSS with glass-morphism design
  - Multi-stage Build: Node 22-alpine (build) + Nginx alpine (serve)
  - Production Server: Nginx alpine
- SERVICE ARCHITECTURE: 
  - Component-based architecture with functional components
  - React Hooks for state management (useState, useEffect)
  - API abstraction layer (menuApi.js, orderApi.js)
  - Role-based component rendering
  - Tab-based navigation system
  - Responsive glassmorphism UI design
  - Auto-refresh capability for real-time updates

- PAGES:

	| Name | Description | Related Microservice | User Stories |
	| ---- | ----------- | -------------------- | ------------ |
	| Menu Display | View all menu items with category filtering, search, and detailed item information including allergens and nutritional data | Menu Service | 1, 2, 3, 4, 5, 6, 7 |
	| Menu Management | Admin interface for CRUD operations on menu items, availability toggling, and bulk management | Menu Service | 14, 15, 16, 17 |
	| Order Taking | Interface for creating new orders with item selection, quantity, special instructions, and table assignment | Order Service, Menu Service | 8, 9, 10, 30, 31 |
	| Active Orders | Comprehensive order management dashboard with status filtering, table filtering, manual refresh, and order status updates | Order Service | 11, 12, 13, 28, 29, 30, 31 |
	| Kitchen Display | Chef-focused interface showing active orders in chronological order with status updates and special instructions highlighting | Order Service | 18, 19, 20, 21, 22, 30, 31 |
	| Payments | Cashier interface for processing payments with order filtering, payment method selection (cash/card), and transaction completion | Order Service | 23, 24, 25, 26, 27, 30, 31 |
	| Role Selector | Initial role selection screen allowing users to choose their operational role (Client, Waiter, Chef, Cashier, Manager) | N/A | 32 |
