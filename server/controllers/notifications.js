const Notification = require("../models/notifications");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const getNotifications = async (req, res) => {
  const authHeaders = req.headers['refreshtoken'];
  const token = authHeaders && authHeaders.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send(err.message);
    }

    const userId = user._id;
    try {
      const notifications = await Notification.find({ userId }).sort({ date: -1 });
      return res.json(notifications);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
};

const createNotifications = async (req, res) => {
  const userId = "c1bdde39"; // replace with actual user ID

  const now = new Date();
  const notifications = [
    {
      userId,
      message: "<b>Notification</b> created now",
      date: now,
    },
    {
      userId,
      message: "<b>Notification</b> created 1 hour ago",
      date: new Date(now.getTime() - 3600000),
    },
    {
      userId,
      message: "<b>Notification</b> created 2 hours ago",
      date: new Date(now.getTime() - 7200000),
    },
    {
      userId,
      message: "<b>Notification</b> created 6 hours ago",
      date: new Date(now.getTime() - 21600000),
    },
    {
      userId,
      message: "<b>Notification</b> created 1 day ago",
      date: new Date(now.getTime() - 86400000),
    },
    {
      userId,
      message: "<b>Notification</b> created 3 days ago",
      date: new Date(now.getTime() - 259200000),
    },
    {
      userId,
      message: "<b>Notification</b> created 1 week ago",
      date: new Date(now.getTime() - 604800000),
    },
    {
      userId,
      message: "<b>Notification</b> created 6 weeks ago",
      date: new Date(now.getTime() - 3628800000),
    },
    {
      userId,
      message: "<b>Notification</b> created 12 weeks ago",
      date: new Date(now.getTime() - 7257600000),
    },
    {
      userId,
      message: "<b>Notification</b> created 24 weeks ago",
      date: new Date(now.getTime() - 14515200000),
    },
  ];

  try {
    const savedNotifications = await Notification.insertMany(notifications);
    return res.json(savedNotifications);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const createSwitchNotification = async (req, res) => {
  const userId = "c1bdde39"; // replace with actual user ID

  const now = new Date();
  const switchNotification = {
    userId,
    message: "<b>Switch notification</b> created now",
    type: "switch",
  };

  try {
    const savedNotification = await Notification.create(switchNotification);
    return res.json(savedNotification);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const createRouteNotification = async (req, res) => {
  const userId = "c1bdde39"; // replace with actual user ID

  const now = new Date();
  const routeNotification = {
    userId,
    message: "<b>Route notification</b> created now",
    type: "route",
  };

  try {
    const savedNotification = await Notification.create(routeNotification);
    return res.json(savedNotification);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const markAsRead = async (req, res) => {
  const authHeaders = req.headers['refreshtoken'];
  const token = authHeaders && authHeaders.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send(err.message);
    }

    const userId = user._id;
    const { notificationId } = req.params;

    try {
      const notification = await Notification.findOne({ _id: notificationId, userId });

      if (!notification) {
        return res.status(404).send("Notification not found");
      }

      notification.isRead = true;
      const updatedNotification = await notification.save();

      return res.json(updatedNotification);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
};

const deleteNotificationById = async (req, res) => {
  const authHeaders = req.headers['refreshtoken'];
  const token = authHeaders && authHeaders.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send(err.message);
    }

    const userId = user._id;
    const { notificationId } = req.params;

    try {
      const deletedCount = await Notification.deleteOne({ _id: notificationId, userId });

      if (deletedCount.deletedCount === 0) {
        return res.status(404).send("Notification not found or not owned by the user");
      }

      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
};


const createNotificationForOrganization = async (req, res) => {
  const authHeaders = req.headers['refreshtoken'];
  const token = authHeaders && authHeaders.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send(err.message);
    }

    const currentUser = await User.findById(user._id);

    if (!currentUser.isAdmin) {
      return res.status(403).send("User is not an admin");
    }

    const { message, type, routeTo } = req.body;

    if (type === "route" && !routeTo) {
      return res.status(400).send("RouteTo is required when type is 'route'");
    }

    const usersInOrganization = await User.find({ organization: currentUser.organization });

    const notifications = usersInOrganization.map(user => ({
      userId: user._id,
      message,
      type,
      routeTo: type === "route" ? routeTo : undefined,
    }));

    try {
      const savedNotifications = await Notification.insertMany(notifications);
      return res.json(savedNotifications);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotificationById,
  createNotificationForOrganization,
};