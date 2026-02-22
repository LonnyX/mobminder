#! /bin/bash

#TMP_BACKUP_FILE=/tmp/slavebackup
#BACKUP_DIR=/home/mysql-slave
#mysqldump --lock-all-tables --add-drop-table --add-locks --skip-comments --socket=/var/run/mysqld-slave/mysqld.sock mobminder > $TMP_BACKUP_FILE
#gzip $TMP_BACKUP_FILE
#mv $TMP_BACKUP_FILE.gz $BACKUP_DIR/$(date +%Y-%m-%d_%H:%M).gz
#chown mysql-slave:root -R  /home/mysql-slave
#find $BACKUP_DIR -mmin +65 -name "*.gz" -delete


# This script is cron called on hour 02, 12, 22, 32, 42, 52
TMP_BACKUP_FILE=/tmp/slavebackup
BACKUP_DIR=/home/mysql-slave
NOW=$(date +%Y-%m-%d_%H:%M)


# We generate a new backup, and zip it up
# This operation takes during a moment, an equivalent of 2 gigs storage space
# When the dump is g-zipped, it takes 300 to 400 megs (observation in 2015)
mysqldump --lock-all-tables --add-drop-table --add-locks --skip-comments --socket=/var/run/mysqld-slave/mysqld.sock mobminder > $TMP_BACKUP_FILE
gzip $TMP_BACKUP_FILE

# we move that backup file to the directory where it can be fetched by the SPARE server
rm $BACKUP_DIR/*.gz  # never have more than one file here (new way 1*)
mv $TMP_BACKUP_FILE.gz $BACKUP_DIR/Mob_backup_$NOW.gz

# we set the ownership of the file to root so we can delete the file
chown mysql-slave:root -R  /home/mysql-slave

# by security, we delete any file older than 130 minutes that the SPARE server would not have copied (in case it stopped)
# (this is the older way of doing 1*)
# find $BACKUP_DIR -mmin +55 -name "*.gz" -delete  
