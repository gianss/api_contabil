import { BcryptAdapterInterface } from '@/interfaces/protocols/auth'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements BcryptAdapterInterface {
    constructor(readonly salt: number) { }
    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}
