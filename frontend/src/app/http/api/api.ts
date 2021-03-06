export * from './batchDomesticPayments.service';
import { BatchDomesticPaymentsService } from './batchDomesticPayments.service';
export * from './batchInternationalPayments.service';
import { BatchInternationalPaymentsService } from './batchInternationalPayments.service';
export * from './domesticPayments.service';
import { DomesticPaymentsService } from './domesticPayments.service';
export * from './domesticScheduledPayments.service';
import { DomesticScheduledPaymentsService } from './domesticScheduledPayments.service';
export * from './domesticStandingOrders.service';
import { DomesticStandingOrdersService } from './domesticStandingOrders.service';
export * from './internationalPayments.service';
import { InternationalPaymentsService } from './internationalPayments.service';
export * from './internationalScheduledPayments.service';
import { InternationalScheduledPaymentsService } from './internationalScheduledPayments.service';
export const APIS = [BatchDomesticPaymentsService, BatchInternationalPaymentsService, DomesticPaymentsService, DomesticScheduledPaymentsService, DomesticStandingOrdersService, InternationalPaymentsService, InternationalScheduledPaymentsService];
