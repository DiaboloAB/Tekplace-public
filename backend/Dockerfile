FROM node:18.17.1
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
EXPOSE 4000