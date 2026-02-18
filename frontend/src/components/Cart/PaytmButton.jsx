import React from "react";
import PaytmCheckout from "paytm-blink-checkout-react";
import { CheckoutProvider, Checkout, injectCheckout} from 'paytm-blink-checkout-react'

const PaytmButton = ({  amount, onSuccess, onError }) => {
  const config = {
    root: "",
    flow: "DEFAULT", // use "SEAMLESS" if you want seamless checkout
    data: {
    //   orderId: orderId,      // must be unique for every transaction
    //   token: txnToken,       // generated on your backend from Paytm Initiate API
      tokenType: "TXN_TOKEN",
      amount: amount.toString(),
    },
    handler: {
      notifyMerchant: (eventName, data) => {
        if (eventName === "APP_CLOSED") {
          console.log("Paytm modal closed", data);
        }
      },
      transactionStatus: (paymentStatus) => {
        if (paymentStatus.STATUS === "TXN_SUCCESS") {
          onSuccess(paymentStatus);
        } else {
          onError(paymentStatus);
        }
      },
    },
  };

  const startPayment = () => {
    const checkout = new PaytmCheckout(config);
    checkout.open();
  };

  return (<>
    <CheckoutProvider config={config}>
  <Checkout />
</CheckoutProvider>
    <button
      className="w-full bg-indigo-600 text-white py-3 rounded mt-3"
      onClick={startPayment}
    >
      Pay with Paytm
    </button>
  </>);
};

export default PaytmButton;
