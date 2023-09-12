export const isMongoId = (id: string) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export const generateUsernameFromEmail = (email: string) => {
  return email.split("@")[0] + Math.floor(Math.random() * 10000);
}