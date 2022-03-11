import { initializeApp } from 'firebase-admin'

const firebaseConfig = {
  apiKey: process.env['apiKey'],
  authDomain: process.env['authDomain'],
  projectId: process.env['projectId'],
  storageBucket: process.env['storageBucket'],
  messagingSenderId: process.env['messagingSenderId'],
  appId: process.env['appId'],
  measurementId: process.env['measurementId']
}

const initFb = () => initializeApp(firebaseConfig)

export default initFb
