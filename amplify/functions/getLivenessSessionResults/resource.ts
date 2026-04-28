import { defineFunction } from '@aws-amplify/backend';

/**
 * Lambda that calls Rekognition GetFaceLivenessSessionResults to return the
 * confidence score after the user completes the liveness check.
 */
export const getLivenessSessionResults = defineFunction({
  name: 'getLivenessSessionResults',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
