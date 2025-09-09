export interface HttpResponse {
    statusCode: number;
    body?: any;
    headers?: Record<string, string>;
}

export interface HttpSucess extends HttpResponse {
    statusCode: 200 | 201 | 204;
}

export interface HttpError extends HttpResponse {
    statusCode: 400 | 401 | 403 | 404 | 500;
    error: string;
    details?: any;
}