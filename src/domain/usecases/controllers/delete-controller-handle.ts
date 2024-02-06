import { User } from '@/domain/protocols/user'
import { HttpResponse } from '@/presentation/http/http-response'

export interface DeleteControllerHandler {
    handle(id: number, loggedUser: User): Promise<HttpResponse>
}
