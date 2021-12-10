const generateResponse = (message: string, data?: any) => {
  return { message, data: data ?? {} };
};

export { generateResponse };
