"use client";

import { useEffect } from "react";
import type {
  CreateOrderActions,
  OnApproveActions,
} from "@paypal/paypal-js";
interface PayPalButtonProps {
  amount: number;
  items: {
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
  }[];
  email?: string;
  isAuthenticated: boolean;
}

export const PayPalButton = ({
  amount,
  items,
  email,
  isAuthenticated,
}: PayPalButtonProps) => {
  useEffect(() => {
    const renderPayPal = () => {
      const container = document.getElementById("paypal-button-container");
      if (!container || !(window as any).paypal?.Buttons) return;
      container.innerHTML = "";

      (window as any).paypal.Buttons({
        createOrder: (_: unknown, actions: CreateOrderActions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [{
              amount: { currency_code: "MXN", value: amount.toFixed(2) },
            }],
          });
        },
        onApprove: async (_: unknown, actions: OnApproveActions) => {
          const order = await actions.order?.capture();
          console.log("✅ Orden capturada:", order);

          const payload = isAuthenticated
            ? { items }
            : { email, items };

          const endpoint = isAuthenticated ? "/api/purchase" : "/api/send-code";

          await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(payload),
          });

          alert("¡Pago completado!");
        },
        onError: (err: unknown) => {
          console.error("❌ Error en el pago:", err);
          alert("Hubo un problema con el pago.");
        },
      }).render("#paypal-button-container");
    };

    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = "https://www.paypal.com/sdk/js?client-id=AclD4HldoJqk1SWEcdlYb-SCDqHnPAcVpyZPyCv0n_qj6u9orlhNURREq2yyilEr-REwfq-bYEuZoWXa&currency=MXN";
      script.async = true;
      script.onload = renderPayPal;
      document.body.appendChild(script);
    } else {
      renderPayPal();
    }
  }, [amount, items, email, isAuthenticated]);

  return <div id="paypal-button-container" style={{ minHeight: "50px" }} />;
};
