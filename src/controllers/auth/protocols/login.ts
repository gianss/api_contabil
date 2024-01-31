import { HttpResponse } from '@/utils/protocols/http-response'

export interface Login {
    handle: (request: any) => Promise<HttpResponse>
}
