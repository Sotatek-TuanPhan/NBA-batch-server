import app from './app.js';

export const handler = async (event, context) => {
  console.log('event', event);
  await app.main(event);

  const response = {
    statusCode: 200,
    message: 'OK',
  };
  return response;
};
