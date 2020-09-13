import { Collection } from '@cedric-demongivert/gl-tool-collection'

import { EntityComponentSystem } from './EntityComponentSystem'
import { ComponentType } from './ComponentType'
import { Component } from './Component'
import { Tag } from './Tag'

/**
* An entity.
*
* Contains useful helpers in order to retrieve, query, mutate and delete entities.
*/
export class MetaEntity {
  private _identifier : number
  private _manager : EntityComponentSystem

  /**
  * Create an entity and register it into a manager.
  *
  * @param manager - The entity related manager.
  * @param identifier - The entity identifier.
  */
  public constructor (manager : EntityComponentSystem, identifier? : number) {
    this._identifier = identifier == null ? manager.createEntity() : identifier
    this._manager = manager

    if (!this._manager.entities.has(identifier)) {
      this._manager.addEntity(identifier)
    }
  }

  /**
  * @return The entity identifier.
  */
  public get identifier () : number {
    return this._identifier
  }

  /**
  * @return The related entity manager.
  */
  public get manager () : EntityComponentSystem {
    return this._manager
  }

  /**
  * @return A view over each component type that this entity have.
  */
  public get types () : Collection<ComponentType<any>> {
    return this._manager.getTypesOfEntity(this._identifier)
  }

  /**
  * Check if this entity has a given tag.
  *
  * @param tag - A tag to search for.
  *
  * @return True if this entity has the given tag attached to it.
  */
  public hasTag (tag : Tag) : boolean {
    return this._manager.getEntitiesWithTag(tag).has(this._identifier)
  }

  /**
  * Add a tag to this entity.
  *
  * @param tag - A tag to add to this entity.
  */
  public addTag (tag : Tag) : void {
    this._manager.attachTagToEntity(tag, this._identifier)
  }

  /**
  * Delete a tag from this entity.
  *
  * @param tag - A tag to delete from this entity.
  */
  public deleteTag (tag : Tag) : void {
    this._manager.detachTagFromEntity(tag, this._identifier)
  }

  /**
  * Delete all tags from this entity.
  */
  public clearTags () : void {
    this._manager.detachAllTagsFromEntity(this._identifier)
  }

  /**
  * Check if this entity has a component of a particular type.
  *
  * @param handler - A component type.
  *
  * @return True if this entity has a component of the given type.
  */
  public hasComponent (type : ComponentType<any>) : boolean {
    return this._manager.hasComponent(this._identifier, type)
  }

  /**
  * Return a component of a particular type.
  *
  * @param type - A component type.
  *
  * @return The component of the given type, if exists.
  */
  public getComponent <Type> (type : ComponentType<Type>) : Component<Type> {
    return this._manager.getComponentOfEntity(this._identifier, type)
  }

  /**
  * Create a component of a particular type for this entity.
  *
  * @param type - Type of the component to create.
  *
  * @return The created component.
  */
  public createComponent <Type> (type : ComponentType<Type>, ...parameters : any[]) : Component<Type> {
    return this._manager.createComponent(this._identifier, type, ...parameters)
  }

  /**
  * Delete a component of a particular type attached to this entity.
  *
  * @param type - Type of the component to delete.
  */
  public deleteComponent (type : ComponentType<any>) : void {
    this._manager.deleteComponent(this._identifier, type)
  }

  /**
  * Check if this object instance is equal to another one.
  *
  * @param other - Other value to use as a comparison.
  *
  * @return True if this entity is equal to the given value.
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other == this) return true

    if (other instanceof MetaEntity) {
      return other.identifier === this._identifier &&
             other.manager === this._manager
    }

    return false
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return `MetaEntity ${this._identifier}`
  }
}
