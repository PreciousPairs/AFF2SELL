const { KafkaStreams } = require("kafka-streams");
const { PriceAdjustmentStrategy } = require("./PriceAdjustmentStrategy");

const kafkaStreams = new KafkaStreams({
    clientId: "price-optimization-service",
    kafkaHost: process.env.KAFKA_BROKER,
    ssl: true,
});

const stream = kafkaStreams.getKStream(process.env.KAFKA_INVENTORY_TOPIC);

stream
    .map(message => JSON.parse(message.value.toString()))
    .flatMap(async item => {
        const competitorPrice = await fetchCompetitorPrice(item.productId);
        const optimizedPrice = PriceAdjustmentStrategy.optimizePrice(competitorPrice);
        return { productId: item.productId, newPrice: optimizedPrice };
    })
    .to(process.env.KAFKA_PRICE_UPDATE_TOPIC, "send");

stream.start().then(() => console.log("Price optimization stream started"));
