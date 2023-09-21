import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { ExpirationCompletePublisher } from './events/publishers/expiration-complete-publisher';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    try {
        await natsWrapper.connect('ticketing', 'adfda', 'http://nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log('NATs connection closed');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
    } catch (err) {
        console.error(err);
    }
};

start();
