# Step 1: Specify the base image
FROM node:16-alpine

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Install express and http-proxy-middleware
RUN npm install express http-proxy-middleware

# Step 6: Copy the rest of the application
COPY . .

# Step 7: Build the React app
RUN npm run build

# Step 8: Expose the port (change to 80 if you want to use the default HTTP port)
EXPOSE 3000

# Step 9: Specify the command to run the application
CMD [ "node", "server.js" ]