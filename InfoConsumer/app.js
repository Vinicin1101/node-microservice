const amqp = require('amqplib');

async function consumeMessages() {
    const connection = await amqp.connect('amqp://localhost');

    const channel = await connection.createChannel();
    await channel.assertExchange('LogExchange', 'direct');
    const queue = await channel.assertQueue('InfoQueue');
    await channel.bindQueue(queue.queue, 'LogExchange', 'Informative');

    channel.consume(queue.queue, (message) => {
        const data = JSON.parse(message.content);
        console.log(data);
        channel.ack(message)
    });
}

consumeMessages();
