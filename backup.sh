#!/bin/bash
# Backup MongoDB using Docker
docker exec mongo mongodump --out /backup/$(date +"%Y%m%d_%H%M") --username root --password example --authenticationDatabase admin
