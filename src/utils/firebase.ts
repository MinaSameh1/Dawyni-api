import * as admin from 'firebase-admin'

const account = JSON.parse(process.env['fbJson'] || '')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(account)
})

const auth = firebase.auth

/**
 * disconnect from firebase
 */
export async function disconnect() {
  await firebase.delete()
}

export { auth, firebase }
