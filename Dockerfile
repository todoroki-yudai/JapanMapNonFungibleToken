FROM ubuntu:16.04

# init
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    git \
    nodejs \
    npm

RUN npm cache clean && \
    npm install n -g && \
    n stable && \
    ln -sf /usr/local/bin/node /usr/bin/node

# delete original node
# * If don't execute "bash", can't find npm in path
RUN apt-get purge -y nodejs npm && \
    bash

COPY . /token
WORKDIR /token

RUN npm install && \
    npm install -g http-server

CMD ["/sbin/init"]

# CMD ["npm run testrpc"]
