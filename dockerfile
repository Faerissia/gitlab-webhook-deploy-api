FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

# ติดตั้ง ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

COPY . .

RUN npm run build

CMD ["npm","start"]