import jwt from 'jsonwebtoken'
import config from 'config'
import logger from './logger'
import { auth } from './firebase'

const privateKey = config.get<string>('privateKey')
const publicKey = config.get<string>('publicKey')

export function signJwt(
  object: Record<string, unknown>,
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(object, privateKey, {
    ...(options && options), // This checks that options are defined
    algorithm: 'RS256' // We needed to spread our options so we can add this.
  })
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (e: any) {
    logger.error(e)
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null
    }
  }
}

export async function FBverifyIdToken(idToken: string) {
  try {
    const decoded = await auth.verifyIdToken(idToken)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (err: any) {
    // logger.error(e)
    logger.error('FB verifyToken error:' + err.message)
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null
    }
  }
}
