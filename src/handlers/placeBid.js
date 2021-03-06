import AWS from 'aws-sdk';
import createError from 'http-errors';
import { commonMiddleware } from '../lib/commonMiddleware';
import { getAuctionById } from './getAuction';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  if (auction.highestBid.amount >= amount) {
    throw createError.Forbidden(
      `Your bid must be higher then ${auction.highestBid.amount}`
    );
  }

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

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    throw createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(getAuction);
