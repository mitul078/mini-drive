const amqplib = require("amqplib")

let channel, connection

async function connect() {
    if (connection)
        return connection

    try {
        connection = await amqplib.connect(process.env.RABBIT_URL)
        console.log("RabbitMQ connected(AUTH)")
        channel = await connection.createChannel()

    } catch (error) {
        console.log("Rabbit error(AUTH): ", error)
    }
}

async function publishToQueue(queueName, data = {}) {
    if (!channel || !connection) await connect();

    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))
}

async function subscribeToQueue(queueName, cb) {

    if (!channel || !connection) await connect()

    await channel.assertQueue(queueName, { durable: true })

    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString())
            await cb(data)
            channel.ack(msg)
        }
    })
}




module.exports = {
    connect,
    publishToQueue,
    subscribeToQueue
}