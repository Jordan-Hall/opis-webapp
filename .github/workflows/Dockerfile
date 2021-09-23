FROM node:16.4.2
WORKDIR /usr/src/web
COPY package*.json pnpm*.yaml ./
ENV TZ=Europe/London
RUN npm install -g pnpm
RUN pnpm install
COPY . .
EXPOSE 3333
CMD ["pnpm", "start", "backend-opishub"]
