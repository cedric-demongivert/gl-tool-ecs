import { ComponentType } from './ComponentType'
import { Entity } from './Entity'

export class Component<Data> {
  /**
  * Identifier of this component.
  */
  public readonly identifier : number

  /**
  * Identifier of this component entity.
  */
  public readonly entity : Entity

  /**
  * Type of this component.
  */
  public readonly type : ComponentType<Data>

  /**
  * Data stored into this component.
  */
  public data : Data

  /**
  * Instantiate a new component object.
  *
  * @param entity - Entity of the component to instantiate.
  * @param type - Type of component to instantiate.
  * @param identifier - Unique number associated to this new component.
  */
  public constructor (entity : Entity, type : ComponentType<Data>, identifier : number) {
    this.type = type
    this.identifier = identifier
    this.entity = entity
    this.data = type.instantiate()
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Component) {
      return other.identifier === this.identifier
    }

    return false
  }
}
