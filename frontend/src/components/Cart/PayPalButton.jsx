import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


const PayPalButton = ({amount,onSuccess,onError}) => {
// const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const clientId = "Afxl4LS4nci7sVQ-3zINwmA94JLWVzt9R-H8GXGarkjWC_Eo-U2x3QiNheu7GSWLMRHXklXkdGBBTisg";
// const usdAmount = (amount / someRate).toFixed(2);
  return (
    <PayPalScriptProvider options={{"client-id": clientId,currency: "USD"}}>
        <PayPalButtons style={{layout:'vertical'}}
        createOrder={(data,actions)=>{
            return actions.order.create({
                purchase_units:[{amount:{value:parseFloat(amount).toFixed(2), currency_code: "USD" }}]
            })
        }}
        onApprove={(data,actions)=>{
            return actions.order.capture().then(onSuccess)
        }}
        onError={onError}
        />
        
    </PayPalScriptProvider>
  )
}

export default PayPalButton
