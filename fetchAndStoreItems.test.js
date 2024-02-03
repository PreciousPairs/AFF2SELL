jest.mock('axios');
jest.mock('mongodb');

const axios = require('axios');
const { MongoClient } = require('mongodb');
const { fetchAndStoreItems } = require('./fetchAndStoreItems');

describe('Fetching and Storing Items', () => {
  it('should fetch items and store them in MongoDB', async () => {
    // Mock Axios response
    axios.get.mockResolvedValue({
      data: { items: [{ id: '123', name: 'Test Item' }] }
    });

    // Mock MongoDB insertMany method
    const insertManyMock = jest.fn();
    MongoClient.connect.mockResolvedValue({
      db: () => ({
        collection: () => ({
          insertMany: insertManyMock
        })
      }),
      close: jest.fn()
    });

    await fetchAndStoreItems();

    // Verify items were fetched and stored
    expect(axios.get).toHaveBeenCalled();
    expect(insertManyMock).toHaveBeenCalledWith([{ id: '123', name: 'Test Item' }]);
  });
});
