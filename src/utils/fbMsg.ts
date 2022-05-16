import { getMessaging } from 'firebase-admin/messaging'

export function sendMsg(msg: { [key: string]: string }) {
  const message = {
    data: msg,
    topic: 'Cart'
  }
  return getMessaging().send(message)
}
