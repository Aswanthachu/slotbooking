import { createClient } from 'redis';

let redisClient;

const connectToRedis = async () => {
  if (redisClient) return redisClient;  // Return existing connection if it's already connected

  // Create a Redis client and establish a connection
  redisClient  = createClient({
    password: '1SVsucycxqYRPei6aCgjdVAHYjx21nIg',
    socket: {
        host: 'redis-11266.c323.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 11266,
        /*  tls: {
        rejectUnauthorized: true,  // Enforces certificate validation (secure connection)
        secureProtocol: 'TLS_method', // Ensure that Redis Cloud uses the correct TLS version
      },*/
    }
});

  // Connect to Redis
  await redisClient.connect();

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
