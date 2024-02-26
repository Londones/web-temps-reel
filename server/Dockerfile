# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

RUN chmod +x check-tables.sh

RUN chmod +x check-seed.sh

CMD ["./check-tables.sh", "./check-seed.sh"]