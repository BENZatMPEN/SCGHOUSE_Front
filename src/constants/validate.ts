export const ValidateNumberOnly = (val: string) => {
  const reg = /^\d*\.?\d*$/;
  return reg.test(val);
};
