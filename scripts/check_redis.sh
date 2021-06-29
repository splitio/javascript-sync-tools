#!/bin/bash
# Check if a Redis instance is up and running.
if ! ./scripts/wait-for-it.sh localhost:6379 --timeout=5 --strict -- echo "Redis service is up"
then
	echo '>> NO REDIS SERVICE WAS FOUND'
	exit 1
fi
