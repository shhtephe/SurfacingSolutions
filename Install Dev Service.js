var Service = require('node-windows').Service;

var svc = new Service({
  name:'SSL APP DEV1',
  description: 'SurfacingSolutions Quote APP Development',
  script: 'C:\\\\Users\\sbailey\\Documents\\GitHub\\SurfacingSolutions Development\\app.js',
  env:{
    name: "NODE_ENV",
    value: "dev"
  }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();