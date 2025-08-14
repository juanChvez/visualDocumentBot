# Build stage
FROM node:20.19.0 AS build
WORKDIR /app

# Copy dependency files and install
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the optimized production version
RUN npm run build

# Final stage: serve with Node (serve)
FROM node:20.19.0
WORKDIR /app

# Install a static file server
RUN npm install -g serve

# Copy only the built files from the build stage
COPY --from=build /app/dist ./dist

# Expose the port for Render
EXPOSE 3000

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "3000"]
