// In /consumers/SellerPriceUpdateConsumer.js
const updateConsumer = kafka.consumer({ groupId: 'update_price_group' });

await updateConsumer.connect();
await updateConsumer.subscribe({ topic: 'price_updates', fromBeginning: true });

await updateConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        const { itemId, newPrice } = JSON.parse(message.value.toString());
        await sellerApi.updateItemPrice(itemId, newPrice);
    },
});
