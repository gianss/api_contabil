import { User } from '@/domain/protocols/user'
import { UnauthorizedError } from '../../presentation/errors'
import { Validation } from '../protocols'

export class PermissionValidation implements Validation {
  constructor(
    private readonly user: User
  ) { }

  validate(codCompany: number): Error {
    if (this.user.type !== 'administrator') {
      if (this.user.company_id !== codCompany) {
        return new UnauthorizedError()
      }
    } else {
      return new UnauthorizedError()
    }
  }
}
