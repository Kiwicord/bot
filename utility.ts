export const formatCurrency = (amt: any) =>
  amt ? `**${new Intl.NumberFormat("en-US").format(amt)}🥝**` : amt;
