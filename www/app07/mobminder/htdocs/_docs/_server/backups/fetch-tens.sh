#!/bin/bash

# This script is cron called on hour 09, 19, 29, 39, 49, 59, (suspended as transfer rate was too slow ... )

DEST_DIR=/home/fetch-slave/tens

# scp mysql-slave@app01.mobminder.com:*.gz $DEST_DIR
# ssh mysql-slave@app01.mobminder.com "rm /home/mysql-slave/*.gz"

# delete files older than 3 hours
# find $DEST_DIR -mmin +180 -name "*.gz" -delete 
# find $DEST_DIR -mmin +35 -name "*.gz" -delete # used for test purpose

