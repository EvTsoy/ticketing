import {
    Publisher,
    ExpirationCompleteEvent,
    Subjects,
} from '@evtickets2/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
