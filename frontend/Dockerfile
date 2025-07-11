FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]