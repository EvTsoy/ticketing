import { Publisher, Subjects, TicketCreatedEvent } from '@evtickets2/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
