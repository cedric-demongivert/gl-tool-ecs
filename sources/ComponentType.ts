/**
* A component type.
*/
export interface ComponentType<Type> {
  /**
  * Instantiate a data object stored by a component of this type.
  *
  * @return A new data object stored by a component of this type.
  */
  instantiate(...parameters: any[]): Type

  /**
  * Copy the state of an instance of this type into another one.
  *
  * @param origin - Instance of this type to copy.
  * @param target - Instance of this type to update.
  */
  copy?(origin: Type, target: Type): void

  /**
  * Reset an instance of this type.
  *
  * @param instance - The instance of this type to reset.
  */
  clear?(instance: Type): void
}
