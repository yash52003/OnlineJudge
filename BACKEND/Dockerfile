FROM node:18-alpine
WORKDIR /backend
# Install necessary dependencies
RUN apk update && \
    apk add --no-cache g++ python3 openjdk11-jdk
COPY package.json .
RUN npm install 
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]