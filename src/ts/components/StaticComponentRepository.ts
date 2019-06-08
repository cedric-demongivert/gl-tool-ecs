import { Collection, View, BufferedNumberSet, Cursor } from '../collection'
import { ComponentRepository } from './ComponentRepository'

export class StaticComponentRepository implements ComponentRepository {
  /**
  * Create a new empty static component repository with a given capacity.
  *
  * @param [capacity = 2048] - Number of component to store.
  *
  * @return The new empty static component repository.
  */
  public static create (capacity : number = 2048) {
    return new StaticComponentRepository(capacity)
  }

  /**
  * Copy an existing static component repository.
  *
  * @param toCopy - A static component repository to copy.
  *
  * @return A new repository that is a copy of the given one.
  */
  public static copy (
    toCopy : StaticComponentRepository
  ) : StaticComponentRepository {
    const result : StaticComponentRepository = new StaticComponentRepository(
      toCopy.capacity
    )

    for (let index = 0, size = toCopy.size; index < size; ++index) {
      const component : number = toCopy.get(index)
      result.add(
        component,
        toCopy.getEntityOfComponent(component),
        toCopy.getTypeOfComponent(component),
        toCopy.getInstanceOfComponent(component)
      )
    }

    return result
  }

  private _components               : BufferedNumberSet
  private _types                    : Uint32Array
  private _entities                 : Uint32Array
  private _instances                : any[]
  private _cursor                   : Cursor

  private _symbol                   : any

  /**
  * Create a new empty static component repository with a given capacity.
  *
  * @param [capacity = 2048] - Number of component to store.
  */
  public constructor (capacity : number = 2048) {
    this._components = new BufferedNumberSet(capacity)
    this._types = new Uint32Array(capacity)
    this._entities = new Uint32Array(capacity)
    this._instances = new Array<any>(capacity)
    this._cursor = new Cursor(this._components)

    this._symbol = Symbol()
  }

  /**
  * @return The number of components that this repository can store.
  */
  public get capacity () : number {
    return this._components.capacity
  }

  /**
  * @see ComponentRepository.size
  */
  public get size () : number {
    return this._components.size
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see ComponentRepository.isComponentRepository
  */
  public get isComponentRepository () : boolean {
    return true
  }

  public next () : number {
    return this._cursor.next()
  }

  /**
  * Update the capacity of this component repository.
  *
  * @param capacity - New number of components that this repository can store.
  */
  public reallocate (capacity : number) : void {
    for (let index = 0, size = this._components.size; index < size; ++index) {
      if (this._components.get(index) >= capacity) {
        this.delete(this._components.get(index))
      }
    }

    this._components.reallocate(capacity)
    this._instances.length = capacity

    const oldEntities : Uint32Array = this._entities
    const oldTypes : Uint32Array = this._types

    this._entities = new Uint32Array(capacity)
    this._entities.set(oldEntities.subarray(0, capacity))
    this._types = new Uint32Array(capacity)
    this._types.set(oldTypes.subarray(0, capacity))
  }

  /**
  * Fit this repository allocated memory to its content.
  */
  public fit () : void {
    this._components.fit()
    this._instances.length = this._components.capacity

    const oldEntities : Uint32Array = this._entities
    const oldTypes : Uint32Array = this._types

    this._entities = new Uint32Array(this._components.capacity)
    this._entities.set(oldEntities.subarray(0, this._components.capacity))
    this._types = new Uint32Array(this._components.capacity)
    this._types.set(oldTypes.subarray(0, this._components.capacity))
  }

  /**
  * Create a component into the repository.
  *
  * @param entity - Entity that will be the parent of the component to add.
  * @param type - The type of component to add.
  * @param instance - Instance of the component to add.
  *
  * @return The identifier of the added component.
  */
  public create (
    entity : number,
    type : number,
    instance : any
  ) : number {
    const component : number = this._cursor.next()

    this.add(component, entity, type, instance)

    return component
  }

  /**
  * Add a component into the repository.
  *
  * @param identifier - Identifier of the component to add.
  * @param entity - Entity that will be the parent of the component to add.
  * @param type - The type of component to add.
  * @param instance - Instance of the component to add.
  */
  public add (
    identifier : number,
    entity : number,
    type : number,
    instance : any
  ) : void {
    if (instance[this._symbol]) this.delete(instance[this._symbol])
    if (this._instances[identifier]) this.delete(identifier)

    this._instances[identifier] = instance
    instance[this._symbol] = identifier
    this._components.add(identifier)
    this._entities[identifier] = entity
    this._types[identifier] = type
  }

  /**
  * Remove a component from this repository.
  *
  * @param identifier - Identifier of the component to remove.
  */
  public delete (identifier : number) : void {
    if (this._instances[identifier]) {
      delete this._instances[identifier][this._symbol]
      this._instances[identifier] = null
      this._components.delete(identifier)
      this._entities[identifier] = 0
      this._types[identifier] = 0

      if (identifier < this._cursor.next()) this._cursor.move(identifier)
    }
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._components.get(index)
  }

  /**
  * @see ComponentRepository.getEntityOfComponent
  */
  public getEntityOfComponent (identifier : number) : number {
    return this._entities[identifier]
  }

  /**
  * @see ComponentRepository.getInstanceOfComponent
  */
  public getInstanceOfComponent (identifier : number) : any {
    return this._instances[identifier]
  }

  /**
  * @see ComponentRepository.getTypeOfComponent
  */
  public getTypeOfComponent (identifier : number) : number {
    return this._types[identifier]
  }

  /**
  * @see ComponentRepository.getComponentOfInstance
  */
  public getComponentOfInstance (instance : any) : number {
    return instance[this._symbol]
  }

  /**
  * @see Collection.has
  */
  public has (identifier : number) : boolean {
    return this._components.has(identifier)
  }

  /**
  * @see Collection.clear
  */
  public clear () : void {
    while (this._components.size > 0) {
      this.delete(this._components.get(0))
    }
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
    yield * this._components
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof StaticComponentRepository) {
      if (other.size !== this._components.size) return false

      for (let index = 0, size = this._components.size; index < size; ++index) {
        const component : number = other.get(index)

        if (
          !this._components.has(component) ||
          this._entities[component] !== other.getEntityOfComponent(component) ||
          this._types[component] !== other.getTypeOfComponent(component) ||
          this._instances[component] !== other.getInstanceOfComponent(component)
        ) return false
      }

      return true
    }

    return false
  }
}
