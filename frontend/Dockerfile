# Frontend Dockerfile
FROM node:16

# Set working directory as /app -- change to whatever working directory is going to be called
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 3000
CMD ["npm", "start"]
