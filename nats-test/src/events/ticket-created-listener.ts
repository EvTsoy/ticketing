import nats from 'node-nats-streaming';
import { Listener } from '../../../common/src/events/base-listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
        console.log('Event data', data);
        msg.ack();
    }
}
