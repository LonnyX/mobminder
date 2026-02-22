# Docker Setup

## Démarrage rapide

```bash
./docker-start.sh
# ou
make build && make up
```

## Applications

- **app06** (SMS Gateway): http://localhost:8081
- **elearning**: http://localhost:8082
- **mobcom**: http://localhost:8083
- **contracting**: http://localhost:8084
- **mobminder**: http://localhost:8085
- **booking**: http://localhost:8086
- **MySQL**: localhost:3306

## Architecture

- Nginx (reverse proxy)
- 6 containers PHP-FPM (PHP 7.4.27)
- MySQL 5.7.17

## Configuration DB dans vos apps

Ajoutez en début de fichier :

```php
require_once(__DIR__ . '/docker_db_config.php');
$dbio = get_docker_mysqli('smsgateaway');
```

Ou utilisez les variables d'environnement :

```php
$host = getenv('DB_HOST') ?: 'localhost';
$dbio = new mysqli($host, 'queuing_daemon', '1970', 'smsgateaway');
```

## Commandes utiles

```bash
make up              # Démarrer
make down            # Arrêter
make logs            # Voir logs
make logs-app06      # Logs spécifique
make restart         # Redémarrer
make mysql           # Console MySQL
make backup-db       # Backup DB
make health          # Health check
```

## Configuration

Variables dans `.env` :
- Ports applications (8081-8086)
- Credentials MySQL
- Paramètres PHP

## Troubleshooting

```bash
# Logs
docker-compose logs [service]

# Status
docker-compose ps

# Reconstruire
docker-compose build --no-cache
docker-compose up -d
```
