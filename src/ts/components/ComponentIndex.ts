import { Collection } from '../collection/Collection'
import { BufferedNumberSet } from '../collection/BufferedNumberSet'
import { ArraySet } from '../collection/ArraySet'
import { View } from '../collection/View'

export class ComponentIndex {
  /**
  * Copy an existing component index.
  *
  * @param toCopy - An existing component index instance to copy.
  *
  * @return A copy of the given component index instance.
  */
  public static copy (toCopy : ComponentIndex) : ComponentIndex {
    const entities : number = toCopy.entities
    const result : ComponentIndex = new ComponentIndex(entities, toCopy.types)

    for (let entity = 0; entity < entities; ++entity) {
      const types : Collection<number> = toCopy.getTypesOfEntity(entity)
      for (let index = 0, size = types.size; index < size; ++index) {
        const type : number = types.get(index)
        result.set(entity, type, toCopy.get(entity, type))
      }
    }

    return result
  }

  private _index : Uint32Array
  private _typesByEntity : Array<BufferedNumberSet>
  private _typesViewByEntity : Array<Collection<number>>
  private _entitiesByType : Array<BufferedNumberSet>
  private _entitiesViewByType : Array<Collection<number>>

  /**
  * Instanciate a new empty component index with an initial capacity.
  *
  * @param entities - Number of entities handled by this index.
  * @param types - Number of types handled by this index.
  */
  public constructor (entities : number, types : number) {
    this._index = new Uint32Array(types * entities)
    this._typesByEntity = new Array<BufferedNumberSet>(entities)
    this._typesViewByEntity = new Array<Collection<number>>(entities)
    this._entitiesByType = new Array<BufferedNumberSet>(types)
    this._entitiesViewByType = new Array<Collection<number>>(types)

    for (let index = 0; index < entities; ++index) {
      this._typesByEntity[index] = new BufferedNumberSet(types)
      this._typesViewByEntity[index] = View.wrap(this._typesByEntity[index])
    }

    for (let index = 0; index < types; ++index) {
      this._entitiesByType[index] = new BufferedNumberSet(entities)
      this._entitiesViewByType[index] = View.wrap(this._entitiesByType[index])
    }
  }

  /**
  * @return The number of entities handled by this index.
  */
  public get entities () : number {
    return this._typesByEntity.length
  }

  /**
  * @return The number of types handled by this index.
  */
  public get types () : number {
    return this._entitiesViewByType.length
  }

  /**
  * Change the number of entities and types handled by this index.
  *
  * @param entities - The new number of entities handled by this index.
  * @param types - The new number of types handled by this index.
  */
  public reallocate (entities : number, types : number) : void {
    const oldIndex : Uint32Array = this._index
    const oldEntities : number = this._typesByEntity.length
    const minEntities : number = Math.min(entities, oldEntities)
    const oldTypes : number = this._entitiesViewByType.length
    const minTypes : number = Math.min(types, oldTypes)

    this._index = new Uint32Array(types * entities)

    for (let entity = 0; entity < minEntities; ++entity) {
      for (let type = 0; type < minTypes; ++type) {
        this._index[entity * types + type] = oldIndex[entity * oldTypes + type]
      }
    }

    this._typesByEntity.length = entities
    this._typesViewByEntity.length = entities
    this._entitiesByType.length = types
    this._entitiesViewByType.length = types

    for (let index = 0; index < minEntities; ++index) {
      this._typesByEntity[index].reallocate(types)
    }

    for (let index = 0; index < minTypes; ++index) {
      this._entitiesByType[index].reallocate(entities)
    }

    for (let index = oldEntities; index < entities; ++index) {
      this._typesByEntity[index] = new BufferedNumberSet(types)
      this._typesViewByEntity[index] = View.wrap(this._typesByEntity[index])
    }

    for (let index = oldTypes; index < types; ++index) {
      this._entitiesByType[index] = new BufferedNumberSet(entities)
      this._entitiesViewByType[index] = View.wrap(this._entitiesByType[index])
    }
  }

  /**
  * Remove a previously registered component.
  *
  * @param entity - Entity that is the parent of the component to remove.
  * @param type - Type of the component to remove.
  */
  public delete (entity : number, type : number) : void {
    this._typesByEntity[entity].delete(type)
    this._entitiesByType[type].delete(entity)
    this._index[entity * this._entitiesViewByType.length + type] = 0
  }

  /**
  * Index a component.
  *
  * @param entity - Entity that is the parent of the component to index.
  * @param type - Type of the component to index.
  * @param component - Identifier of the indexed component.
  */
  public set (entity : number, type : number, component : number) : void {
    this._index[entity * this._entitiesViewByType.length + type] = component
    this._typesByEntity[entity].add(type)
    this._entitiesByType[type].add(entity)
  }

  /**
  * Return the identifier of a component that belongs to an entity and that is of a given type.
  *
  * @param entity - An entity to search for.
  * @param type - A type to search for.
  *
  * @return The identifier of the component that belongs to the given entity and that is of the given type.
  */
  public get (entity : number, type : number) : number {
    return (
      this._typesByEntity[entity].has(type)
    ) ? this._index[entity * this._entitiesViewByType.length + type]
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
  public has (entity : number, type : number) : boolean {
    return this._typesByEntity[entity].has(type)
  }

  /**
  * Return a collection of types that are present on a given entity.
  *
  * @param entity - An entity to search for.
  *
  * @return A collection of types that are present on the given entity.
  */
  public getTypesOfEntity (entity : number) : Collection<number> {
    return this._typesViewByEntity[entity]
  }

  /**
  * Return a collection with all entities that have a component of a given type.
  *
  * @param type - Type of component to search for.
  *
  * @return A collection with all entities that have a component of the given type.
  */
  public getEntitiesWithType (type : number) : Collection<number> {
    return this._entitiesViewByType[type]
  }

  /**
  * Empty this index.
  */
  public clear () : void {
    this._index.fill(0)

    for (let index = 0; index < this._typesByEntity.length; ++index) {
      this._typesByEntity[index].clear()
    }

    for (let index = 0; index < this._entitiesByType.length; ++index) {
      this._entitiesByType[index].clear()
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

      if (entities !== this._typesByEntity.length) return false
      if (other.types !== this._entitiesByType.length) return false

      for (let entity = 0; entity < entities; ++entity) {
        const types : Collection<number> = other.getTypesOfEntity(entity)

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
