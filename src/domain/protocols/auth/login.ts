import { HttpResponse } from '@/domain/usecases/http-response'

export interface Login {
    handle: (request: any) => Promise<HttpResponse>
}
