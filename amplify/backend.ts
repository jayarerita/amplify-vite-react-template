import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createLivenessSession } from './functions/createLivenessSession/resource';
import { getLivenessSessionResults } from './functions/getLivenessSessionResults/resource';

const backend = defineBackend({
  auth,
  data,
  createLivenessSession,
  getLivenessSessionResults,
});

/**
 * Grant the backend Lambdas permission to create and read Face Liveness sessions.
 */
backend.createLivenessSession.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['rekognition:CreateFaceLivenessSession'],
    resources: ['*'],
  }),
);

backend.getLivenessSessionResults.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['rekognition:GetFaceLivenessSessionResults'],
    resources: ['*'],
  }),
);

/**
 * The FaceLivenessDetector UI component streams the video directly to Rekognition
 * from the browser using SigV4 credentials from the Cognito Identity Pool. Grant
 * the authenticated role permission to start a liveness session.
 */
backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['rekognition:StartFaceLivenessSession'],
    resources: ['*'],
  }),
);
