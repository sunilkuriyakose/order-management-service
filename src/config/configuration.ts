export default () => ({
  port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
  uri: 'mongodb+srv://sunilkuriyakose:kZLTw9SnIxSI0YgD@trdappcluster0.kn9kf.mongodb.net/',
  database: {
    port: parseInt(process.env.DATABASE_PORT, 10) || 27017,
    // uri: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_CLUSTER}:${process.env.DATABASE_PORT}/`,
    uri: 'mongodb+srv://sunilkuriyakose:kZLTw9SnIxSI0YgD@trdappcluster0.kn9kf.mongodb.net/',
  },
});
