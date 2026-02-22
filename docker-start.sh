#!/bin/bash

# Mobi Docker Quick Start Script
# This script helps you quickly start the Docker environment

set -e

echo "================================================"
echo "  Mobi Multi-Application Docker Setup"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ .env file not found!${NC}"
    echo "Creating default .env file..."
    cat > .env <<EOF
# MySQL Configuration
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=smsgateaway
MYSQL_USER=queuing_daemon
MYSQL_PASSWORD=1970

# Application Ports
APP06_PORT=8081
ELEARNING_PORT=8082
MOBCOM_PORT=8083
CONTRACTING_PORT=8084
MOBMINDER_PORT=8085
BOOKING_PORT=8086

# PHP Configuration
PHP_MEMORY_LIMIT=256M
PHP_MAX_EXECUTION_TIME=6
PHP_UPLOAD_MAX_FILESIZE=40M
PHP_POST_MAX_SIZE=40M

# Application Timezone
TZ=Europe/Brussels
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
fi

echo ""
echo "================================================"
echo "  Building Docker Images"
echo "================================================"
echo ""

docker-compose build

echo ""
echo "================================================"
echo "  Starting Services"
echo "================================================"
echo ""

docker-compose up -d

echo ""
echo "================================================"
echo "  Checking Services Status"
echo "================================================"
echo ""

sleep 5
docker-compose ps

echo ""
echo "================================================"
echo "  🎉 Setup Complete!"
echo "================================================"
echo ""
echo "Your applications are now running:"
echo ""
echo -e "  ${GREEN}SMS Gateway (app06):${NC}    http://localhost:8081"
echo -e "  ${GREEN}E-learning:${NC}             http://localhost:8082"
echo -e "  ${GREEN}Mobcom:${NC}                 http://localhost:8083"
echo -e "  ${GREEN}Contracting:${NC}            http://localhost:8084"
echo -e "  ${GREEN}Mobminder:${NC}              http://localhost:8085"
echo -e "  ${GREEN}Booking:${NC}                http://localhost:8086"
echo ""
echo -e "  ${GREEN}MySQL:${NC}                  localhost:3306"
echo ""
echo "================================================"
echo "  Useful Commands"
echo "================================================"
echo ""
echo "  View logs:           docker-compose logs -f"
echo "  Stop services:       docker-compose down"
echo "  Restart service:     docker-compose restart [service-name]"
echo "  Access container:    docker-compose exec [service-name] bash"
echo ""
echo "For more information, see DOCKER_README.md"
echo ""
