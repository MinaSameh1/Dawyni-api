import { getMessaging } from 'firebase-admin/messaging'

export function sendMsg(token: string, msg: { [key: string]: string }) {
  const message = {
    // data: msg,
    notification: msg,
    token: token
  }
  return getMessaging().send(message)
}
