import { createClient } from 'redis';

let redisClient;

const connectToRedis = async () => {
  if (redisClient) return redisClient;  // Return existing connection if it's already connected

  // Create a Redis client and establish a connection
  redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      tls: {
        rejectUnauthorized: true,  // Enforces certificate validation (secure connection)
        secureProtocol: 'TLS_method', // Ensure that Redis Cloud uses the correct TLS version
      },
    },
  });

  // Connect to Redis
  redisClient.connect();

  // Handle connection events
  redisClient.on('connect', () => {
    console.log('Connected to Redis...');
  });

  redisClient.on('ready', () => {
    console.log('Redis client is ready.');
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error: ', err);
  });

  return redisClient;
};

export default connectToRedis;
