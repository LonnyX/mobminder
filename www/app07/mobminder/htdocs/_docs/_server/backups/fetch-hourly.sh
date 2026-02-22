#!/bin/bash

# This script is cron called on hour 08

SRCE_DIR=/home/fetch-slave/tens
DEST_DIR=/home/fetch-slave/hourly

# copy from PRODUCTION server (using SSH commande SSH copy) 
#   -c arcfour switches the cypher to an encryption mode that makes the all cp process much faster
#
scp -c arcfour mysql-slave@app01.mobminder.com:*.gz $DEST_DIR

# delete files older than 5 days
# find $DEST_DIR -mmin +70 -name "*.gz" -delete 
find $DEST_DIR -mmin +7200 -name "*.gz" -delete


