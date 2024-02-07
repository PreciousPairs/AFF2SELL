// utils/messageSerializer.js
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry');

const registry = new SchemaRegistry({
  host: process.env.SCHEMA_REGISTRY_URL,
});

exports.serializeMessage = async (schemaId, message) => {
  return await registry.encode(schemaId, message);
};