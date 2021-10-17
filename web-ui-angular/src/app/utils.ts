/**
 *
 * @param hex can be an ethereum address or transaction hash
 * @returns
 */
export const shortenAddress = (hex: string): string => {
  if (hex.length != 42) return hex;
  const l = hex.length;
  return `${hex.substr(0, 6)}...${hex.substr(l - 4)}`;
};

export const shortenTxHash = (hex: string): string => {
  if (hex.length != 66) return hex;
  const l = hex.length;
  return `${hex.substr(0, 8)}...${hex.substr(l - 6)}`;
};
