import { Exception } from '@adonisjs/core/build/standalone'

const DEFAULT_MESSAGE = 'Alreadt exists'
const DEFAULT_STATUS = 400
const DEFAULT_CODE = 'E_ALREADY_EXISTS'

export default class AlreadyExistsException extends Exception {
  constructor(message = DEFAULT_MESSAGE) {
    super(message, DEFAULT_STATUS, DEFAULT_CODE)
  }
}
