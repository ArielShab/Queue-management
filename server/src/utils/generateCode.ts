// Generate random 6-digit code
export const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
