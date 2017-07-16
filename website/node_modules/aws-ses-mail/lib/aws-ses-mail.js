/**
 * @author Milly <milly@wavinfo.com>
 */
var AWS = require('aws-sdk');
var fs = require('fs'); 
var jade = require('jade');
var async = require('async');

(function(){
  var awsSesMail = function (){

    /**
     *  Setting AWS credentials from JSON
     *
     *  `config` is a json object with these properties:
     *
     *    accessKeyId{string}:      your aws ses key
     *    secretAccessKey{string}:  your aws ses secret 
     *    region{string}:           to set the region for requests
     *
     *
     *  Example:
     *    awsSesMail.setConfig({
     *      accessKeyId: 'YOUR ACCESSKEYID',
     *      secretAccessKey: 'YOUR SECRETACCESSKEY',
     *      region: 'THE REGION'
     *    });
     */
    var setConfig = function(config) {
      AWS.config.update(config);
    };

    /**
     *  Setting AWS credentials from JSON format file
     *
     *  @param {string} configPath - Config file path
     *
     *
     *  Content example:
     *    {
     *      accessKeyId: 'YOUR ACCESSKEYID',
     *      secretAccessKey: 'YOUR SECRETACCESSKEY',
     *      region: 'THE REGION'
     *    }
     */
    var setConfigFromFile = function(configPath) {
      AWS.config.loadFromPath(configPath);
    };

    /**
     *  Send email by jade template
     *
     *  `options` is an object with these properties:
     *
     *    from{string}:                 the sender, and the email address have to be verified.
     *    to{string,string[]}:          the primary recipients
     *    cc{string,string[]}:          the carbon copy to secondary recipients
     *    bcc{string,string[]}:         the blind carbon copy to tertiary recipients who receive the message
     *    subject{string}:              the mail subject title
     *    template{string}:             the jade template path
     *    templateArgs{json}:           the jade template argument to replace the key value.
     *    charset{string}:              the character encoding
     *    replyToAddresses{string[]}:   the reply-to email address(es) for the message.
     *    returnPath{string}:           if the message cannot be delivered to the recipient, this message will then be forwarded to the email address specified by the returnPath parameter.
     *                                  and the email address have to be verified.
     * 
     *  Example:
     *    awsSesMail.sendEmailByJade({
     *      from: 'sender@test.com',
     *      to: 'receiver@test.com',
     *      cc: ['receivercc1@test.com', 'receivercc2@test.com'],
     *      bcc: ['receiverbcc1@test.com', 'receiverbcc2@test.com'],
     *      subject: 'Hello world',
     *      template: 'template/hello.jade',
     *      templateArgs: {
     *                      name: 'Jack',
     *                      date: '2014/10/31'
     *                    },
     *      charset: 'UTF-8'
     *      replyToAddresses: ['reply@test.com'],
     *      returnPath: 'sender@test.com'
     *    }, function(err, data) {
     *      if (err) {
     *        //console.log(err);
     *      } else {
     *        //console.log(data);
     *      }
     *    });
     */
    var sendEmailByJade = function(options, callback) {
      // render the body content from jade
      var tpl = fs.readFileSync(options.template, 'utf8');
      var compiledTpl = jade.compile(tpl);
      var templateArgs = {};
      var keys = Object.keys(options.templateArgs);
      for (i in keys) {
        templateArgs[keys[i]] = options.templateArgs[keys[i]];
      }
      options.content = compiledTpl(templateArgs);
      delete options.template;
      delete options.templateArgs;

      sendEmail(options, function(err, data) {
        callback(err, data);
      });
    };

    /**
     *  Send email by html template
     *
     *  `options` is an object with these properties:
     *
     *    from{string}:                 the sender, and the email address have to be verified.
     *    to{string,string[]}:          the primary recipients
     *    cc{string,string[]}:          the carbon copy to secondary recipients
     *    bcc{string,string[]}:         the blind carbon copy to tertiary recipients who receive the message
     *    subject{string}:              the mail subject title
     *    template{string}:             the html template path
     *    templateArgs{json}:           the html template argument to replace the key value.
     *    charset{string}:              the character encoding
     *    replyToAddresses{string[]}:   the reply-to email address(es) for the message.
     *    returnPath{string}:           if the message cannot be delivered to the recipient, this message will then be forwarded to the email address specified by the returnPath parameter.
     *                                  and the email address have to be verified.
     * 
     *  Example:
     *    awsSesMail.sendEmailByHtml({
     *      from: 'sender@test.com',
     *      to: 'receiver@test.com',
     *      cc: ['receivercc1@test.com', 'receivercc2@test.com'],
     *      bcc: ['receiverbcc1@test.com', 'receiverbcc2@test.com'],
     *      subject: 'Hello world',
     *      template: 'template/hello.html',
     *      templateArgs: {
     *                      name: 'Jack',
     *                      date: '2014/10/31'
     *                    },
     *      charset: 'UTF-8'
     *      replyToAddresses: ['reply@test.com'],
     *      returnPath: 'sender@test.com'
     *    }, function(err, data) {
     *      if (err) {
     *        //console.log(err);
     *      } else {
     *        //console.log(data);
     *      }
     *    });
     */
    var sendEmailByHtml = function(options, callback) {
      // replace html arguments
      var template = fs.readFileSync(options.template, 'utf8');
      var keys = Object.keys(options.templateArgs);
      for (i in keys) {
        var regex = new RegExp('#{' + keys[i] + '}', 'g');
        template = template.replace(regex, options.templateArgs[keys[i]]);
      }
      options.content = template;
      delete options.template;
      delete options.templateArgs;

      sendEmail(options, function(err, data) {
        callback(err, data);
      });
    };

    /**
     *  Send email by raw content
     *
     *  `options` is an object with these properties:
     *
     *    from{string}:                 the sender, and the email address have to be verified.
     *    to{string,string[]}:          the primary recipients
     *    cc{string,string[]}:          the carbon copy to secondary recipients
     *    bcc{string,string[]}:         the blind carbon copy to tertiary recipients who receive the message
     *    subject{string}:              the mail subject title
     *    content{string}:              the mail content
     *    charset{string}:              the character encoding
     *    replyToAddresses{string[]}:   the reply-to email address(es) for the message.
     *    returnPath{string}:           if the message cannot be delivered to the recipient, this message will then be forwarded to the email address specified by the returnPath parameter.
     *                                  and the email address have to be verified.
     * 
     *  Example:
     *    awsSesMail.sendEmail({
     *      from: 'sender@test.com',
     *      to: 'receiver@test.com',
     *      cc: ['receivercc1@test.com', 'receivercc2@test.com'],
     *      bcc: ['receiverbcc1@test.com', 'receiverbcc2@test.com'],
     *      subject: 'Hello world',
     *      content: '<H3>Hello world!!!</H3>'
     *      charset: 'UTF-8'
     *      replyToAddresses: ['reply@test.com'],
     *      returnPath: 'sender@test.com'
     *    }, function(err, data) {
     *      if (err) {
     *        //console.log(err);
     *      } else {
     *        //console.log(data);
     *      }
     *    });
     */
    var sendEmail = function(options, callback) {
      var ses = new AWS.SES();
      var params = {
        Source: options.from,
        Destination: {},
        Message: {
          Subject: {
            Data: options.subject
          },
          Body: {
            Html: {
              Data: options.content
            }
          }
        }
      };

      if (options.to && options.to.length) {
        if (typeof(options.to) === 'string') {
          params.Destination.ToAddresses = [];
          params.Destination.ToAddresses.push(options.to);
        } else {
          params.Destination.ToAddresses = options.to;
        }
      }

      if (options.cc && options.cc.length) {
        if (typeof(options.cc) === 'string') {
          params.Destination.CcAddresses = [];
          params.Destination.CcAddresses.push(options.cc);
        } else {
          params.Destination.CcAddresses = options.cc;
        }
      }

      if (options.bcc && options.bcc.length) {
        if (typeof(options.bcc) === 'string') {
          params.Destination.BccAddresses = [];
          params.Destination.BccAddresses.push(options.bcc);
        } else {
          params.Destination.BccAddresses = options.bcc;
        }
      }

      if (!options.to && !options.cc && !options.bcc) {
        var log = {
          date: new Date(),
          receiver: params.Destination,
          success: false,
          result: 'No receiver.'
        };
        return callback(log);
      }

      if (options.charset) {
        params.Message.Subject.Charset = options.charset;
        params.Message.Body.Html.Charset = options.charset;
      }

      if (options.replyToAddresses && options.replyToAddresses.length) {
        if (typeof(options.replyToAddresses) === 'string') {
          params.ReplyToAddresses = [];
          params.ReplyToAddresses.push(options.replyToAddresses);
        } else {
          params.ReplyToAddresses = options.replyToAddresses;
        }
      }

      if (options.ReturnPath) {
        params.ReturnPath = options.returnPath;
      }

      ses.sendEmail(params, function (err, data) {
        if (err) {
          var log = {
            date: new Date(),
            receiver: params.Destination,
            success: false,
            result: err
          };
          callback(log);
        } else {
          var log = {
            date: new Date(),
            receiver: params.Destination,
            success: true,
            result: data
          };
          callback(null, log);
        }
      });
    };

    /**
     *  Send email batch by jade template
     *
     *  `options` is an object with these properties:
     *
     *    from{string}:                 the sender, and the email address have to be verified.
     *    to{string[]}:                 the primary recipients list
     *    subject{string}:              the mail subject title
     *    template{string}:             the jade template path
     *    templateArgs{json}:           the jade template argument to replace the key value.
     *    charset{string}:              the character encoding
     *    replyToAddresses{string[]}:   the reply-to email address(es) for the message.
     *    returnPath{string}:           if the message cannot be delivered to the recipient, this message will then be forwarded to the email address specified by the returnPath parameter.
     *                                  and the email address have to be verified.
     *    timeInternal{integer}:        if the speed is excceed the ses limit(5/s), you can set the time interal between the email.
     * 
     *  Example:
     *    awsSesMail.sendEmailBatchByJade({
     *      from: 'sender@test.com',
     *      to: ['receiver@test.com', 'receiver1@test.com', 'receiver3@test.com'],
     *      subject: 'Hello world',
     *      template: 'template/hello.jade',
     *      templateArgs: {
     *                      name: 'Jack',
     *                      date: '2014/10/31'
     *                    },
     *      charset: 'UTF-8'
     *      replyToAddresses: ['reply@test.com'],
     *      returnPath: 'sender@test.com',
     *      timeInternal: 200
     *    }, function(data) {
     *      //console.log(data);
     *    });
     */
    var sendEmailBatchByJade = function(options, callback) {
      // render the body content from jade
      var tpl = fs.readFileSync(options.template, 'utf8');
      var compiledTpl = jade.compile(tpl);
      var templateArgs = {};
      var keys = Object.keys(options.templateArgs);
      for (i in keys) {
        templateArgs[keys[i]] = options.templateArgs[keys[i]];
      }
      options.content = compiledTpl(templateArgs);
      delete options.template;
      delete options.templateArgs;

      sendEmailBatch(options, function(err, data) {
        callback(err, data);
      });
    };

    /**
     *  Send email batch by html template
     *
     *  `options` is an object with these properties:
     *
     *    from{string}:                 the sender, and the email address have to be verified.
     *    to{string[]}:                 the primary recipients list
     *    subject{string}:              the mail subject title
     *    template{string}:             the html template path
     *    templateArgs{json}:           the html template argument to replace the key value.
     *    charset{string}:              the character encoding
     *    replyToAddresses{string[]}:   the reply-to email address(es) for the message.
     *    returnPath{string}:           if the message cannot be delivered to the recipient, this message will then be forwarded to the email address specified by the returnPath parameter.
     *                                  and the email address have to be verified.
     *    timeInternal{integer}:        if the speed is excceed the ses limit(5/s), you can set the time interal between the email.
     * 
     *  Example:
     *    awsSesMail.sendEmailBatchByHtml({
     *      from: 'sender@test.com',
     *      to: ['receiver@test.com', 'receiver1@test.com', 'receiver3@test.com'],
     *      subject: 'Hello world',
     *      template: 'template/hello.html',
     *      templateArgs: {
     *                      name: 'Jack',
     *                      date: '2014/10/31'
     *                    },
     *      charset: 'UTF-8'
     *      replyToAddresses: ['reply@test.com'],
     *      returnPath: 'sender@test.com',
     *      timeInternal: 200
     *    }, function(data) {
     *      //console.log(data);
     *    });
     */
    var sendEmailBatchByHtml = function(options, callback) {
      // replace html arguments
      var template = fs.readFileSync(options.template, 'utf8');
      var keys = Object.keys(options.templateArgs);
      for (i in keys) {
        var regex = new RegExp('#{' + keys[i] + '}', 'g');
        template = template.replace(regex, options.templateArgs[keys[i]]);
      }
      options.content = template;
      delete options.template;
      delete options.templateArgs;

      sendEmailBatch(options, function(err, data) {
        callback(err, data);
      });
    };

    /**
     *  Send email batch by by raw content
     *
     *  `options` is an object with these properties:
     *
     *    from{string}:                 the sender, and the email address have to be verified.
     *    to{string[]}:                 the primary recipients list
     *    subject{string}:              the mail subject title
     *    content{string}:              the mail content
     *    charset{string}:              the character encoding
     *    replyToAddresses{string[]}:   the reply-to email address(es) for the message.
     *    returnPath{string}:           if the message cannot be delivered to the recipient, this message will then be forwarded to the email address specified by the returnPath parameter.
     *                                  and the email address have to be verified.
     *    timeInternal{integer}:        if the speed is excceed the ses limit(5/s), you can set the time interal between the email.
     * 
     *  Example:
     *    awsSesMail.sendEmailBatch({
     *      from: 'sender@test.com',
     *      to: ['receiver@test.com', 'receiver1@test.com', 'receiver3@test.com'],
     *      subject: 'Hello world',
     *      content: '<H3>Hello world!!!</H3>'
     *      charset: 'UTF-8'
     *      replyToAddresses: ['reply@test.com'],
     *      returnPath: 'sender@test.com',
     *      timeInternal: 200
     *    }, function(data) {
     *      //console.log(data);
     *    });
     */
    var sendEmailBatch = function(options, callback) {
      var ses = new AWS.SES();
      var params = {
        Source: options.from,
        Destination: {},
        Message: {
          Subject: {
            Data: options.subject
          },
          Body: {
            Html: {
              Data: options.content
            }
          }
        }
      };

      if (options.charset) {
        params.Message.Subject.Charset = options.charset;
        params.Message.Body.Html.Charset = options.charset;
      }

      if (options.replyToAddresses && options.replyToAddresses.length) {
        if (typeof(options.replyToAddresses) === 'string') {
          params.ReplyToAddresses = [];
          params.ReplyToAddresses.push(options.replyToAddresses);
        } else {
          params.ReplyToAddresses = options.replyToAddresses;
        }
      }

      if (options.returnPath) {
        params.ReturnPath = options.returnPath;
      }

      var log = {
        date: new Date(),
        receiver: [],
        successLog: [],
        failedLog: []
      };
      var count = 0;
      async.whilst(
        function () { return count < options.to.length; },
        function (callback) {
          params.Destination.ToAddresses = [];
          params.Destination.ToAddresses.push(options.to[count]);
          ses.sendEmail(params, function (err, data) {
            if (err) {
              err.email = options.to[count];
              log.receiver.push(options.to[count]);
              log.failedLog.push(err);
            } else {
              data.email = options.to[count];
              log.receiver.push(options.to[count]);
              log.successLog.push(data);
            }
            count++;
            if (options.timeInternal && typeof(options.timeInternal) === 'number') {
              setTimeout(callback, options.timeInternal);
            } else {
              callback();
            }
          });
        },
        function () {
          callback(log); 
        }
      );
    };

    return{
      setConfig: setConfig,
      setConfigFromFile: setConfigFromFile,
      sendEmailByJade: sendEmailByJade,
      sendEmailByHtml: sendEmailByHtml,
      sendEmail: sendEmail,
      sendEmailBatchByJade: sendEmailBatchByJade,
      sendEmailBatchByHtml: sendEmailBatchByHtml,
      sendEmailBatch: sendEmailBatch
    }
  };

  module.exports = awsSesMail;
}());
