var environment =  process.env.NODE_ENV || 'development';

var config = {
  development: {
    mailer: {
      from: 'spete@surfacingsolutions.ca',
      host: 'surfacing.dmtel.ca', // hostname
      secureConnection: false, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'pete@surfacingsolutions.ca',
        pass: 'Soccerball11'
      }
    },
    mailerUpdate: {
      from: 'shhtephe@hotmail.com',
      host: 'smtp-mail.outlook.com', // hostname
      secureConnection: false, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'shhtephe@hotmail.com',
        pass: 'Awesome!'
      }
    }
  },
  test: {
    mailer: {
      from: 'TestApplication@localhost',
      host: 'localhost', // hostname
      secureConnection: true, // use SSL
      port: 465, // test port for secure SMTP
      auth: {
        user: 'TestApplication',
        pass: 'TestApplication'
      }
    },
    mailerUpdate: {
      from: 'UpdatedTestApplication@localhost',
      host: 'localhost',
      secureConnection: true,
      port: 465,
      auth: {
        user: 'TestApplication',
        pass: 'TestApplication'
      }
    }
  }
};

exports = module.exports = config[environment];