import AWS from 'aws-sdk';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event) {
  const { id } = event.pathParameters;

  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: {
          id,
        },
      })
      .promise();

    const auction = result.Item;
    if (!auction) createError.NotFound(`Auction with id "${id}" not found!`);

    return {
      statusCode: 200,
      body: JSON.stringify(auction),
    };
  } catch (error) {
    throw createError.InternalServerError(error);
  }
}

export const handler = middy(getAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
