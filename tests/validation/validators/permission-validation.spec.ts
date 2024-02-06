import { UnauthorizedError } from '@/presentation/errors'
import { PermissionValidation } from '@/validation/validators/permission-validation'
import { userResponse } from '@/tests/mocks/mock-user'

const userRes = userResponse('company')

interface SutTypes {
  sut: PermissionValidation
}

const makeSut = async (): Promise<SutTypes> => {
  const user = await userRes
  return {
    sut: new PermissionValidation(user)
  }
}

describe('permission Validation', () => {
  test('Should return an error if company_id invalid other company', async () => {
    const { sut } = await makeSut()
    const user = await userRes
    const error = sut.validate(user.company_id + 1)
    expect(error).toEqual(new UnauthorizedError())
  })
})
