FROM node:20-bullseye

# Create app directory
WORKDIR /usr/

# Install app dependencies
COPY package*.json /usr/

RUN npm Install

# Bundle app source
COPY . /usr/

EXPOSE 3000
CMD ["npm", "start"]
