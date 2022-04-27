import * as admin from 'firebase-admin'

const firebaseConfig = {
  apiKey: process.env['apiKey'],
  authDomain: process.env['authDomain'],
  projectId: process.env['projectId'],
  storageBucket: process.env['storageBucket'],
  messagingSenderId: process.env['messagingSenderId'],
  appId: process.env['appId'],
  measurementId: process.env['measurementId']
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const account = require('./constants/fb.json')

const firebase = admin.initializeApp(firebaseConfig)
// const firebase = admin.initializeApp({
//   credential: admin.credential.cert(account)
// })

const auth = firebase.auth()

/**
 * disconnect from firebase
 */
export async function disconnect() {
  await firebase.delete()
}

export { auth, firebase }
