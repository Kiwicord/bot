export const formatCurrency = (amt: number | undefined) =>
  amt ? `**${new Intl.NumberFormat("en-US").format(amt)}🥝**` : amt;
