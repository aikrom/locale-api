import { Exception } from '@adonisjs/core/build/standalone'

const DEFAULT_MESSAGE = 'Not found'
const DEFAULT_STATUS = 404
const DEFAULT_CODE = 'E_NOT_FOUND'

export default class NotFoundException extends Exception {
  constructor(message = DEFAULT_MESSAGE) {
    super(message, DEFAULT_STATUS, DEFAULT_CODE)
  }
}
