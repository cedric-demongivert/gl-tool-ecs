import { Component } from './Component'

/**
* A component type.
*/
export interface ComponentType<Type extends Component> {
  /**
  * Instantiate a component of this type.
  *
  * @param entity - Parent entity of the component to instantiate.
  * @param identifier - Identifier of the component to instantiate.
  *
  * @return A new component of this type.
  */
  instantiate (entity : number, identifier : number) : Type

  /**
  * Copy the state of an instance of this type into another one.
  *
  * @param origin - Instance of this type to copy.
  * @param target - Instance of this type to update.
  */
  copy (origin : Type, target : Type) : void

  /**
  * Reset an instance of this type.
  *
  * @param instance - The instance of this type to reset.
  */
  clear (instance : Type) : void
}
