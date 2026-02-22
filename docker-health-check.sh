#!/bin/bash

# Docker Health Check Script
# Verifies that all services are running correctly

echo "🔍 Checking Docker Environment Health..."
echo ""

# Check Docker daemon
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running"
    exit 1
fi
echo "✅ Docker daemon is running"

# Check if containers are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ No containers are running"
    echo "Run: docker-compose up -d"
    exit 1
fi
echo "✅ Containers are running"

# Check each service
echo ""
echo "Checking individual services..."
echo ""

services=("nginx" "mysql" "php-app06" "php-elearning" "php-mobcom" "php-contracting" "php-mobminder" "php-booking")

for service in "${services[@]}"; do
    if docker-compose ps | grep "$service" | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
    fi
done

# Check MySQL connection
echo ""
echo "Testing MySQL connection..."
if docker-compose exec -T mysql mysql -u queuing_daemon -p1970 -e "SELECT 1" > /dev/null 2>&1; then
    echo "✅ MySQL connection successful"
else
    echo "❌ MySQL connection failed"
fi

# Check Nginx
echo ""
echo "Testing Nginx configuration..."
if docker-compose exec nginx nginx -t > /dev/null 2>&1; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
fi

# Check PHP
echo ""
echo "Testing PHP-FPM..."
if docker-compose exec php-app06 php -v > /dev/null 2>&1; then
    PHP_VERSION=$(docker-compose exec php-app06 php -v | head -n 1)
    echo "✅ PHP is working: $PHP_VERSION"
else
    echo "❌ PHP is not responding"
fi

# Check port availability
echo ""
echo "Checking port accessibility..."
ports=(8081 8082 8083 8084 8085 8086 3306)
for port in "${ports[@]}"; do
    if nc -z localhost $port 2>/dev/null; then
        echo "✅ Port $port is accessible"
    else
        echo "⚠️  Port $port is not accessible (may be normal if not exposed)"
    fi
done

echo ""
echo "Health check complete!"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To restart: docker-compose restart [service-name]"
