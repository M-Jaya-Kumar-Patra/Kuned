import Notification from "@/models/Notification";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string
) {

  await Notification.create({
    userId,
    title,
    message,
    type
  });

}