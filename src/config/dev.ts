import { getExploreName } from '../utils/platform';

export const devConfig = {
  sdkKey: 'e8RyO6EqRMGpmnuCpMv8_g',
  sdkSecret: 'If2BEHHzNwkINF8NLdYIh1ARSoLhIIrTJpNl',
  webEndpoint: 'zoom.us', // zfg use www.zoomgov.com
  topic: 'Test',
  name: `${getExploreName()}-${Math.floor(Math.random() * 1000)}`,
  password: '',
  signature:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZThSeU82RXFSTUdwbW51Q3BNdjhfZyIsInJvbGVfdHlwZSI6MSwidHBjIjoiVGVzdCIsInZlcnNpb24iOjEsImlhdCI6MTcyOTA2OTg0NSwiZXhwIjoxNzI5MDczNDQ1fQ.vNCObOdf_ItkpmMxUQ8Dlg1Qsa33J-XMS8ZL0cxoc24',
  sessionKey: '',
  userIdentity: '',
  // The user role. 1 to specify host or co-host. 0 to specify participant, Participants can join before the host. The session is started when the first user joins. Be sure to use a number type.
  role: 1
};
