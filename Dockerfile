# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

# Install the application dependencies
RUN npm install

# Expose port 4000 for the application
EXPOSE 4000

# Define the command to run the application
CMD [ "npm", "start" ]