
Config files needed for the smsbox to run:

1. wpa_supplicant.conf
	contains the undernet Wifi connection info

2. config.txt
	contains following settings
	- processor clock lmit to 350MHz (lower the consumption), minimum 200MHz
	- hdmi hotplug (allows to pass hdmi cable from one satellite to another, easily)
	- enable UART 

3 cmdline.txt
	the command "console=serial0,115200" has been removed so to disable console log to UART
	the command maxcpus=2 has been added, so only 2 cores out of 2 are running (limit power consumption)
	!! cmdline.txt cannot averwrite the existing, because it contains a cpu id that match only the native rpi !!

4 sms.service 
	contains the data needed to start smsbox.exe as a service


All 4 files are copied automatically by smsgasup.sh (see ../)

Notes: 

# to measure actual processor freq, use 	$ vcgencmd measure_clock arm
# to measure actual processor voltage, use 	$ vcgencmd measure_volts
# to measure actual processor temperature, use 	$ vcgencmd measure_temp

