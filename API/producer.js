const amqp = require('amqplib');
const config = require('./config')

// Producer class

class Producer {
    channel;

    /** 
     * Function for instance a new channel 
    */
    async newChannel() {
        const connection = await amqp.connect(config.RabbitMQ.url);
        this.channel = await connection.createChannel("teste");
    }

    /** 
     * Function to publish a message to the channel
    * @param {string} routerKey - The router key (Warning, Error or Informative)
    * @param {any} message - The message to send
    */
    async publishMessage(routerKey, message){
        if (this.channel === undefined) {
            this.channel = await this.newChannel();
            console.log(this.channel);
        }

        const exchangeName = config.RabbitMQ.exchange;
        await this.channel.assertExchange(exchangeName, 'direct');

        const details = JSON.stringify({
            message: message,
            logType: routerKey,
            timestamp: new Date()
        });
        await this.channel.publish(exchangeName, routerKey, Buffer.from(details));

        console.log("[✓] The message has been published!");
    }

    /** 
     * Function to close the verify logTypes
     * @param {string} logType - (Warning, Error or Informative)
    */
    static isValidLogType(logtype) {
        const logs = ["Error", "Warning", "Informative"];
        if (!logs.includes(logtype)) {
            console.error("Invalid log type");
            return false;
        }
        return true;
    }
}

module.exports = Producer;