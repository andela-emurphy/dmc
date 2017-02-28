export default {
  FACE_BOOK: {
    consumerKey: process.env.FACEBOOK_CONSUMER_KEY,
    consumerSecret: process.env.FACEBOOK_CONSUMER_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  },
  TWITTER: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
  },
  GOOGLE: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
  },
  SERVER: {
    SECRET: process.env.SECRET
  }
};
