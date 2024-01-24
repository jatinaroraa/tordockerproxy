# Use an official Node.js runtime as a base image
FROM node:18

# Install Tor
RUN apt-get update && apt-get install -y tor torsocks 

# RUN apk add tor

RUN  apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
RUN chmod 777 /etc/tor/*

COPY torrc /etc/tor/torrc
# Expose the Tor SOCKS proxy port
WORKDIR /usr/app
COPY package*.json ./
COPY . .
# RUN npm install -g npm
RUN npm install

EXPOSE 9050

# RUN curl -x socks5h://localhost:9050 http://checkip.amazonaws.com/


# CMD [ "node", "app.js" ]
CMD   service tor start && node app.js


# in torrc file 
# MaxCircuitDirtiness 10
# SocksPort 0.0.0.0:9050