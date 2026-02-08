const DeviceToken = require('../models/DeviceToken');

const registerDeviceToken = async (req, res, next) => {
  try {
    const { token, deviceType } = req.body;
    const userId = req.user.id;

    const existingToken = await DeviceToken.findOne({ token });

    if (existingToken) {
      if (existingToken.userId.toString() !== userId) {
        existingToken.userId = userId;
        existingToken.deviceType = deviceType || existingToken.deviceType;
        await existingToken.save();
      }
    } else {
      const deviceToken = new DeviceToken({
        userId,
        token,
        deviceType: deviceType || 'android',
      });
      await deviceToken.save();
    }

    res.json({
      success: true,
      message: 'Device token registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerDeviceToken };
