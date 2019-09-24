FROM node:8-stretch-slim
MAINTAINER staffannase

WORKDIR /home/node/email-gateway

ENV NODE_ENV=development

RUN apt-get install curl
RUN chown -R node:node /home/node

COPY --chown=node:node . .

USER node

RUN npm install && npm cache clean --force

# Use this if you have client packages.
ARG CI="false"
RUN if $CI -eq "true"; then npm run build:client ; fi

EXPOSE 3054

HEALTHCHECK --interval=15s --timeout=3s --retries=12 \
  CMD curl --silent --fail http://localhost:3054/api/health/check || exit 1

CMD [ "npm", "start" ]
