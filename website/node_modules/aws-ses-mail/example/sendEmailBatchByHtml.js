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

//set receiver list from file, you also can do that from another source.
var mailListFile = './maillist.txt';
var mailList = fs.readFileSync(mailListFile, 'utf8').trim().split('\n');

var options = {
  from: 'Sender <sender@example.com>',
  to: mailList,
  subject: 'Hello world',
  template: 'templates/example.html',
  templateArgs: {
    name: 'Tester',
    date: '2014/10/31 12:00',
  }
};

sesMail.sendEmailBatchByHtml(options, function(data) {
  console.log(data);
});