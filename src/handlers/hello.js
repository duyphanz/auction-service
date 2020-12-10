/* eslint-disable-next-line */
async function hello(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello world!' }),
  };
}

export const handler = hello;
