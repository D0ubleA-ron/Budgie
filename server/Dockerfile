FROM node:18

# Set working directory in container
WORKDIR /app

# Copy only dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose port your app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]
