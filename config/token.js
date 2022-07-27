export default {
  algorithm: 'RS256',
  keys: {
    private: process.env.JWT_PRIVATE_KEY,
    public: process.env.JWT_PUBLIC_KEY,
  },
  expiresIn: '15m',
  refresh: {
    duration: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}
