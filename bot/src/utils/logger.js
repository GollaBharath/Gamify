const logError = (context, error) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [BOT_ERROR] [Context: ${context}]:`, error);
};

const logInfo = (context, message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [BOT_INFO] [Context: ${context}]: ${message}`);
};

module.exports = {
  logError,
  logInfo
};
