FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 8000
CMD [ "node", "src/index.js" ]