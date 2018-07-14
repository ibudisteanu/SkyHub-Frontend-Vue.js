FROM node:8-alpine

# Install build packages and npm global packages
RUN apk update && apk add --no-cache make gcc g++ python certbot git && npm install -g cross-env webpack webpack-cli pm2 rimraf

# Copy files
COPY . .

# Run npm install for build
RUN npm install

# Build
RUN npm run build

# Build User Interface
RUN git clone https://github.com/WebDollar/Node-WebDollar && cd Node-WebDollar && npm install && npm run build_browser && npm run build_browser_user_interface && rm -f /public/WebDollar-dist/WebDollar-Protocol-bundle.js && rm -f /public/WebDollar-dist/WebDollar-Protocol-bundle.js.map && cp /vue-Frontend/public/WebDollar-dist/WebDollar-Protocol-bundle.js /public/WebDollar-dist/ && cp /vue-Frontend/public/WebDollar-dist/WebDollar-Protocol-bundle.js.map /public/WebDollar-dist/

# Clean Everything
RUN apk del make gcc g++ python &&\
	rm -rf /tmp/* /var/cache/apk/* &&\
	npm cache clean --force

# Ports
EXPOSE 80
EXPOSE 443

CMD ["npm","start"]