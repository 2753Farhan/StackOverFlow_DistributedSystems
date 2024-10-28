export const emitNotification = async (io, recipients, notification) => {
    try {
      io.emit("newNotification", {
        recipients,
        notification
      });
    } catch (error) {
      console.error("Socket emission error:", error);
    }
  };