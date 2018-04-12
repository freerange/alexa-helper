const index = require('./index');

test('Triggering the assignment intent says the name of the chosen person', () => {
  const event = { 'request': { 'locale': 'en-US' },
                  'session': { 'application': { 'applicationID': 'application-id' },
                               'user': { 'userId': 'user-id' } },
                  'request': { 'type': 'IntentRequest', 'intent': {'name': 'assignment' } } };
  const context = { };
  const callback = jest.fn();

  index.handler(event, context, callback);

  const result = callback.mock.calls[0][1];
  expect(result.response.outputSpeech.ssml).toMatch(/\<speak\> .+ is the chosen one \<\/speak\>/)
});