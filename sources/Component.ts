

import { ComponentType } from './ComponentType'
import { Entity } from './Entity'

/**
 * A component, eg. an object that hold some information in relation with an entity
 * of a given Entity-Component-System. 
 */
export class Component<Data> {
  /**
  * Identifier of this component in it's Entity-Component-System.
  */
  public readonly identifier: number

  /**
  * Identifier of the related entity.
  */
  public readonly entity: Entity

  /**
  * Type of information stored by this component.
  */
  public readonly type: ComponentType<Data>

  /**
  * The information stored by this component.
  */
  public data: Data

  /**
  * Instantiate a new component object.
  *
  * @param entity - Entity of the component to instantiate.
  * @param type - Type of component to instantiate.
  * @param identifier - Unique number associated to this new component.
  * @param [...parameters] - Additionnal(s) parameter(s) to pass to the instantiate method of the given type.
  */
  public constructor(entity: Entity, type: ComponentType<Data>, identifier: number, ...parameters: any[]) {
    this.type = type
    this.identifier = identifier
    this.entity = entity
    this.data = this.type.instantiate(...parameters)
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Component) {
      return (
        other.identifier === this.identifier &&
        other.entity === this.entity &&
        other.type === this.type &&
        (other.data.equals ? other.data.equals(this.data) : other.data === this.data)
      )
    }

    return false
  }
}

/**
 * 
 */
export namespace Component {
  /**
   * 
   */
  export function equals(left: Component<any> | null | undefined, right: Component<any> | null | undefined): boolean {
    return left == null ? left === right : left.equals(right)
  }
}
