# Stage 1: Install dependencies and build the Vite app
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json package-lock.json ./ 

# Install dependencies using npm
RUN npm ci

# Copy all project files into the container
COPY . . 

# Build the Vite app (outputs to the dist folder)
RUN npm run build 

# Stage 2: Serve the built Vite app
FROM nginx:alpine AS production

# Copy the built app from the previous stage to nginx's static file directory
COPY --from=build /app/dist /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which nginx serves the app
EXPOSE 80

# Start nginx to serve the static files
CMD ["nginx", "-g", "daemon off;"]
