var Service = require('node-windows').Service;

var svc = new Service({
  name:'SSL APP PROD',
  description: 'SurfacingSolutions Quote APP Production',
  script: 'C:\\\\users\\stephenb\\Documents\\GitHub\\SurfacingSolutions\\app.js',
  env:{
    name: "NODE_ENV",
    value: "production"
  }
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();