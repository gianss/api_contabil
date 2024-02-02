import { HashComparator, HashGenerator } from '@/domain/usecases/auth'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashComparator, HashGenerator {
    constructor(readonly salt: number) { }
    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.salt)
    }
}
