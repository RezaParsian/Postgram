FROM alpine

COPY --from=node:alpine /usr /usr

RUN npm i -g pm2

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["sh","docker-entrypoint.sh"]