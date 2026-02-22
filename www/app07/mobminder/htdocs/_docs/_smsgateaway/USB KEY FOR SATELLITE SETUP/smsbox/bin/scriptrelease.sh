echo "overriding smsbox.exe file..."
if [ -f /smsbox/data/release/smsbox.exe ]
then
echo "smsbox.exe file found in release directory"
sudo cp -f /smsbox/data/release/smsbox.exe /smsbox/bin/smsbox.exe
sudo rm /smsbox/data/release/smsbox.exe
else
echo "smsbox.exe file not found in release directory"
fi
echo "end of overriding"


