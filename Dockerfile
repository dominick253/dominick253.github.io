# Use an official Node.js runtime as the base image
FROM node:18.15.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the remaining application files
COPY . .

# Install Nginx
RUN apt-get update && apt-get install -y nginx

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Expose the port that Nginx will listen on
EXPOSE 80

# Specify the command to start Nginx and then run your Node.js application
CMD service nginx start && npm start
