# Use an official Node.js runtime as the build image
FROM node:20-alpine AS build

# Set the working directory in the container to /app
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

# Install the application dependencies
RUN npm install

# Build optimazed application code
RUN npm run build

# Serve stage with NGINX slim
FROM nginx:1.27.1-alpine3.20-slim

# Copy files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the application
EXPOSE 80

# Define the command to run the application
CMD ["nginx", "-g", "daemon off;"]
