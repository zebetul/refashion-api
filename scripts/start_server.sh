#!/bin/bash

# Start the Node.js server using pm2
cd /home/ec2-user/configs
pm2 start ecosystem.config.js
