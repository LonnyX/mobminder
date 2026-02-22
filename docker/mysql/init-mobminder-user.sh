#!/bin/bash
# MySQL initialization script to create mobminder user

mysql -u root -p${MYSQL_ROOT_PASSWORD} <<-EOSQL
    CREATE USER IF NOT EXISTS 'mobminder'@'%' IDENTIFIED BY 'tgx23PiQ';
    GRANT ALL PRIVILEGES ON mobminder.* TO 'mobminder'@'%';
    FLUSH PRIVILEGES;
EOSQL

echo "User mobminder created successfully"
