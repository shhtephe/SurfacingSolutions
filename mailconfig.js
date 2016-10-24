var environment =  process.env.NODE_ENV || 'development';

var config = {
  development: {
    mailer: {
      from: 'shhtephe@hotmail.com',
      host: 'smtp.live.com', // hostname
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'shhtephe@hotmail.com',
        pass: 'Awesome!'
      }
    },
    mailerUpdate: {
      from: 'shhtephe@hotmail.com',
      host: 'smtp.live.com', // hostname
      secureConnection: true, // use SSL
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
      port: 8465, // test port for secure SMTP
      auth: {
        user: 'TestApplication',
        pass: 'TestApplication'
      }
    },
    mailerUpdate: {
      from: 'UpdatedTestApplication@localhost',
      host: 'localhost',
      secureConnection: true,
      port: 8465,
      auth: {
        user: 'TestApplication',
        pass: 'TestApplication'
      }
    }
  }
};

exports = module.exports = config[environment];