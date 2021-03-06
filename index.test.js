const index = require('./index');
const session = {
  'application': {
    'applicationId': 'amzn1.ask.skill.36153e2a-f214-4e29-a08a-373b4e92d3e1' },
  'user': { 'userId': 'user-id' }
};
const context = { };

describe('The help intent', () => {
  const event = { 'session': session,
                  'request': { 'locale': 'en-US', 'type': 'IntentRequest', 'intent': {'name': 'AMAZON.HelpIntent' } } };
  const callback = jest.fn();

  beforeEach(() => {
    event.session.attributes = { };
  });

  test('it says some help text', () => {
    index.handler(event, context, callback);

    const result = callback.mock.calls[0][1];
    expect(result.response.outputSpeech.ssml).toBe('<speak> You can say assign someone, or, you can say exit... What can I help you with? </speak>')
  });
});

describe('The assignment intent', () => {
  const event = { 'session': session,
                  'request': { 'locale': 'en-US', 'type': 'IntentRequest', 'intent': {'name': 'assignment' } } };
  const callback = jest.fn();

  beforeEach(() => {
    event.session.attributes = { };
  });

  test('it says the name of the chosen person', () => {
    index.handler(event, context, callback);

    const result = callback.mock.calls[0][1];
    expect(result.response.outputSpeech.ssml).toMatch(/\<speak\> .+ is the chosen one \<\/speak\>/)
  });

  test('it adds the name of the chosen person to the session', () => {
    index.handler(event, context, callback);

    const result = callback.mock.calls[0][1];
    expect(result.sessionAttributes.assigned.length).toBe(1)
  });

  test('it sets the shouldEndSession parameter to false', () => {
    index.handler(event, context, callback);

    const result = callback.mock.calls[0][1];
    expect(result.response.shouldEndSession).toBeFalse
  });

  test('does not repeat the same person when called 4 times', () => {
    index.handler(event, context, callback);
    index.handler(event, context, callback);
    index.handler(event, context, callback);
    index.handler(event, context, callback);

    const lastResult = callback.mock.calls.pop()[1];
    expect(lastResult.sessionAttributes.assigned.sort()).toEqual([ 'Ben', 'Chris L', 'Chris R', 'James' ])
  });

  describe('when called 5 times', () => {
    beforeEach(() => {
      index.handler(event, context, callback);
      index.handler(event, context, callback);
      index.handler(event, context, callback);
      index.handler(event, context, callback);
      index.handler(event, context, callback);
    });

    test('informs the user that there are no people available', () => {
      const lastResult = callback.mock.calls.pop()[1]
      expect(lastResult.response.outputSpeech.ssml).toBe('<speak> There are no people available to assign </speak>')
    });

    test('ends the session', () => {
      const lastResult = callback.mock.calls.pop()[1]
      expect(lastResult.response.shouldEndSession).toBeTrue
    });
  });
});
