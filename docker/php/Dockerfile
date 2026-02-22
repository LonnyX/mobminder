FROM php:7.4.27-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    curl \
    zip \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd \
    mysqli \
    pdo_mysql \
    mbstring \
    zip \
    exif \
    pcntl \
    bcmath \
    soap \
    && docker-php-ext-enable mysqli pdo_mysql

# Copy custom PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini
COPY www.conf /usr/local/etc/php-fpm.d/www.conf

# Install socat for MySQL socket proxy
RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Create entrypoint script to proxy MySQL socket
RUN echo '#!/bin/sh\n\
# Create MySQL socket directory\n\
mkdir -p /var/run/mysqld\n\
\n\
# Start socat to proxy Unix socket to TCP\n\
socat UNIX-LISTEN:/var/run/mysqld/mysqld.sock,fork,reuseaddr,unlink-early,mode=777 TCP:mysql:3306 &\n\
\n\
exec "$@"' > /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

# Set working directory
WORKDIR /var/www/html

# Expose port 9000 for PHP-FPM
EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["php-fpm"]
