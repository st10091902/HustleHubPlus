const currencyFormatter =
  new Intl.NumberFormat(
    "en-ZA",
    {
      style: "currency",
      currency: "ZAR"
    }
  );

const formatCurrency = (
  value
) => {
  const amount =
    Number(value);

  if (
    Number.isNaN(amount)
  ) {
    return "R0.00";
  }

  return currencyFormatter.format(
    amount
  );
};

export default formatCurrency;