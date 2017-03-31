var Service = require('node-windows').Service;

var svc = new Service({
  name:'SSL APP DEV1',
  description: 'SurfacingSolutions Quote APP Development',
  script: 'C:\\\\users\\sbailey\\Documents\\GitHub\\SurfacingSolutions Development\\app.js',
  env:{
    name: "NODE_ENV",
    value: "dev"
  }
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();