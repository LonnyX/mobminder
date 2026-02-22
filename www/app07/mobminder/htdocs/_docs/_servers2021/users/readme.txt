https://www.digitalocean.com/community/questions/ubuntu-16-04-creating-new-user-and-adding-ssh-keys


creating user arthur2021 ( log on as root and copy/paste the lines below )

mkdir -p /home/arthur2021
mkdir -p /home/arthur2021/.ssh
touch /home/arthur2021/.ssh/authorized_keys
useradd -d /home/arthur2021 arthur2021
usermod -aG sudo arthur2021
chown -R arthur2021:arthur2021 /home/arthur2021/
chown root:root /home/arthur2021
chmod 700 /home/arthur2021/.ssh
chmod 644 /home/arthur2021/.ssh/authorized_keys

creating rsa keys for the new user

su -l arthur2021
cd /home/users/arthur2021/.ssh
ssh-keygen -b 2048 -t rsa

# this creates one file for the private key and another one for the public key.

