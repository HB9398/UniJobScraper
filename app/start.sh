pm# Start the Node.js server using pm2
pm2 start server.js --name "my-app"

# Save the pm2 process list
pm2 save

# Display logs for debugging (optional)
# pm2 logs
