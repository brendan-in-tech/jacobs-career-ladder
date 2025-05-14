import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  window: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per window
});

export default limiter; 