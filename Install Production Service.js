var Service = require('node-windows').Service;

var svc = new Service({
  name:'SSL APP PROD1',
  description: 'SurfacingSolutions Quote APP Production',
  script: 'C:\\\\Users\\sbailey\\Documents\\GitHub\\SurfacingSolutions\\app.js',
  env:{
    name: "NODE_ENV",
    value: "production"
  }
});

var EventLogger = require('node-windows').EventLogger;

var log = new EventLogger('SSI Production');

log.info('Basic information.');
log.warn('Watch out!');
log.error('Something went wrong.');


// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
  console.log("Installed Successfully");
});

svc.install();