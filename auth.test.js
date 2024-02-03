const { authenticateWalmartApi, generateSignature } = require('./auth');

// Mock environment variables
process.env.WALMART_CLIENT_ID = 'test_client_id';
process.env.WALMART_CLIENT_SECRET = 'test_client_secret';
process.env.WM_CONSUMER_ID = 'test_consumer_id';
process.env.PRIVATE_KEY = 'test_private_key'; // Use a test key
process.env.KEY_VERSION = '2';

describe('Authentication with Walmart API', () => {
  it('should generate a non-empty access token', async () => {
    const token = await authenticateWalmartApi();
    expect(token).toBeDefined();
    expect(token).not.toBe('');
  });

  it('should generate a valid signature', () => {
    const signature = generateSignature(process.env.WM_CONSUMER_ID, process.env.PRIVATE_KEY, process.env.KEY_VERSION);
    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
  });
});
