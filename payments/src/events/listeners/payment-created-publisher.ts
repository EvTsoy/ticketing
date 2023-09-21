import { PaymentCreatedEvent, Publisher, Subjects } from '@evtickets2/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
