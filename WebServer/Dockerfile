# Use Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first for dependency caching
COPY ./WebServer/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY ./WebServer ./

# Expose the application port
EXPOSE 3000

# Default command to start the application
CMD ["npm", "start"]
