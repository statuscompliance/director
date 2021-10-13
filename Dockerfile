FROM governify/base-node-14:1.0

COPY . .

RUN apk update
RUN apk add $(apk search mongodb-tools | head -n 1 | sed 's/-/=/2')
RUN apk add $(apk search influxdb | head -n 1 | sed 's/-/=/1')

RUN npm install --only=prod

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

CMD [ "node", "index.js" ]