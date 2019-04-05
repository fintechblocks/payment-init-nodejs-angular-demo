import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './configuration';

import { BatchDomesticPaymentsService } from './api/batchDomesticPayments.service';
import { BatchInternationalPaymentsService } from './api/batchInternationalPayments.service';
import { DomesticPaymentsService } from './api/domesticPayments.service';
import { DomesticScheduledPaymentsService } from './api/domesticScheduledPayments.service';
import { DomesticStandingOrdersService } from './api/domesticStandingOrders.service';
import { InternationalPaymentsService } from './api/internationalPayments.service';
import { InternationalScheduledPaymentsService } from './api/internationalScheduledPayments.service';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [],
  exports:      [],
  providers: [
    BatchDomesticPaymentsService,
    BatchInternationalPaymentsService,
    DomesticPaymentsService,
    DomesticScheduledPaymentsService,
    DomesticStandingOrdersService,
    InternationalPaymentsService,
    InternationalScheduledPaymentsService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        }
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import your base AppModule only.');
        }
    }
}
