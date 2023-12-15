#!/bin/bash

# Set HOME environment variable
export HOME=/home/ec2-user

# Start the Node.js server using pm2
cd /home/ec2-user/configs
/usr/local/bin/pm2 start ecosystem.config.js
