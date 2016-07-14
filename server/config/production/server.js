/*global console*/

import express from 'express';

const APP_PORT = process.env.PORT || 3000;

class Server {

  constructor(){
    var server = this;

    server.app = express();
  }

  config() {
    var server = this,
        app = server.app;

    app.use('/assets', express.static(__dirname + '/../../../build/production/assets'));
    app.use('/assets/font-awesome', express.static(__dirname + '/../../../node_modules/font-awesome'));

    // view engine set up
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/../../views');

    app.get('*', (_req, res, _next)=>{
      res.set('Content-Type', 'text/html');
      res.render('index', {});
    });
  }


  run(){
    var server = this;
    server.config();

    server.app.listen(APP_PORT, () => {
      console.info(`Production app is now running on http://localhost:${APP_PORT}`);
    });
  }

}

export default Server;
