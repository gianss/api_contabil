import { HttpResponse } from '@/presentation/http/http-response'

export interface AddCustomerHandler {
    handle(request: any): Promise<HttpResponse>
}
