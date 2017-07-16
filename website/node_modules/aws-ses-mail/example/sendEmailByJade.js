var awsSesMail = require('../lib');
var fs = require('fs');

var sesMail = new awsSesMail();
var sesConfig = {
  accessKeyId: 'YOUR ACCESSKEYID',
  secretAccessKey: 'YOUR SECRETACCESSKEY',
  region: 'THE REGION'
};

// sesMail.setConfigFromFile('config/aws-ses-mail.conf');
sesMail.setConfig(sesConfig);

var options = {
  from: 'Sender <sender@example.com>',
  to: 'receiver@example.com',
  // cc: ['receivercc1@example.com', 'receivercc2@example.com'],
  // bcc: 'receiverbcc@example.com',
  subject: 'Hello world',
  template: 'templates/example.jade',
  templateArgs: {
    name: 'Tester',
    date: '2014/10/31 12:00',
  }
};

sesMail.sendEmailByJade(options, function(err, data) {
  if (err) {
    console.log('---- err ----');
    console.log(JSON.stringify(err));
  } else {
    console.log('---- success ----');
    console.log(JSON.stringify(data));
  }
});