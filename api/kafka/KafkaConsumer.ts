import { useEffect } from 'react';
import KafkaConsumer from '../api/kafka/KafkaConsumer'; // Assuming the correct path to KafkaConsumer
import handleRealTimeUpdates from './handleRealTimeUpdates'; // Assuming the correct path to handleRealTimeUpdates

const DashboardPage: React.FC = () => {
  useEffect(() => {
    const subscribeToUpdates = async () => {
      try {
        const consumer = new KafkaConsumer('dashboard_updates');
        await consumer.connect(); // Connect to Kafka broker
        consumer.subscribe(['price_updates'], handleRealTimeUpdates); // Subscribe to price_updates topic
      } catch (error) {
        console.error('Error subscribing to Kafka updates:', error);
      }
    };

    subscribeToUpdates();
  }, []);

  return (
    <div>
      {/* Dashboard content */}
    </div>
  );
};

export default DashboardPage;