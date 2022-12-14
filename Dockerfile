FROM node:17-alpine 
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json yarn.lock .//usr/src/app/
RUN yarn
COPY . /usr/src/app
EXPOSE 3001
CMD [ "yarn","dev" ]