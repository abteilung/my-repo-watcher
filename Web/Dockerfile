# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --ignore-scripts

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy built app and dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/scripts ./scripts

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S svelte -u 1001 -G nodejs

# Change ownership
RUN chown -R svelte:nodejs /app
USER svelte

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start app
CMD ["npm", "start"]
