import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-donation-page',
  templateUrl: './donation-page.component.html',
  styleUrls: ['./donation-page.component.scss']
})
export class DonationPageComponent implements OnInit {

  loginDetails;
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;
  showCancel: boolean;
  showError: boolean;

  constructor(public commonService: CommonService) {
    if (this.commonService.loginDetails != undefined) {
      this.loginDetails = 'Welcome ' + this.commonService.loginDetails;
    }
   }

  ngOnInit(): void {
    this.initConfig();
  }

  initConfig() {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;
      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
    }

}
