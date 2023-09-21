import { Publisher, Subjects, TicketUpdatedEvent } from '@evtickets2/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
