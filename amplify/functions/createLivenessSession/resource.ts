import { defineFunction } from '@aws-amplify/backend';

/**
 * Lambda that calls Rekognition CreateFaceLivenessSession and returns a sessionId
 * for the Amplify UI FaceLivenessDetector to use.
 */
export const createLivenessSession = defineFunction({
  name: 'createLivenessSession',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
