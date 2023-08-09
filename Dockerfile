FROM oven/bun:0.7.2

WORKDIR /app

COPY package.json /app/
COPY *.ts /app/
COPY tsconfig.node.json /app/tsconfig.json
COPY views /app/views
COPY dist /app/dist
COPY node_modules /app/node_modules

EXPOSE 3000

ENV NODE_ENV=production

CMD bun server.ts