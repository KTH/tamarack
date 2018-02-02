FROM kthse/kth-nodejs-web:2.4

COPY ["config", "config"]
COPY ["modules", "modules"]
COPY ["app.js", "app.js"]
COPY ["package.json", "package.json"]

RUN npm install --production --loglevel warn && \
    npm prune    

EXPOSE 3000

CMD ["node", "app.js"]
