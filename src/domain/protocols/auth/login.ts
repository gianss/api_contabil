import { HttpResponse } from '@/presentation/http/http-response'

export interface Login {
    handle: (request: any) => Promise<HttpResponse>
}
