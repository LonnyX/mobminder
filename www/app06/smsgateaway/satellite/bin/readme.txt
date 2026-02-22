This folder is used for satellite auto-update mechanism:
In this folder you drop the satellite smsbox.exe file.
The filename smsbox.exe is pre-fixed with the release date: 20201231
So the final .exe name is 20201231_smsbox.exe
When the release date does not match the release date on the satellite, a command "update" is issued to the satellite that will call /satellite/update.php
So the executable dropped here will be distributed to all the satellite. 
