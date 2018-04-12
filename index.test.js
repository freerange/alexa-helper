const index = require('./index');

describe('The assignment intent', () => {
  const event = { 'request': { 'locale': 'en-US' },
                  'session': { 'application': { 'applicationID': 'application-id' },
                               'user': { 'userId': 'user-id' } },
                  'request': { 'type': 'IntentRequest', 'intent': {'name': 'assignment' } } };
  const context = { };
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
});
