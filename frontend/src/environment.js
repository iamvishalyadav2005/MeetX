let IS_PROD = false;
const server = IS_PROD ?
    "https://meetx-backend-8ym6.onrender.com" :

    "http://192.168.1.5:8000";  // ← your laptop IP, NOT localhost


export default server;