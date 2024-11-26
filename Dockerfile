   # Use the official Node.js image as a base
   FROM node:14

   # Set the working directory
   WORKDIR /app

   # Copy package.json and package-lock.json
   COPY package*.json ./

   # Install dependencies
   RUN npm install

   # Copy the rest of your application code
   COPY . .

   # Build the application
   RUN npm run build

   # Install serve to serve the build folder
   RUN npm install -g serve

   # Expose the port the app runs on
   EXPOSE 3000

   # Command to run the app
   CMD ["serve", "-s", "build"]