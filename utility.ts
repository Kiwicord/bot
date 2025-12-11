export const formatCurrency = (amt: any) =>
  `**${new Intl.NumberFormat("en-US").format(amt)}🥝**`;
