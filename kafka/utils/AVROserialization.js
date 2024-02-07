// utils/avroSerializer.js
const avro = require('avsc');
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry');

const registry = new SchemaRegistry({ host: 'http://your-schema-registry-url' });

exports.serializeAvroMessage = async (schemaId, message) => {
    const schema = await registry.getSchema(schemaId);
    const avroType = avro.Type.forSchema(schema);
    return avroType.toBuffer(message); // Serialize message according to schema
};

exports.deserializeAvroMessage = async (schemaId, messageBuffer) => {
    const schema = await registry.getSchema(schemaId);
    const avroType = avro.Type.forSchema(schema);
    return avroType.fromBuffer(messageBuffer); // Deserialize buffer back to message
};