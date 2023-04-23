# Use a node base image
FROM node:18-alpine

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Build the app for production
# RUN npm run build
# Expose port 3000
EXPOSE 3000

# Start the app with Vite
# ENTRYPOINT [ "npm", "run", "preview", "--host", "3000"]
CMD ["npm", "run", "serve"]
