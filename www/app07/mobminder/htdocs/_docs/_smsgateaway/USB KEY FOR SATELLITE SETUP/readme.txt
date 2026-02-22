
0. installing rasbian on a SD card: 

	diskutil list  # identify the destination SD card
	diskutil unmountDisk /dev/disk2
	sudo dd bs=1m if=/mobfiles/raspbian.img of=/dev/disk2 conv=sync
	sudo diskutil eject /dev/disk2


1. first boot
	When booting up the first time on a freshly copied raspbian .img,
	you will need to do the following:
	- select your country
	- skip wifi and updates
	- reboot
	- change keyboard settings (Belgian/Belgian)

	Now you are ready to start a console and run the smsgasup.sh 


2. installing system settings and executable files

	smsgasup.sh can not be executed from the usb for security reasons.
	You need to copy it first to a tmp dir

	$ cp /media/pi/INTENSO/SMSGA/smsgasup.sh /var/tmp

	then give it an executable form

	$ cd /var/tmp
	$ chmod u+x smsgasup.sh

	and execute it thereafter

	$ ./smsgasup.sh

	That's it. 
	You can then right click the desktop and select the Mobminder 
	background from /home/pi/Pictures


Notes:
	Lower power consumption and processor temperature
	this is the article I based my work on : https://raspberrypi.org/forums/viewtopic.php?t=152692

	# to measure actual processor freq, use $ vcgencmd measure_clock arm
	# to measure actual processor voltage, use $ vcgencmd measure_volts
	# to measure actual processor temperature, use $ vcgencmd measure_temp

