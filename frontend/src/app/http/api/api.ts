
import { AuthorizationService } from './authorization.service';
export * from './paymentSubmissions.service';
import { PaymentSubmissionsService } from './paymentSubmissions.service';
export * from './payments.service';
import { PaymentsService } from './payments.service';

export const APIS = [PaymentSubmissionsService, PaymentsService, AuthorizationService];
