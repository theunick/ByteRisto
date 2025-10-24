# 🍕 ByteRisto

## Restaurant Management System

ByteRisto is a modern microservices-based restaurant management system built with Flask and React.

### Architecture

- **API Gateway** (Port 3000) - Central routing and request handling
- **Menu Service** (Port 3001) - Menu and inventory management
- **Order Service** (Port 3002) - Order processing and management
- **Frontend** (Port 8080) - React web application

### Technology Stack

**Backend:**
- Python 3.11
- Flask Framework
- PostgreSQL 13
- Docker & Docker Compose

**Frontend:**
- React 18.2.0
- Nginx (production server)

### Quick Start

```bash
# Start all services using management script
./scripts/byteristo.sh start

# Check service health
./scripts/byteristo.sh health

# View logs
./scripts/byteristo.sh logs

# Stop all services
./scripts/byteristo.sh stop
```

### Alternative: Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

### Development

#### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for frontend development)

#### Project Structure
```
ByteRisto/
├── services/
│   ├── api-gateway/
│   ├── menu-inventory/
│   └── order-management/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── scripts/
│   └── byteristo.sh
├── docker-compose.yml
└── README.md
```

### Service URLs

- **Frontend**: http://localhost:8080
- **API Gateway**: http://localhost:3000
- **Menu Service**: http://localhost:3001
- **Order Management**: http://localhost:3002
- **Menu DB**: localhost:5432
- **Orders DB**: localhost:5433

### Management Script

The `byteristo.sh` script provides convenient commands:

- `start` - Start all services
- `stop` - Stop all services
- `restart` - Restart all services
- `health` - Check health of all services
- `logs [service]` - View logs
- `setup` - Setup development environment

### Version

Current: **v1.0.0** - Frontend MVP with React application