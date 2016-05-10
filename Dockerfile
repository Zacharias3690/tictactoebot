FROM node:4

RUN mkdir /src

COPY package.json /src/package.json
COPY ./src /src
RUN cd /src; npm install
EXPOSE 8080
CMD ["node", "src/app"]

