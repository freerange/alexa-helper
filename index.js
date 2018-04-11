'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.36153e2a-f214-4e29-a08a-373b4e92d3e1';

const SKILL_NAME = 'Go Free Range Helper';
const HELP_MESSAGE = 'You can say assign someone, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const PEOPLE = ['Chris L', 'Chris R', 'James', 'Ben'];

const handlers = {
    'LaunchRequest': function () {
        this.emit('assignment');
    },
    'assignment': function () {
        if (typeof(this.attributes.assigned) == 'undefined') {
            this.attributes.assigned = [];
        };

        var assignablePeople = [];
        var self = this;
        PEOPLE.forEach(function(person) {
            if (!self.attributes.assigned.includes(person)) {
                assignablePeople.push(person);
            }
        })

        if (assignablePeople.length == 0) {
          this.response.speak('There are no people available to assign');
          this.response.shouldEndSession(true);
          this.attributes.assigned = [];
          this.emit(':responseReady');
        } else {
          var person = assignablePeople[Math.floor(Math.random()*assignablePeople.length)];

          this.response.speak(person + ' is the chosen one');
          this.response.shouldEndSession(false);
          this.attributes.assigned.push(person);
          this.emit(':responseReady');
        }
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
