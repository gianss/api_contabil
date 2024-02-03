import { User } from '@/domain/protocols/user'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
  }
}
