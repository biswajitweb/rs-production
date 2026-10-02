import { TAX } from "./staticImage";

export const calculateTax = (price, taxRate = TAX) => {
  const amount = Number(price) || 0;
  const tax = (amount * taxRate) / 100;

  return {
    tax: tax.toFixed(2),
    total: (amount + tax).toFixed(2),
  };
};
