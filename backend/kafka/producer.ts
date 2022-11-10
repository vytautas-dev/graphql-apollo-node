import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

export const send = async () => {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "test",
    messages: [{ value: "Hello KafkaJS user!" }],
  });

  await producer.disconnect();
};

send();
