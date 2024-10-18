import { getExploreName } from '../utils/platform';

export const devConfig = {
  sdkKey: 'e8RyO6EqRMGpmnuCpMv8_g',
  sdkSecret: 'If2BEHHzNwkINF8NLdYIh1ARSoLhIIrTJpNl',
  webEndpoint: 'zoom.us', // zfg use www.zoomgov.com
  topic: 'Test',
  name: `${getExploreName()}-${Math.floor(Math.random() * 1000)}`,
  password: '',
  signature:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZThSeU82RXFSTUdwbW51Q3BNdjhfZyIsInJvbGVfdHlwZSI6MSwidHBjIjoiVGVzdCIsInZlcnNpb24iOjEsImlhdCI6MTcyOTI0MjY1NSwiZXhwIjoxNzI5MjQ2MjU1fQ.roIb3blhsCcrQ3mLCR0JBV_2To7xmG-2h8N93viPShM',
  sessionKey: '',
  userIdentity: '',
  // The user role. 1 to specify host or co-host. 0 to specify participant, Participants can join before the host. The session is started when the first user joins. Be sure to use a number type.
  role: 1
};
