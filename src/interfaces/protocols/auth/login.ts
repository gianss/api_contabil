import { HttpResponse } from '@/interfaces/usecases/http-response'

export interface Login {
    handle: (request: any) => Promise<HttpResponse>
}
