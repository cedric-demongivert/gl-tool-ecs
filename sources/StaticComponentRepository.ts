import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { Entity } from './Entity'
import { ComponentType } from './ComponentType'
import { Component } from './Component'

import { ComponentRepository } from './ComponentRepository'

export class StaticComponentRepository implements ComponentRepository {
  private _identifiers : IdentifierSet
  private _components  : Pack<Component>
  private _types       : Pack<ComponentType<Component>>

  /**
  * Create a new empty static component repository with a given capacity.
  *
  * @param [capacity = 2048] - Number of component to store.
  */
  public constructor (capacity : number = 2048) {
    this._identifiers = IdentifierSet.allocate(capacity)
    this._components  = Pack.any(capacity)
    this._types       = Pack.any(capacity)
  }

  /**
  * @return The number of component that this repository can store.
  */
  public get capacity () : number {
    return this._identifiers.capacity
  }

  /**
  * @see ComponentRepository.size
  */
  public get size () : number {
    return this._identifiers.size
  }

  /**
  * Update the capacity of this component repository.
  *
  * @param capacity - The new number of component that this repository can store.
  */
  public reallocate (capacity : number) : void {
    this._components.reallocate(capacity)
    this._identifiers.reallocate(capacity)
    this._types.reallocate(capacity)
  }

  /**
  * Fit this repository allocated memory to its content.
  */
  public fit () : void {
    this._identifiers.fit()
    this._components.reallocate(this._identifiers.capacity)
    this._types.reallocate(this._identifiers.capacity)
  }

  /**
  * @see ComponentRepository.create
  */
  public create <Type extends Component> (entity : number, type : ComponentType<Type>) : Type {
    const identifier : number = this._identifiers.next()
    const instance   : Type   = type.instantiate(entity, identifier)

    this._components.set(identifier, instance)
    this._types.set(identifier, type)

    return instance
  }

  /**
  * @see ComponentRepository.delete
  */
  public delete (identifier : number) : void
  public delete (component : Component) : void
  public delete (parameter : number | Component) : void {
    const identifier : number = typeof parameter === 'number' ? parameter : parameter.identifier

    this._components.set(identifier, undefined)
    this._types.set(identifier, undefined)
    this._identifiers.delete(identifier)
  }

  /**
  * @see ComponentRepository.getNth
  */
  public getNth (index : number) : Component {
    return this._components.get(this._identifiers.get(index))
  }

  /**
  * @see ComponentRepository.indexOf
  */
  public indexOf (component : Component) : number {
    return this._identifiers.indexOf(component.identifier)
  }

  /**
  * @see ComponentRepository.get
  */
  public get (identifier : number) : Component
  public get <Type extends Component> (identifier : number, type : ComponentType<Type>) : Type
  public get (identifier : number, type? : ComponentType<Component>) : Component {
    if (type == null || this._types.get(identifier) === type) {
      return this._components.get(identifier)
    } else {
      return undefined
    }
  }

  /**
  * @see ComponentRepository.getType
  */
  public getType (identifier : number) : ComponentType<any>
  public getType <Type extends Component> (component : Type) : ComponentType<Type>
  public getType <Type extends Component> (parameter : number | Type) : ComponentType<Type> | ComponentType<any> {
    return this._types.get(
      typeof parameter === 'number' ? parameter : parameter.identifier
    ) as ComponentType<Type>
  }

  /**
  * @see ComponentRepository.has
  */
  public has (identifier : number) : boolean
  public has (component : Component) : boolean
  public has (parameter : number | Component) : boolean {
    return this._identifiers.has(
      typeof parameter === 'number' ? parameter : parameter.identifier
    )
  }

  public clone () : StaticComponentRepository {
    const result : StaticComponentRepository = new StaticComponentRepository(this.capacity)

    for (let index = 0, size = this._identifiers.size; index < size; ++index) {
      const identifier : number = this._identifiers.get(index)
      const component : Component = this._components.get(identifier)
      const type : ComponentType<Component> = this._types.get(identifier)
      const copy : Component = type.instantiate(component.entity, identifier)

      type.copy(component, copy)

      result._identifiers.add(identifier)
      result._components.set(identifier, copy)
      result._types.set(identifier, type)
    }

    return result
  }

  /**
  * @see ComponentRepository.clear
  */
  public clear () : void {
    while (this._components.size > 0) {
      this.delete(this._components.get(0))
    }
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<Component> {
    for (const identifier of this._identifiers) {
      yield this._components.get(identifier)
    }
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof StaticComponentRepository) {
      if (other.size !== this._identifiers.size) return false

      for (let index = 0, size = this._identifiers.size; index < size; ++index) {
        const identifier : number = this._identifiers.get(index)

        if (
          !other.has(identifier) ||
          this._types.get(identifier) !== other.getType(identifier) ||
          !this._components.get(identifier).equals(other.get(identifier))
        ) { return false }
      }

      return true
    }

    return false
  }
}

export namespace StaticComponentRepository {
  /**
  * Create a new empty static component repository with a given capacity.
  *
  * @param [capacity = 2048] - Number of component to store.
  *
  * @return The new empty static component repository.
  */
  export function allocate (capacity : number = 2048) : StaticComponentRepository {
    return new StaticComponentRepository(capacity)
  }

  /**
  * Copy an existing static component repository.
  *
  * @param toCopy - A static component repository to copy.
  *
  * @return A new repository that is a copy of the given one.
  */
  export function copy (toCopy : StaticComponentRepository) : StaticComponentRepository {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
