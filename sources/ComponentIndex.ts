import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'

import { Entity } from './Entity'

export class ComponentIndex {
  private _index : Pack<number>

  private _typesByEntity : Pack<IdentifierSet>
  private _typesViewByEntity : Pack<Sequence<number>>

  private _entitiesByType : Pack<IdentifierSet>
  private _entitiesViewByType : Pack<Sequence<Entity>>

  /**
  * Instanciate a new empty component index with an initial capacity.
  *
  * @param entities - Number of entities handled by this index.
  * @param types - Number of types handled by this index.
  */
  public constructor (entities : number, types : number) {
    this._index = Pack.uint32(types * entities)
    this._typesByEntity = Pack.any(entities)
    this._typesViewByEntity = Pack.any(entities)
    this._entitiesByType = Pack.any(types)
    this._entitiesViewByType = Pack.any(types)

    for (let index = 0; index < entities; ++index) {
      const set : IdentifierSet = IdentifierSet.allocate(types)

      this._typesByEntity.set(index, set)
      this._typesViewByEntity.set(index, set.view())
    }

    for (let index = 0; index < types; ++index) {
      const set : IdentifierSet = IdentifierSet.allocate(entities)

      this._entitiesByType.set(index, set)
      this._entitiesViewByType.set(index, set.view())
    }
  }

  /**
  * @return The number of entities handled by this index.
  */
  public get entities () : number {
    return this._typesByEntity.size
  }

  /**
  * @return The number of types handled by this index.
  */
  public get types () : number {
    return this._entitiesViewByType.size
  }

  /**
  * Change the number of entities and types handled by this index.
  *
  * @param entities - The new number of entities handled by this index.
  * @param types - The new number of types handled by this index.
  */
  public reallocate (entities : number, types : number) : void {
    const oldIndex : Pack<number> = this._index
    const oldEntities : number = this._typesByEntity.size
    const minEntities : number = Math.min(entities, oldEntities)
    const oldTypes : number = this._entitiesViewByType.size
    const minTypes : number = Math.min(types, oldTypes)

    this._index = Pack.uint32(types * entities)

    for (let entity = 0; entity < minEntities; ++entity) {
      for (let type = 0; type < minTypes; ++type) {
        this._index.set(entity * types + type, oldIndex.get(entity * oldTypes + type))
      }
    }

    this._typesByEntity.size = entities
    this._typesViewByEntity.size = entities
    this._entitiesByType.size = types
    this._entitiesViewByType.size = types

    for (let index = 0; index < minEntities; ++index) {
      this._typesByEntity.get(index).reallocate(types)
    }

    for (let index = 0; index < minTypes; ++index) {
      this._entitiesByType.get(index).reallocate(entities)
    }

    for (let index = oldEntities; index < entities; ++index) {
      const set : IdentifierSet = IdentifierSet.allocate(types)

      this._typesByEntity.set(index, set)
      this._typesViewByEntity.set(index, set.view())
    }

    for (let index = oldTypes; index < types; ++index) {
      const set : IdentifierSet = IdentifierSet.allocate(types)

      this._entitiesByType.set(index, set)
      this._entitiesViewByType.set(index, set.view())
    }
  }

  /**
  * Remove a previously registered component.
  *
  * @param entity - Entity that is the parent of the component to remove.
  * @param type - Type of the component to remove.
  */
  public delete (entity : Entity, type : number) : void {
    this._typesByEntity.get(entity).delete(type)
    this._entitiesByType.get(type).delete(entity)
    this._index.set(entity * this._entitiesViewByType.size + type, 0)
  }

  /**
  * Index a component.
  *
  * @param entity - Entity that is the parent of the component to index.
  * @param type - Type of the component to index.
  * @param component - Identifier of the indexed component.
  */
  public set (entity : Entity, type : number, component : number) : void {
    this._index.set(entity * this._entitiesViewByType.size + type, component)
    this._typesByEntity.get(entity).add(type)
    this._entitiesByType.get(type).add(entity)
  }

  /**
  * Return the identifier of a component that belongs to an entity and that is of a given type.
  *
  * @param entity - An entity to search for.
  * @param type - A type to search for.
  *
  * @return The identifier of the component that belongs to the given entity and that is of the given type.
  */
  public get (entity : Entity, type : number) : number {
    return (
      this._typesByEntity.get(entity).has(type)
    ) ? this._index.get(entity * this._entitiesViewByType.size + type)
      : undefined
  }

  /**
  * Return true if the given entity has a component of the given type.
  *
  * @param entity - Identifier of the entity to search for.
  * @param type - Type of the component to search for.
  *
  * @return True if the given component exists into this collection.
  */
  public has (entity : Entity, type : number) : boolean {
    return this._typesByEntity.get(entity).has(type)
  }

  /**
  * Return a collection of types that are present on a given entity.
  *
  * @param entity - An entity to search for.
  *
  * @return A collection of types that are present on the given entity.
  */
  public getTypesOfEntity (entity : Entity) : Sequence<number> {
    return this._typesViewByEntity.get(entity)
  }

  /**
  * Return a collection with all entities that have a component of a given type.
  *
  * @param type - Type of component to search for.
  *
  * @return A collection with all entities that have a component of the given type.
  */
  public getEntitiesWithType (type : number) : Sequence<Entity> {
    return this._entitiesViewByType.get(type)
  }

  /**
  * Empty this index.
  */
  public clear () : void {
    this._index.fill(0)

    for (let index = 0; index < this._typesByEntity.size; ++index) {
      this._typesByEntity.get(index).clear()
    }

    for (let index = 0; index < this._entitiesByType.size; ++index) {
      this._entitiesByType.get(index).clear()
    }
  }

  /**
  * Return true if both instances are equals.
  *
  * @param other - Another object instance to compare to this one.
  *
  * @return True if both instances are equals.
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ComponentIndex) {
      const entities : number = other.entities

      if (entities !== this._typesByEntity.size) return false
      if (other.types !== this._entitiesByType.size) return false

      for (let entity = 0; entity < entities; ++entity) {
        const types : Sequence<number> = other.getTypesOfEntity(entity)

        if (this.getTypesOfEntity(entity).size !== types.size) {
          return false
        }

        for (let index = 0, size = types.size; index < size; ++index) {
          const type : number = types.get(index)
          if (this.get(entity, type) !== other.get(entity, type)) {
            return false
          }
        }
      }

      return true
    }

    return false
  }
}

export namespace ComponentIndex {
  /**
  * Copy an existing component index.
  *
  * @param toCopy - An existing component index instance to copy.
  *
  * @return A copy of the given component index instance.
  */
  export function copy (toCopy : ComponentIndex) : ComponentIndex {
    const entities : number = toCopy.entities
    const result : ComponentIndex = new ComponentIndex(entities, toCopy.types)

    for (let entity = 0; entity < entities; ++entity) {
      const types : Sequence<number> = toCopy.getTypesOfEntity(entity)
      for (let index = 0, size = types.size; index < size; ++index) {
        const type : number = types.get(index)
        result.set(entity, type, toCopy.get(entity, type))
      }
    }

    return result
  }
}
