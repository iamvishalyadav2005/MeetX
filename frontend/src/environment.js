let IS_PROD = true;

const server = IS_PROD
  ? "https://meetx-backend-8ym6.onrender.com"
  : "http://localhost:8000";

export default server;