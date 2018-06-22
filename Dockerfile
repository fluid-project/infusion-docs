FROM node:10-alpine AS builder

# Add OS-level dependencies
RUN apk add --no-cache git

# Switch to regular user
USER node

# Install npm dependencies
COPY --chown=node package.json /app/package.json
WORKDIR /app
RUN npm install

# Build and test website
COPY --chown=node . /app
RUN $(npm bin)/grunt lint
RUN npm test

# Build final image
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html