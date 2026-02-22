#! /bin/bash

export PRODUCTION_COPY="/home/pascal/to_production"
export PROD_DIR="/var/www/mobminder/htdocs"
export PREVIOUS_DIR="/home/pascal/www.previous"

'rm' -Rf $PREVIOUS_DIR/*
'cp' -Rf $PROD_DIR/* $PREVIOUS_DIR
'rm' -Rf $PROD_DIR/*
'cp' -Rf $PRODUCTION_COPY/* $PROD_DIR/.
chown -R www-data:www-data $PROD_DIR
'echo' "reload ok"
