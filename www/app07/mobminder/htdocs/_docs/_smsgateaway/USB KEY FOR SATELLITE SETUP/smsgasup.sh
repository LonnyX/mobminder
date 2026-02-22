echo "welcome to SMS gateaway setup bash"
echo "."

echo "stopping current smsbox.service"
	sudo systemctl stop smsbox.service
	echo "."
	sleep 1


echo "setting up Wi-FI"
	sudo rm /etc/wpa_supplicant/wpa_supplicant.conf
	sudo cp /media/pi/SBX/rpiconfig/wpa_supplicant.conf /etc/wpa_supplicant/wpa_supplicant.conf
	sudo chmod +666 /etc/wpa_supplicant/wpa_supplicant.conf
	wpa_cli -i wlan0 reconfigure
	echo "."
	sleep 6

echo "copying background mobminder logo to /Pictures"
	sudo cp /media/pi/SBX/Desktop/mobbg_2.jpg /home/pi/Pictures
	echo "."
	sleep 2


echo "copying /boot/config.txt file"
	# the following command adds a line in the config.txt, I changed my strategy and I copy a full config.txt from the usb to the /boot directory
	#	CLINE='#mobminder smsgateaway'
	#	CFILE='/boot/config.txt'
	# sudo grep -qxF "$CLINE" "$CFILE" || echo "" | sudo tee --append "$CFILE"
	# sudo grep -qxF "$CLINE" "$CFILE" || echo "$CLINE" | sudo tee --append "$CFILE"
	
	# the following config.txt file has 
	#  - uart enabled, 
	#  - processor clock to 500MHz, 
	#  - hdmi hotplug

	sudo cp /media/pi/SBX/rpiconfig/config.txt /boot
	sudo chmod 755 /boot/config.txt
	echo "."
	sleep 2



echo "copying /boot/cmdline.txt file"
	
	#	CLINE='enable_uart=1'
	# sudo grep -qxF "$CLINE" "$CFILE" || echo "$CLINE" | sudo tee --append "$CFILE"
	
	echo "don't forget to edit /boot/cmdline.txt, this setup cannot be realised automatically"
	echo " - add maxcpus=2"
	echo " - remove console=serial0,115200"
	echo " - reboot"
	echo "don't forget to edit /boot/cmdline.txt"
	# sudo cp /media/pi/SBX/rpiconfig/cmdline.txt /boot
	# sudo chmod 755 /boot/cmdline.txt
	echo "."
	sleep 2


echo "copying /etc/rc.local file"

	# The script /etc/rc.local is for use by the system administrator. 
	# It is traditionally executed after all the normal system services are started, 
	# at the end of the process of switching to a multiuser runlevel. 
	# You might use it to start a custom service.
	sudo cp /media/pi/SBX/rpiconfig/rc.local /etc/rc.local
	sudo chmod 755 /etc/rc.local
	echo "."
	sleep 2


echo "copying csharp smsbox files"
	sudo rm -r /smsbox
	sudo mkdir -p /smsbox
	sudo cp -a /media/pi/SBX/smsbox/. /smsbox/
	sudo chmod 755 /smsbox/bin/python/smspower.py
	sudo chmod 755 /smsbox/bin/scriptrelease.sh
	echo "."
	sleep 2


echo "setting up service"
	sudo cp /media/pi/SBX/rpiconfig/smsbox.service /lib/systemd/system
	sudo chmod +666 /lib/systemd/system/smsbox.service
	sudo systemctl enable smsbox.service
	# next line we don't execute, the daemon will restart after reboot
	# sudo systemctl daemon-reload
	echo "."
	sleep 2




# the following commands need Wi-Fi to be up, that is why each step has a sleep


echo "installing python-gsmmodem"
	pip install -qq python-gsmmodem
	echo "."
	sleep 1


echo "installing mono"
	sudo apt-get -qq install mono-runtime > /dev/null
	sudo apt-get -qq install mono-mcs > /dev/null
	sudo apt-get -qq -o=Dpkg::Use-Pty=0 install mono-runtime
	sudo apt-get -qq -o=Dpkg::Use-Pty=0 install mono-mcs
	echo "."
	sleep 1

echo "compiling smsbox exe"
	# this line is commented has we only need to copy the smsbox.exe file, already compiled
	# note that it needs to be compiled a first time on one satellite
	mcs -debug -out:/smsbox/bin/smsbox.exe -main:SmsBox.Program /smsbox/source/*.cs
	echo "."
	sleep 1



	echo "."
echo "edit /boot/cmdline, and change the nickname in /bin/sms.conf then please reboot"
	# sleep 3
	# sudo reboot





