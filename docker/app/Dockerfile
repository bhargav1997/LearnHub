# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the root directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the root directory
COPY . .

# Expose port 3000 for the React app
EXPOSE 3000

# Start the React app in development mode
CMD ["npm", "run", "dev"]
