import { HttpErrorMessages } from './http-error-messages.type';

export const HTTP_ERROR_MESSAGES: HttpErrorMessages = {
  0: {
    title: 'Network Problem',
    message:
      'Unable to connect to the server. Please check your internet connection.',
  },
  400: {
    title: 'Bad Request',
    message: 'The request could not be understood by the server.',
  },
  401: {
    title: 'Unauthorized',
    message: 'Please log in to access this resource.',
  },
  403: {
    title: 'Forbidden',
    message: 'You do not have permission to perform this action.',
  },
  404: {
    title: 'Not Found',
    message: 'The resource you are looking for could not be found.',
  },
  408: {
    title: 'Request Timeout',
    message: 'The server took too long to respond. Please try again later.',
  },
  429: {
    title: 'Too Many Requests',
    message:
      'You have made too many requests in a short period. Please try again later.',
  },
  500: {
    title: 'Internal Server Error',
    message:
      'An unexpected error occurred on the server. Please try again later.',
  },
  502: {
    title: 'Bad Gateway',
    message: 'The server received an invalid response. Please try again later.',
  },
  503: {
    title: 'Service Unavailable',
    message: 'The server is currently unavailable. Please try again later.',
  },
  504: {
    title: 'Gateway Timeout',
    message: 'The server did not respond in time. Please try again later.',
  },
};
