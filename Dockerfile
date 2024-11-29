# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]