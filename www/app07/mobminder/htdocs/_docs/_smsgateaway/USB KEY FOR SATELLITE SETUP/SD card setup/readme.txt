

You need to plug the SD card into the MAC. 
Install the .img file into a chosen directory on the Mac

Then execute the following commands

$ df -h     # so you know the name of the SD disk on the Mac, something like disk2
$ sudo diskutil unmountDisk /dev/disk2   # will unmount the disk, so it can be overwritten with the bootable image
$ sudo dd bs=1m if=./raspbian.img of=/dev/disk2   # copy image on SD disk (this takes like 20 min (1*) )
$ sudo diskutil eject /dev/disk2   # you are ready to move the SD to the api and boot it



(1*) To assess the progress of dd, you can open another console and type
$ kill -INFO $(pgrep ^dd)



