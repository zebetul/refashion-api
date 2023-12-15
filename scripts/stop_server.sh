#!/bin/bash

# Set HOME environment variable
export HOME=/home/ec2-user

# Stop pm2 process for the app
cd /home/ec2-user/refashion-api/
/usr/local/bin/pm2 stop refashion-api
