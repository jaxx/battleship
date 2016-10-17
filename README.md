# Battleship

Multiplayer battleship game.


## Installation

1. Install [node.js and npm](https://nodejs.org/en/download/package-manager/)
2. Open terminal and install project dependencies:

        npm install -g yarn webpack
        yarn install

3. Compile TypeScript files to JavaScript use command `webpack`. For development
it's more convenient to keep watching input files for changes and compile them automatically:

        webpack --progress --colors --watch

3. Start server with command `yarn run battleship` or if you want to run server on background read Server Setup section
4. Open browser and navigate to [http://localhost:3000](http://localhost:3000)


## Server Setup

1. Install `forever` task manager to run server on background (must be installed globally):

        npm install -g forever

2. Start new instance of server:

        yarn run start-server

3. To stop running instance execute:

        yarn run stop-server


### Automatic restart on Github commit

If necessary you can use automatic upgrade server to pull updates from Github repository and
restart application server.

1. Add new file `SECRET` into project root, which contains secret key to identify Github
   incoming messages.

2. Start new instance of upgrade server:

        yarn run start-upgrade-server

3. Register new Webhook for the Github repository using same secret key specified in `SECRET`
   file and url to the application `http://<host>:3001/notify`.

4. Check that `Recent Deliveries` section displays successful test message result.

5. Web server is now ready to listen push events on master branch and upgrading application
   server to latest version automatically. You can stop automatic updates by issuing following
   command:

        yarn run stop-upgrade-server


## Contributors

* [@janno-p](https://github.com/janno-p)
* [@jaxx](https://github.com/jaxx)
