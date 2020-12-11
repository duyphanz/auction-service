import AWS from 'aws-sdk';
import createError from 'http-errors';
import { commonMiddleware } from '../lib/commonMiddleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const getAuctionById = async (id) => {
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

    return auction;
  } catch (error) {
    throw createError.InternalServerError(error);
  }
};

async function getAuction(event) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
