import { getMessaging } from 'firebase-admin/messaging'

export function sendMsg(regToken: string, msg: { [key: string]: string }) {
  const message = {
    data: msg,
    token: regToken
  }
  return getMessaging().send(message)
}
