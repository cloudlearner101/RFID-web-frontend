# Use a smaller base image
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY front-end/package.json .
COPY front-end/package-lock.json .
COPY front-end/public/ public/
COPY front-end/src/ src/

# Expose the port
ENV PORT=3005
EXPOSE $PORT

RUN npm i --production --force
RUN npm run build

# Start the application
CMD ["npm", "start"]

