import { Exception } from '@adonisjs/core/build/standalone'

const DEFAULT_MESSAGE = 'Bad request'
const DEFAULT_STATUS = 400
const DEFAULT_CODE = 'E_BAD_REQUEST'

export default class BadRequestException extends Exception {
  constructor(message = DEFAULT_MESSAGE) {
    super(message, DEFAULT_STATUS, DEFAULT_CODE)
  }
}
