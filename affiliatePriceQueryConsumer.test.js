jest.mock('kafkajs');
const nock = require('nock');
const { Kafka } = require('kafkajs');
const { affiliatePriceQueryConsumer } = require('./affiliatePriceQueryConsumer');

// Mock Kafka consumer
const mockRun = jest.fn();
const mockSubscribe = jest.fn();
const mockConnect = jest.fn();
Kafka.mockImplementation(() => ({
  consumer: () => ({
    connect: mockConnect,
    subscribe: mockSubscribe,
    run: mockRun
  })
}));

describe('Affiliate Price Query Consumer', () => {
  beforeEach(() => {
    nock('https://developer.api.walmart.com')
      .get('/api-proxy/service/affil/product/v2/items/12345')
      .reply(200, {
        item: { id: '12345', name: 'Test Product' }
      });
  });

  it('should connect, subscribe, and run the consumer', async () => {
    await affiliatePriceQueryConsumer();
    expect(mockConnect).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalledWith({ topic: 'affiliate-price-query', fromBeginning: true });
    expect(mockRun).toHaveBeenCalled();
  });

  // Additional tests can simulate the processing of messages and verify the interaction with the Walmart API
});
