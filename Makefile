.PHONY: help build up down restart logs ps shell clean health

# Default target
help:
	@echo "Mobi Docker Management"
	@echo ""
	@echo "Usage:"
	@echo "  make build          Build all Docker images"
	@echo "  make up             Start all services"
	@echo "  make down           Stop all services"
	@echo "  make restart        Restart all services"
	@echo "  make logs           View logs (all services)"
	@echo "  make ps             Show container status"
	@echo "  make shell          Access PHP app06 shell"
	@echo "  make mysql          Access MySQL console"
	@echo "  make health         Run health check"
	@echo "  make clean          Stop and remove all containers, networks, volumes"
	@echo ""
	@echo "Service-specific commands:"
	@echo "  make logs-nginx     View Nginx logs"
	@echo "  make logs-app06     View app06 logs"
	@echo "  make restart-nginx  Restart Nginx"
	@echo ""

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Start all services
up:
	@echo "Starting all services..."
	docker-compose up -d
	@echo ""
	@echo "Services are now running!"
	@echo "  SMS Gateway: http://localhost:8081"
	@echo "  E-learning:  http://localhost:8082"
	@echo "  Mobcom:      http://localhost:8083"
	@echo "  Contracting: http://localhost:8084"
	@echo "  Mobminder:   http://localhost:8085"
	@echo "  Booking:     http://localhost:8086"

# Start services with logs
up-logs:
	docker-compose up

# Stop all services
down:
	@echo "Stopping all services..."
	docker-compose down

# Restart all services
restart:
	@echo "Restarting all services..."
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

# View logs for specific services
logs-nginx:
	docker-compose logs -f nginx

logs-app06:
	docker-compose logs -f php-app06

logs-mysql:
	docker-compose logs -f mysql

# Show container status
ps:
	docker-compose ps

# Access PHP container shell
shell:
	docker-compose exec php-app06 bash

# Access specific service shells
shell-elearning:
	docker-compose exec php-elearning bash

shell-nginx:
	docker-compose exec nginx sh

# Access MySQL console
mysql:
	docker-compose exec mysql mysql -u queuing_daemon -p1970

mysql-root:
	docker-compose exec mysql mysql -u root -proot

# Restart specific services
restart-nginx:
	docker-compose restart nginx

restart-app06:
	docker-compose restart php-app06

restart-mysql:
	docker-compose restart mysql

# Run health check
health:
	@bash docker-health-check.sh

# Clean everything (WARNING: removes volumes and data!)
clean:
	@echo "⚠️  WARNING: This will remove all containers, networks, and volumes!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo "Cleaned!"; \
	fi

# Stop and remove containers only (keep volumes)
clean-soft:
	docker-compose down

# Rebuild and restart everything
rebuild:
	@echo "Rebuilding and restarting..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Database backup
backup-db:
	@echo "Backing up databases..."
	@mkdir -p backups
	docker-compose exec mysql mysqldump -u root -proot --all-databases > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup saved to backups/"

# Database restore (usage: make restore-db FILE=backup.sql)
restore-db:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make restore-db FILE=backup.sql"; \
		exit 1; \
	fi
	docker-compose exec -T mysql mysql -u root -proot < $(FILE)

# View PHP info
phpinfo:
	docker-compose exec php-app06 php -i

# View PHP version
phpversion:
	docker-compose exec php-app06 php -v

# Install/update composer dependencies (if needed)
composer-install:
	docker-compose exec php-app06 composer install

# Run PHP linter
lint:
	docker-compose exec php-app06 find /var/www/html/www -name "*.php" -exec php -l {} \;

# Check Nginx configuration
nginx-test:
	docker-compose exec nginx nginx -t

# Reload Nginx configuration
nginx-reload:
	docker-compose exec nginx nginx -s reload

# Show disk usage
disk-usage:
	docker system df

# Prune unused Docker resources
prune:
	docker system prune -f
