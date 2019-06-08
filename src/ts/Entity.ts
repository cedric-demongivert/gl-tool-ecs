import { Collection } from './collection/Collection'
import { EntityComponentSystem } from './EntityComponentSystem'
import { TypeHandler } from './types/TypeHandler'

/**
* An entity.
*
* Contains useful helpers in order to retrieve, query, mutate and delete entities.
*/
export class Entity {
  private _identifier : number
  private _manager : EntityComponentSystem

  /**
  * Create an entity and register it into a manager.
  *
  * @param manager - The entity related manager.
  * @param identifier - The entity identifier.
  */
  constructor (manager : EntityComponentSystem, identifier : number) {
    this._identifier = identifier
    this._manager = manager

    if (!this._manager.hasEntity(identifier)) {
      this._manager.addEntity(identifier)
    }
  }

  /**
  * @return The entity identifier.
  */
  get identifier () : number {
    return this._identifier
  }

  /**
  * @return The related entity manager.
  */
  get manager () : EntityComponentSystem {
    return this._manager
  }

  /**
  * @return A view over each component type that this entity have.
  */
  get types () : Collection<number> {
    return this._manager.getTypesOfEntity(this._identifier)
  }

  /**
  * Check if this entity has a given tag.
  *
  * @param tag - A tag to search for.
  *
  * @return True if this entity has the given tag attached to it.
  */
  hasTag (tag : number) : boolean {
    return this._manager.getEntitiesWithTag(tag).has(this._identifier)
  }

  /**
  * Add a tag to this entity.
  *
  * @param tag - A tag to add to this entity.
  */
  addTag (tag : number) : void {
    this._manager.attachTagToEntity(tag, this._identifier)
  }

  /**
  * Delete a tag from this entity.
  *
  * @param tag - A tag to delete from this entity.
  */
  deleteTag (tag : number) : void {
    this._manager.detachTagFromEntity(tag, this._identifier)
  }

  /**
  * Delete all tags from this entity.
  */
  clearTags () : void {
    this._manager.detachAllTagsFromEntity(this._identifier)
  }

  /**
  * Check if this entity has a component of a particular type.
  *
  * @param handler - A component type handler.
  *
  * @return True if this entity has a component of the given type.
  */
  hasComponent (type : TypeHandler) : boolean {
    return this._manager.hasComponent(this._identifier, type)
  }

  /**
  * Return a component of a particular type.
  *
  * @param type - A component type.
  *
  * @return The component of the given type, if exists.
  */
  getComponent (type : TypeHandler) : number {
    return this._manager.getComponent(this._identifier, type)
  }

  /**
  * Return the instance of a particular component.
  *
  * @param type - Type of the component to search for.
  *
  * @return The requested component instance if any.
  */
  getInstance (type : TypeHandler) : any {
    return this._manager.getInstanceOfComponent(
      this._manager.getComponent(this._identifier, type)
    )
  }

  /**
  * Create a component of a particular type for this entity.
  *
  * @param type - Type of the component to create.
  *
  * @return The created component.
  */
  createComponent (type : TypeHandler) : number {
    return this._manager.createComponent(this._identifier, type)
  }

  /**
  * Delete a component of a particular type attached to this entity.
  *
  * @param type - Type of the component to delete.
  */
  deleteComponent (type : TypeHandler) : void {
    this._manager.deleteComponent(this._identifier, type)
  }

  /**
  * Check if this object instance is equal to another one.
  *
  * @param other - Other value to use as a comparison.
  *
  * @return True if this entity is equal to the given value.
  */
  equals (other : any) : boolean {
    if (other == null) return false
    if (other == this) return true

    if (other instanceof Entity) {
      return other.identifier === this._identifier &&
             other.manager === this._manager
    }

    return false
  }

  /**
  * @see Object#toString
  */
  toString () : string {
    return `Entity ${this._identifier}`
  }
}
