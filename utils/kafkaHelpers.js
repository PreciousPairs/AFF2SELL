const { logDebug } = require('./logger');

exports.customPartitioner = () => {
    return ({ partitionMetadata, message }) => {
        // Enhanced logic to dynamically distribute messages across partitions
        const partitionIndex = partitionMetadata.findIndex(p => p.leader === 'preferred-leader-id');
        const keyHash = hashCode(message.key.toString());
        return partitionIndex !== -1 ? partitionIndex : keyHash % partitionMetadata.length;
    };
};

exports.determineTopicBasedOnContent = (message) => {
    // Dynamic topic selection based on message content
    if (message.value.includes('urgent')) {
        return 'urgent-pricing-updates';
    }
    return 'standard-pricing-updates';
};

function hashCode(string) {
    // Improved hashing function for better distribution
    return Array.from(string).reduce((hash, char) => Math.imul(31, hash) + char.charCodeAt(0) | 0, 0);
}