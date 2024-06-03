FROM node:18-alpine
WORKDIR /backend
RUN apk update && apk add --no-cache g++
COPY package.json .
RUN npm install 
COPY . .
EXPOSE 4000
CMD ["npm" , "run" , "dev"]