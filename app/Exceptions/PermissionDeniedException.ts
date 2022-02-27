import { Exception } from '@adonisjs/core/build/standalone'

const DEFAULT_MESSAGE = 'Permission denied'
const DEFAULT_STATUS = 403
const DEFAULT_CODE = 'E_PERMISSION_DENIED'

export default class PermissionDeniedException extends Exception {
  constructor(message = DEFAULT_MESSAGE) {
    super(message, DEFAULT_STATUS, DEFAULT_CODE)
  }
}
