import { TypeHandler } from './TypeHandler'
import { Collection } from '../collection'

export interface TypeRepository implements Collection<number> {
  /**
  * @return true if this instance is a type repository.
  */
  readonly isTypeRepository : boolean

  /**
  * Return true if the given type handler is registered into this repository.
  *
  * @param handler - An handler to search for.
  *
  * @return True if the given handler is registered into this repository.
  */
  hasHandler (handler : TypeHandler) : boolean

  /**
  * Return the handler associated with a given type.
  *
  * @param type - A type.
  *
  * @return The handler associated with the given type.
  */
  getHandlerOfType (type : number) : TypeHandler

  /**
  * Return the type associated with a given handler.
  *
  * @param handler - A component type handler.
  *
  * @return The type of the handler.
  */
  getTypeOfHandler (handler : TypeHandler) : number
}
