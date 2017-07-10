var Service = require('node-windows').Service;

var svc = new Service({
  name:'SSL APP DEV2',
  description: 'SurfacingSolutions Quote APP Development',
  script: 'C:\\\\Users\\sbailey\\Documents\\GitHub\\SurfacingSolutions Development\\app.js',
  env:{
    name: "NODE_ENV",
    value: "dev"
  }
});

var EventLogger = require('node-windows').EventLogger;

var log = new EventLogger('SSI DEV');

log.info('Basic information.');
log.warn('Watch out!');
log.error('Something went wrong.');


// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();