/**
* An object able to handle a given type.
*/
export interface TypeHandler {
  /**
  * Instanciate an instance of the handled type.
  *
  * @return A new instance of the handled type.
  */
  instanciate () : any

  /**
  * Copy the state of an instance of the handled type into another one.
  *
  * @param origin - Instance of the handled type to copy.
  * @param target - Instance of the handled type to update.
  */
  copy (origin : any, target : any) : void

  /**
  * Reset an instance of the given type inner state.
  *
  * @param instance - The instance of the handled type to reset.
  */
  reset (instance : any) : void
}
