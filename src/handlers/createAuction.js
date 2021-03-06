import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import { commonMiddleware } from '../lib/commonMiddleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event) {
  const { title } = event.body;
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    highestBid: {
      amount: 0,
    },
    createdAt: now.toISOString(),
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    throw createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = commonMiddleware(createAuction);
