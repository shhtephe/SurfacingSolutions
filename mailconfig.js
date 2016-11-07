var environment =  process.env.NODE_ENV || 'development';

var config = {
  development: {
    mailer: {
      from: 'spete@surfacingsolutions.ca',
      host: 'surfacing.dmtel.ca', // hostname
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'pete@surfacingsolutions.ca',
        pass: 'Soccerball11'
      }
    },
    mailerUpdate: {
      from: 'spete@surfacingsolutions.ca',
      host: 'surfacing.dmtel.ca', // hostname
      secureConnection: false, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'pete@surfacingsolutions.ca',
        pass: 'Soccerball11'
      }
    }
  },
  test: {
    mailer: {
      from: 'spete@surfacingsolutions.ca',
      host: 'surfacing.dmtel.ca', // hostname
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'pete@surfacingsolutions.ca',
        pass: 'Soccerball11'
      }
    },
    mailerUpdate: {
      from: 'spete@surfacingsolutions.ca',
      host: 'surfacing.dmtel.ca', // hostname
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'pete@surfacingsolutions.ca',
        pass: 'Soccerball11'
      }
    }
  }
};

exports = module.exports = config[environment];