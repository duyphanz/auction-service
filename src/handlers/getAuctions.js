import AWS from 'aws-sdk';
import createError from 'http-errors';
import { commonMiddleware } from '../lib/commonMiddleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions() {
  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTION_TABLE_NAME,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    throw createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(getAuctions);
