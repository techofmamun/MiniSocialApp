const { Expo } = require('expo-server-sdk');
const DeviceToken = require('../models/DeviceToken');

const expo = new Expo();

/**
 * Send push notification to a user
 * @param {String} userId - User ID to send notification to
 * @param {Object} notification - Notification payload
 */
const sendNotification = async (userId, notification) => {
  try {
    const deviceTokens = await DeviceToken.find({ userId }).lean();

    if (deviceTokens.length === 0) {
      return;
    }

    const tokens = deviceTokens.map(dt => dt.token);

    const messages = [];
    for (const pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      });
    }

    if (messages.length === 0) {
      return;
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        continue;
      }
    }

    const invalidTokens = [];
    tickets.forEach((ticket, idx) => {
      if (ticket.status === 'error') {
        if (ticket.details?.error === 'DeviceNotRegistered') {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    if (invalidTokens.length > 0) {
      await DeviceToken.deleteMany({ token: { $in: invalidTokens } });
    }

    return tickets;
  } catch (error) {
  }
};

module.exports = { sendNotification };
