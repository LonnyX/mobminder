#! /bin/bash

export BACKUP_DIR=/home/dropbox/Dropbox/backup/app01/

[ -d /mnt/backup ] || 	mkdir /mnt/backup

for f in sql-binaries sql-dump system website
do
  [ -d ${BACKUP_DIR}/$f ] || mkdir ${BACKUP_DIR}/$f
done


# backup mysql
#

echo "select 1" | mysql 1> /dev/null
if [ $? -eq 0 ]
then
	mk-parallel-dump --base-dir ${BACKUP_DIR}/sql-dump h=localhost > /dev/null
	mk-show-grants > ${BACKUP_DIR}/sql-dump/users.sql

	cat << EOF > /tmp/.backup.sql
FLUSH TABLES WITH READ LOCK;
\! lvcreate -L1G -s -n srvbackup /dev/vgAPP01/srv
SHOW MASTER STATUS;
UNLOCK TABLES;
EOF
	mysql < /tmp/.backup.sql > /dev/null 2>&1
	mount /dev/vgAPP01/srvbackup /mnt/backup
	cd /mnt/backup/mysql
	[ $? -eq 0 ] && cp -rp * ${BACKUP_DIR}/sql-binaries/.
	cd /tmp
	umount  /mnt/backup
	lvremove -f /dev/vgAPP01/srvbackup > /dev/null
	/bin/rm /tmp/.backup.sql
fi

cd /srv/web/ && tar -zcf  $BACKUP_DIR/website/be.mobminder.com.tar.gz be.mobminder.com

cd $BACKUP_DIR/system
ps faux --cols 1000 > ps-faux.txt
ip route > ip-route.txt
ip addr > ip-addr.txt
mount > mount.txt
free -m > free.txt
df -h > df-h.txt
df -i > df-inodes.txt
iptables-save > iptables-save.txt
dpkg --get-selections > packages-installed.txt

cd / && tar -zcf $BACKUP_DIR/system/etc.tar.gz etc
date > $BACKUP_DIR/lastbakcup.txt

chown -R dropbox: /home/dropbox/Dropbox
