export {};

declare global {
  interface Window {
    Cashfree: {
      new (options: { mode: "sandbox" | "production" }): {
        checkout: (options: {
          paymentSessionId: string;
          redirectTarget?: "_self" | "_blank" | "_modal";
        }) => void;
      };
    };
  }
}

declare module "@cashfreepayments/cashfree-js" {
  export function load(options: {
    mode: "sandbox" | "production";
  }): Promise<{
    checkout: (options: {
      paymentSessionId: string;
      redirectTarget?: "_self" | "_blank" | "_modal";
    }) => Promise<void>;
  }>;
}