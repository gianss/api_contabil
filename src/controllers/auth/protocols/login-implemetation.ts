import { HttpResponse } from '@/utils/protocols/http-response'

export interface LoginImplemetation {
    handle: (request: any) => Promise<HttpResponse>
}
