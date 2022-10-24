import bcrypt from "bcryptjs";

export const validPassword = async (password: string, userPassword: string) => {
  const isValid: boolean = await bcrypt.compare(password, userPassword);
  return isValid;
};
