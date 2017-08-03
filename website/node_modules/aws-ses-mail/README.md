## A nodejs wrapper for aws-ses-sdk to send email  [![NPM version](https://badge.fury.io/js/aws-ses-mail.svg)](http://badge.fury.io/js/aws-ses-mail)
[![NPM](https://nodei.co/npm/aws-ses-mail.png?downloads=true)](https://nodei.co/npm/aws-ses-mail/)

This is a simple package for sending email from aws ses.
It helps you send email by templates or send a large amount of email.

## Quick Examples

```bash
$ npm install aws-ses-mail
```

```javascript
var awsSesMail = require('aws-ses-mail');

var sesMail = new awsSesMail();
var sesConfig = {
  accessKeyId: 'YOUR ACCESSKEYID',
  secretAccessKey: 'YOUR SECRETACCESSKEY',
  region: 'THE REGION'
};
sesMail.setConfig(sesConfig);

var options = {
  from: 'Sender <sender@example.com>',
  to: mailList,
  subject: 'Hello world',
  content: '<html><head></head><body><div><p>Hello world!</p></div></body></html>'
};

sesMail.sendEmail(options, function(data) {
  // TODO sth....
  console.log(data);
});
```


## Installation

```bash
$ npm install aws-ses-mail
```


## Usage
### Initialize

```javascript
var awsSesMail = require('aws-ses-mail');
```
`accessKeyId`: **Required.** (String) — your AWS access key ID.

`secretAccessKey`: **Required.** (String) — your AWS secret access key.

`region`: **Required.** (String) — the region to send service requests to. See <a href="http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#region-property">region</a> for more information.

```javascript
var sesConfig = {
  accessKeyId: 'YOUR ACCESSKEYID',
  secretAccessKey: 'YOUR SECRETACCESSKEY',
  region: 'THE REGION'
};
awsSesMail.setConfig(sesConfig);
```

You also can load config data from json file.
```javascript
// aws-ses-mail.conf
{
  "accessKeyId": "YOUR ACCESSKEYI",
  "secretAccessKey": "YOUR SECRETACCESSKEY",
  "region": "THE REGION"
};
```

```javascript
sesMail.setConfigFromFile('aws-ses-mail.conf');
```

### Send mail
This package support to use email templates.
You can use templates by html or jade, and you also can enter the content by youself.

The ses mail limit is 50 recipient per process.
This package help you to send a large amount of email.

### Send simple email
* [`sendEmail`](#sendEmail)
* [`sendEmailByJade`](#sendEmailByJade)
* [`sendEmailByHtml`](#sendEmailByHtml)

### Send email batch
* [`sendEmailBatch`](#sendEmailBatch)
* [`sendEmailBatchByJade`](#sendEmailBatchByJade)
* [`sendEmailBatchByHtml`](#sendEmailBatchByHtml)

<a name="sendEmail" />
#### sendEmail(options, [callback])
`from`: **Required.** (String) — The identity's email address.

`to`: (String, String[]) — The destination for this email(to).

`cc`: (String, String[]) — The destination for this email(cc).

`bcc`: (String, String[]) — The destination for this email(bcc).

`subject`: **Required.** (String) — The subject of the message: A short summary of the content, which will appear in the recipient's inbox.

`content`: **Required.** (String) — The message body.

`charset`: The character set of the subject and the content.

`replyToAddresses`: (String, String[]) — The reply-to email address(es) for the message. If the recipient replies to the message, each reply-to address will receive the reply.

`returnPath`: (String) — The email address to which bounces and complaints are to be forwarded when feedback forwarding is enabled. If the message cannot be delivered to the recipient, then an error message will be returned from the recipient's ISP; this message will then be forwarded to the email address specified by the ReturnPath parameter.

`callback([err], [results])`: 

err — the error object returned from the request. Set to null if the request is successful.

results — the de-serialized data returned from the request. Set to null if a request error occurs.

```javascript
var options = {
  from: 'Sender <sender@example.com>',
  to: 'receiver@example.com',
  cc: ['receivercc1@example.com', 'receivercc2@example.com'],
  bcc: 'receiverbcc@example.com',
  subject: 'Hello world',
  content: '<html><head></head><body><div><p>Hello world!</p></div></body></html>'
};

sesMail.sendEmail(options, function(err, data) {
  if (err) {
    console.log(JSON.stringify(err));
    /*
      {"date":"2014-11-03T07:14:41.291Z",
        "receiver":{"ToAddresses":["receiver@example.com"]},
        "success":false,
        "result":{
          "message":"XXXXX",
          "code":"XXXXX",
          "errno":"XXXXX",
          "syscall":"XXXXX",
          "region":"XXXXX",
          "hostname":"XXXXX",
          "retryable":XXXXX,
          "time":"2014-11-03T07:14:41.291Z"
        }
      }
    */
  } else {
    console.log(JSON.stringify(data));
    /*
      {"date":"2014-11-03T08:21:56.720Z",
        "receiver":{"ToAddresses":["receiver@example.com"]},
        "success":true,
        "result":
          {"ResponseMetadata":{"RequestId":"XXXXXXXXXXXXXXX"},
          "MessageId":"XXXXXXXXXX"}
        }
      }
    */
});
```

<a name="sendEmailByJade" />
#### sendEmailByJade(options, [callback])
`from`: **Required.** (String) — The identity's email address.

`to`: (String, String[]) — The destination for this email(to).

`cc`: (String, String[]) — The destination for this email(cc).

`bcc`: (String, String[]) — The destination for this email(bcc).

`subject`: **Required.** (String) — The subject of the message: A short summary of the content, which will appear in the recipient's inbox.

`template`: **Required.** (String) — The jade template path.

`templateArgs`: **Required.** (Json) — The jade template argument, See [`template`](#template) for more information.

`charset`: The character set of the subject and the content.

`replyToAddresses`: (String, String[]) — The reply-to email address(es) for the message. If the recipient replies to the message, each reply-to address will receive the reply.

`returnPath`: (String) — The email address to which bounces and complaints are to be forwarded when feedback forwarding is enabled. If the message cannot be delivered to the recipient, then an error message will be returned from the recipient's ISP; this message will then be forwarded to the email address specified by the ReturnPath parameter.

`callback([err], [results])`: 

err — the error object returned from the request. Set to null if the request is successful.

results — the de-serialized data returned from the request. Set to null if a request error occurs.

```javascript
var options = {
  from: 'Sender <sender@example.com>',
  to: 'receiver@example.com',
  cc: ['receivercc1@example.com', 'receivercc2@example.com'],
  bcc: 'receiverbcc@example.com',
  subject: 'Hello world',
  template: 'templates/example.jade',
  templateArgs: {
    name: 'Tester',
    date: '2014/10/31 12:00',
  }
};

sesMail.sendEmailByJade(options, function(err, data) {
  if (err) {
    console.log(JSON.stringify(err));
    /*
      {"date":"2014-11-03T07:14:41.291Z",
        "receiver":{"ToAddresses":["receiver@example.com"]},
        "success":false,
        "result":{
          "message":"XXXXX",
          "code":"XXXXX",
          "errno":"XXXXX",
          "syscall":"XXXXX",
          "region":"XXXXX",
          "hostname":"XXXXX",
          "retryable":XXXXX,
          "time":"2014-11-03T07:14:41.291Z"
        }
      }
    */
  } else {
    console.log(JSON.stringify(data));
    /*
      {"date":"2014-11-03T08:21:56.720Z",
        "receiver":{"ToAddresses":["receiver@example.com"]},
        "success":true,
        "result":
          {"ResponseMetadata":{"RequestId":"XXXXXXXXXXXXXXX"},
          "MessageId":"XXXXXXXXXX"}
        }
      }
    */
});
```

<a name="sendEmailByHtml" />
#### sendEmailByHtml(options, [callback])
Same as [`sendEmailByJade`](#sendEmailByJade).

<a name="sendEmailBatch" />
#### sendEmailBatch(options, [callback])
`from`: **Required.** (String) — The identity's email address.

`to`: **Required.** (String[]) — The destination for this email.(recipients array)

`subject`: **Required.** (String) — The subject of the message: A short summary of the content, which will appear in the recipient's inbox.

`content`: **Required.** (String) — The message body.

`charset`: The character set of the subject and the content.

`replyToAddresses`: (String, String[]) — The reply-to email address(es) for the message. If the recipient replies to the message, each reply-to address will receive the reply.

`returnPath`: (String) — The email address to which bounces and complaints are to be forwarded when feedback forwarding is enabled. If the message cannot be delivered to the recipient, then an error message will be returned from the recipient's ISP; this message will then be forwarded to the email address specified by the ReturnPath parameter.

`callback([results])`: 

results — results includes success and failed log, and records date and recipients list.

```javascript
var options = {
  from: 'Sender <sender@example.com>',
  to: ['receiver1@example.com', 'receiver2@example.com', 'receiver3@example.com'],
  subject: 'Hello world',
  content: '<html><head></head><body><div><p>Hello world!</p></div></body></html>'
};

sesMail.sendEmailBatch(options, function(data) {
  console.log(JSON.stringify(data));
  /*  
    {"date":"2014-11-03T08:36:03.610Z",
      "receiver":["xxxxx@xxxx","xxxxx@XXXX, XXXXX"],
      "successLog":[
        {"ResponseMetadata":{"RequestId":"XXXXXXXX"},
         "MessageId":"XXXXXXXXX",
         "email":"XXXXX@XXXXX"
        },
        {"ResponseMetadata":{"RequestId":"XXXXX"},
         "MessageId":"XXXXXX",
         "email":"XXXXX@XXXXX"
        }
      ],
      "failedLog":[
        {"message":"XXXX",
        "code":"XXXXX",
        "time":"2014-11-03T08:36:06.798Z",
        "statusCode":XXX,
        "retryable":XXXX,
        "email":"XXXX"}
      ]
    }
  */
  }
});
```

<a name="sendEmailBatchByJade" />
#### sendEmailBatchByJade(options, [callback])
`from`: **Required.** (String) — The identity's email address.

`to`: **Required.** (String[]) — The destination for this email(to).

`subject`: **Required.** (String) — The subject of the message: A short summary of the content, which will appear in the recipient's inbox.

`template`: **Required.** (String) — The jade template path.

`templateArgs`: **Required.** (Json) — The jade template argument, See [`template`](#template) for more information.

`charset`: The character set of the subject and the content.

`replyToAddresses`: (String, String[]) — The reply-to email address(es) for the message. If the recipient replies to the message, each reply-to address will receive the reply.

`returnPath`: (String) — The email address to which bounces and complaints are to be forwarded when feedback forwarding is enabled. If the message cannot be delivered to the recipient, then an error message will be returned from the recipient's ISP; this message will then be forwarded to the email address specified by the ReturnPath parameter.

`callback( [results])`: 

results — results includes success and failed log, and records date and recipients list.

```javascript
var options = {
  from: 'Sender <sender@example.com>',
  to: ['receiver1@example.com', 'receiver2@example.com', 'receiver3@example.com'],
  subject: 'Hello world',
  template: 'templates/example.jade',
  templateArgs: {
    name: 'Tester',
    date: '2014/10/31 12:00',
  }
};

sesMail.sendEmailBatchByJade(options, function(data) {
  console.log(JSON.stringify(data));
  /*  
    {"date":"2014-11-03T08:36:03.610Z",
      "receiver":["xxxxx@xxxx","xxxxx@XXXX, XXXXX"],
      "successLog":[
        {"ResponseMetadata":{"RequestId":"XXXXXXXX"},
         "MessageId":"XXXXXXXXX",
         "email":"XXXXX@XXXXX"
        },
        {"ResponseMetadata":{"RequestId":"XXXXX"},
         "MessageId":"XXXXXX",
         "email":"XXXXXX@XXXXXX"
        }
      ],
      "failedLog":[
        {"message":"XXXX",
        "code":"XXXXX",
        "time":"2014-11-03T08:36:06.798Z",
        "statusCode":XXX,
        "retryable":XXXX,
        "email":"XXXX"}
      ]
    }
  */
  }
});
```

<a name="sendEmailBatchByHtml" />
#### sendEmailBatchByHtml(options, [callback])
Same as [`sendEmailBatchByJade`](#sendEmailBatchByJade).


<a name="template" />
## template
This package only support jade and html template.
The argument format is like #{key};

### Jade example
```javascript
templateArgs: {
  name: 'Tester',
  date: '2014/10/31 12:00',
}
```

```jade
doctype html
html
  head
  body
    div
      p Hi #{name}
      p This is a test email template.
      p #{date}
```

### Html example
```javascript
templateArgs: {
  name: 'Tester',
  date: '2014/10/31 12:00',
}
```

```html
<html>
  <head></head>
  <body>
    <div>
      <p>Hi, #{name}</p>
      <p>This is a test email template.</p>
      <p>#{date}</p>
    </div>
  </body>
</html>
```

## Example
you can find the full example in `/example` folder.

## AWS SES SDK document
http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html
http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html#!AWS/SES.html
