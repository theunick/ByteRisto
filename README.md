# 🍕 ByteRisto

## Restaurant Management System

ByteRisto is a modern microservices-based restaurant management system built with Flask and React.

### Architecture

- **API Gateway** (Port 3000) - Central routing and request handling
- **Menu Service** (Port 3001) - Menu and inventory management
- **Order Service** (Port 3002) - Order processing and management

### Technology Stack

**Backend:**
- Python 3.11
- Flask Framework
- PostgreSQL
- Docker & Docker Compose

**Frontend:**
- React (coming soon)

### Quick Start

```bash
# Start all services
docker-compose up -d

# Check service health
curl http://localhost:3000/health

# Stop all services
docker-compose down
```

### Development

#### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)

#### Project Structure
```
ByteRisto/
├── services/
│   ├── api-gateway/
│   ├── menu-inventory/
│   └── order-management/
├── docker-compose.yml
└── README.md
```

### Service URLs

- API Gateway: http://localhost:3000
- Menu Service: http://localhost:3001
- Order Management: http://localhost:3002

### Version

Current: v0.3.0 - Backend service refactoring to Flask framework