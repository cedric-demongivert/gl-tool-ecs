import { EntityComponentSystem } from './EntityComponentSystem'

export class EntityComponentSystemBuilder {
  private _entities : number
  private _tags : number
  private _types : number
  private _components : number

  /**
  * Create a new default entity-component-system-builder.
  */
  public constructor () {
    this._entities = 1024
    this._tags = 16
    this._types = 256
    this._components = 4096
  }

  /**
  * Build the described entity-component-system and return it.
  */
  public build () : EntityComponentSystem {
    return new EntityComponentSystem(this)
  }

  /**
  * @return The number of entities that the entity-component-system to build can store.
  */
  public get entities () : number {
    return this._entities
  }

  /**
  * Update the number of entities that the entity-component-system to build can store.
  *
  * @param entities - The new number of entities that the entity-component-system to build can store.
  */
  public set entities (entities : number) {
    this._entities = entities
  }

  /**
  * @return The number of tags that the entity-component-system to build can store.
  */
  public get tags () : number {
    return this._tags
  }

  /**
  * Update the number of tags that the entity-component-system to build can store.
  *
  * @param tags - The new number of tags that the entity-component-system to build can store.
  */
  public set tags (tags : number) {
    this._tags = tags
  }

  /**
  * @return The number of types that the entity-component-system to build can store.
  */
  public get types () : number {
    return this._types
  }

  /**
  * Update the number of types that the entity-component-system to build can store.
  *
  * @param types - The new number of types that the entity-component-system to build can store.
  */
  public set types (types : number) {
    this._types = types
  }

  /**
  * @return The number of components that the entity-component-system to build can store.
  */
  public get components () : number {
    return this._components
  }

  /**
  * Update the number of components that the entity-component-system to build can store.
  *
  * @param types - The new number of components that the entity-component-system to build can store.
  */
  public set components (components : number) {
    this._components = components
  }

  /**
  * Return true if the given instance is equal to this one.
  *
  * @param other - Another instance to compare to this one.
  *
  * @return True if the given instance is equal to this one.
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof EntityComponentSystemBuilder) {
      return other.entities === this._entities &&
             other.tags === this._tags &&
             other.types === this._types &&
             other.components === this._components
    }

    return false
  }
}
