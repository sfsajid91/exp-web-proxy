# Build stage
FROM node:20-slim AS builder

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml (if exists) to the working directory
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Production stage
FROM node:20-slim AS runner

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app .

# Install only production dependencies
RUN npm install -g pnpm && pnpm install --prod

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["pnpm", "start"]

