#!/bin/bash

# Set the date format for the backup file
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Set the backup directory
BACKUP_DIR=/backup

# Create the backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run mongodump to create a backup
mongodump --host mongodb --port 27017 --username admin --password secret --out $BACKUP_DIR/mongo-backup-$DATE

# Remove backups older than 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;