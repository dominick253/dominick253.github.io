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

# Specify the command to run your Node.js application
CMD npm start



