const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const proxy = require("express-http-proxy");
const envConfig = require('./config');
let expressApplication = null;

const appConfig = app => {
  app.use("/", express.static(path.resolve(__dirname, "./public")));
  app.use(morgan("common"));
  app.use(compression());
  app.use(helmet());
};
const appRroutes = app => {
  app.get("/test", (req, res) => {
    res.send("Welcome to express");
  });
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname,'./public/index.html'));
  });
};
const appProxy = (app) =>{
   // proxy all apis to localhost if node env is dev.
   if(envConfig.nodeEnv === 'development'){
    app.use('/api/*',proxy('http://localhost:8000'));
  }
}
const bootstrapExpressApp = () => {
  expressApplication = express();
  appConfig(expressApplication);
  appRroutes(expressApplication);
  appProxy(expressApplication);

  if(envConfig.portalPort){
    expressApplication.listen(envConfig.portalPort, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("application listening at ", envConfig.portalPort);
      }
    });
  } else{
    throw new Error('Please specify env variable ENV_PORT')
  }
};
bootstrapExpressApp();
