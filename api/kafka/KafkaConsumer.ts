// Example setup for Kafka consumer inside DashboardPage
useEffect(() => {
  const subscribeToUpdates = async () => {
    const { KafkaConsumer } = await import('../api/kafka/KafkaConsumer');
    const consumer = new KafkaConsumer('dashboard_updates');
    consumer.subscribe(['price_updates'], handleRealTimeUpdates);
  };

  subscribeToUpdates();
}, []);

const handleRealTimeUpdates = (message) => {
  // Logic to handle incoming messages
};
