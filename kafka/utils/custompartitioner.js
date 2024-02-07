// utils/customPartitioner.js
exports.customPartitioner = () => {
    return ({ topic, partitionMetadata, message }) => {
        // Implement custom logic to choose a partition
        const numPartitions = partitionMetadata.length;
        const keyHash = hashCode(message.key.toString());
        return keyHash % numPartitions;
    };
};

function hashCode(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        const character = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}