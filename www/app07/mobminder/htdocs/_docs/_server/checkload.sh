#! /bin/bash
echo "------  G L O B A L     S E R V E R    L O A D    C H E C K  --------"

echo " "
echo " "
echo "-- NETSTAT --"
echo " "
echo "Netsat on port 80:"
netstat -tn 2>/dev/null | grep :80  | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort
echo " "
echo "Netsat on port 443:"
netstat -tn 2>/dev/null | grep :443 | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort
echo " "
echo "Netsat by status:"
netstat -nat | awk '{print $6}' | sort | uniq -c | sort -n



echo " "
echo " "
echo "-- PROCESSES --"
echo " "
echo "Apache processes average size:"
ps aux | grep 'apache2' | awk '{print $6/1024;}' | awk '{avg += ($1 - avg) / NR;} END {print " AVERAGE " avg " MB through " NR " processes";}'
echo " "
echo "Apache processes total size:"
ps aux | grep 'apache2' | awk '{print $6/1024;}' | awk '{total += ($1);} END {print " TOTAL " total " MB in " NR " processes";}'
echo " "
echo "MySQL processes size:"
ps aux | grep 'mysql' | awk '{print $6/1024 " MB";}'



echo " "
echo " "
echo "-- RAM USAGE --"
echo " "
echo "Top RAM consumers:"
ps -e -orss=,args= | sort -nr | head | awk '{print $1/1024 " MB in " $2;}'

