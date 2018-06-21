'use strict';

const functions = require('firebase-functions');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const admin = require('firebase-admin');

//ACTIONS
const turnOnAction = require('./actions/turnOn');
const turnOffAction = require('./actions/turnOff');

admin.initializeApp(functions.config().firebase);

class Action {
  get intentions() {
    return {
      turnOn: turnOnAction.bind(turnOnAction, admin),
      turnOff: turnOffAction.bind(turnOffAction, admin)
    }
  }

  onRequest(request, response) {
    let intent = request.body.result.metadata.intentName,
        params = request.body.result.parameters,
        app = new DialogflowApp({request: request, response: response});
    
    this.intentions[intent](params).then(response => {
      this.sendGoogleResponse(app, response);
    })
    
  }

  sendGoogleResponse(app, response) {
    let googleResponse = app.buildRichResponse().addSimpleResponse({
      speech: response.speech || response.displayText,
      displayText: response.displayText || response.speech
    });

    if (response.googleRichResponse) {
      googleResponse = response.googleRichResponse;
    }

    if (response.googleOutputContexts) {
      app.setContext(...response.googleOutputContexts);
    }
    app.ask(googleResponse);
  }
}

let action = new Action();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(action.onRequest.bind(action));
