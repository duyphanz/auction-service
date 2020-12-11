import AWS from 'aws-sdk';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction() {
  try {
    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTION_TABLE_NAME,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ auction: result.Items }),
    };
  } catch (error) {
    throw createError.InternalServerError(error);
  }
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
