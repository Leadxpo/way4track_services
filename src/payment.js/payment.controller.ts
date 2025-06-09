const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.keyID||"rzp_test_NPT4UOaHTgxvZj",
  key_secret: process.env.keySecret||'V2S1KzGsJpfsVp6YsPlbdrOy',
});