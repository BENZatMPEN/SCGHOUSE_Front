# Step 1: Specify the base image
FROM node:16-alpine

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Install serve
RUN npm install -g serve

# Step 6: Copy the rest of the application
COPY . .

# Step 7: Expose the port
EXPOSE 3000

# Step 8: Specify the command to run the application
CMD [ "serve", "-s", "build" ]