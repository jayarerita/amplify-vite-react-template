import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { createLivenessSession } from '../functions/createLivenessSession/resource';
import { getLivenessSessionResults } from '../functions/getLivenessSessionResults/resource';

/**
 * Schema exposes two custom queries backed by Lambda functions that call
 * Amazon Rekognition Face Liveness APIs. Both require the user to be signed
 * in via Cognito User Pools.
 */
const schema = a.schema({
  LivenessSession: a.customType({
    sessionId: a.string().required(),
  }),

  LivenessResult: a.customType({
    sessionId: a.string().required(),
    status: a.string().required(),
    confidence: a.float(),
  }),

  createLivenessSession: a
    .query()
    .returns(a.ref('LivenessSession'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(createLivenessSession)),

  getLivenessSessionResults: a
    .query()
    .arguments({ sessionId: a.string().required() })
    .returns(a.ref('LivenessResult'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(getLivenessSessionResults)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
