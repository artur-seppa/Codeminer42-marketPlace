import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class StoreException extends Exception {
  constructor(message: string, status: number) {
    super(message, { status })
  }

  public async handle(error: this, { response }: HttpContext) {
    response.status(error.status).send({
      message: error.message,
    })
  }
}