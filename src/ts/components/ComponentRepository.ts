import { Collection } from '../collection'

export interface ComponentRepository extends Collection<number> {
  /**
  * @return True if this instance is a component repository.
  */
  readonly isComponentRepository : boolean

  /**
  * Return the entity that possess the component with the given identifier.
  *
  * @param identifier - A component identifier to search for.
  *
  * @return The entity that possess the given component.
  */
  getEntityOfComponent (identifier : number) : number

  /**
  * Return the instance of a given component.
  *
  * @param identifier - Identifier of the component to get.
  *
  * @return The instance of the given component.
  */
  getInstanceOfComponent (identifier : number) : any

  /**
  * Return the type of a given component.
  *
  * @param identifier - Identifier of the component to get.
  *
  * @return The type of the given component.
  */
  getTypeOfComponent (identifier : number) : number

  /**
  * Return the identifier of a component instance.
  *
  * @param instance - A component instance.
  *
  * @return The identifier of the given component instance.
  */
  getComponentOfInstance (instance : any) : number
}
