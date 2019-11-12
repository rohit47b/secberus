FROM satishsverma/node AS builder

ADD . /app
WORKDIR /app
RUN npm install
RUN npm run build
# CMD ["npm", "start"]

FROM nginx
ADD default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

