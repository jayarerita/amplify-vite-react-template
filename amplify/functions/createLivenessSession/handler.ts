import type { Schema } from '../../data/resource';
import {
  RekognitionClient,
  CreateFaceLivenessSessionCommand,
} from '@aws-sdk/client-rekognition';

const client = new RekognitionClient();

export const handler: Schema['createLivenessSession']['functionHandler'] =
  async () => {
    const response = await client.send(new CreateFaceLivenessSessionCommand({}));
    if (!response.SessionId) {
      throw new Error('Rekognition did not return a SessionId');
    }
    return { sessionId: response.SessionId };
  };
