cat "dtoverlay=w1-gpio" >> /boot/config.txt
sudo reboot

sudo modprobe w1-gpio
sudo modprobe w1-therm

cd /sys/bus/w1/devices/28-000007602ffa
cat w1_slave

git clone https://github.com/ridley-nelson17/ThermoServer.git
sudo python _path_
