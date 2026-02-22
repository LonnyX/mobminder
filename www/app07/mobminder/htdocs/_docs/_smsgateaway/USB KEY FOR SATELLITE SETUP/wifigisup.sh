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
	sleep 10


	echo "."
echo "Looks like we've done :)"
	sleep 3
	sudo reboot





