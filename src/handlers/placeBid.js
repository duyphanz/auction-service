import AWS from 'aws-sdk';
import createError from 'http-errors';
import { commonMiddleware } from '../lib/commonMiddleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  try {
    const result = await dynamoDB
      .update({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: {
          id,
        },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
          ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    const auction = result.Attributes;

    return {
      statusCode: 200,
      body: JSON.stringify(auction),
    };
  } catch (error) {
    throw createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(getAuction);
