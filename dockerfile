# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# First, copy only the files needed for installation
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies but prevent scripts from running during installation
RUN npm install --ignore-scripts

# Now copy the source code
COPY src ./src
COPY src/Protos ./src/Protos

# Run the build manually after source files are in place
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=5005

# Copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/Protos ./dist/Protos

RUN chown -R node:node /usr/src/app

EXPOSE ${PORT}
USER node

CMD ["node", "dist/server.js"]