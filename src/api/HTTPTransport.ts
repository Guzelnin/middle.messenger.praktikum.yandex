export type QueryParams = Record<string, string | number | boolean | undefined>

export class APIError extends Error {
  status: number
  response: unknown

  constructor(status: number, response: unknown, message: string) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.response = response
  }
}

export default class HTTPTransport {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  get<T>(path: string, query?: QueryParams) {
    const params = new URLSearchParams()
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value))
    })
    const suffix = params.size ? `?${params.toString()}` : ''
    return this.request<T>('GET', `${path}${suffix}`)
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body)
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>('PUT', path, body)
  }

  delete<T>(path: string, body?: unknown) {
    return this.request<T>('DELETE', path, body)
  }

  private request<T>(method: string, path: string, body?: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(method, `${this.baseUrl}${path}`)
      xhr.withCredentials = true
      const isFormData = body instanceof FormData
      if (body !== undefined && !isFormData) {
        xhr.setRequestHeader('Content-Type', 'application/json')
      }
      xhr.onload = () => {
        let response: unknown = xhr.responseText
        if (xhr.responseText) {
          try {
            response = JSON.parse(xhr.responseText)
          } catch {
            response = xhr.responseText
          }
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response as T)
          return
        }
        const message =
          typeof response === 'object' &&
          response !== null &&
          'reason' in response
            ? String(response.reason)
            : `HTTP ${xhr.status}`
        reject(new APIError(xhr.status, response, message))
      }
      xhr.onerror = () =>
        reject(
          new APIError(
            xhr.status || 0,
            null,
            'Не удалось связаться с сервером',
          ),
        )
      xhr.ontimeout = () =>
        reject(
          new APIError(
            xhr.status || 0,
            null,
            'Время ожидания ответа сервера истекло',
          ),
        )
      xhr.timeout = 15000
      if (body === undefined) xhr.send()
      else xhr.send(isFormData ? (body as FormData) : JSON.stringify(body))
    })
  }
}
