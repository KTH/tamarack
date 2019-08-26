FROM kthse/kth-nodejs:10.14.0

COPY ["config", "config"]
COPY ["modules", "modules"]
COPY ["app.js", "app.js"]
COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]

RUN npm install --production --loglevel warn && \
    npm prune    

EXPOSE 80

CMD ["npm", "start"]
