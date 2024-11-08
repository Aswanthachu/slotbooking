This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

After the dependencies are installed, you'll need to set up environment variables for Redis. Create a `.env` file in the root of the project and add the following:

```env
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password ```

Once the environment variables are set, you can seed local data into Redis by running the following command:

```bash
npm run seedRedis
```


This command will populate your Redis instance with the required data. Ensure your Redis server is running before executing this.


To run the project locally, use the following command to start the development server:

bash
Copy code
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
This will start the server at http://localhost:3000. You can now visit the URL in your browser to interact with the application.