import { StaticSet, Collection, View, BufferedNumberSet } from '../collection'

export class TagRelationshipRepository {
  /**
  * Same as new TagRelationshipRepository()
  *
  * @param [entities = 1024] - Number of entities that the created repository handle.
  * @param [tags = 256] - Number of tags that the created repository handle.
  *
  * @return A new TagRelationshipRepository
  */
  public static create (entities = 1024, tags = 256) : TagRelationshipRepository {
    return new TagRelationshipRepository(entities, tags)
  }

  /**
  * Copy an existing tag relationship repository.
  *
  * @param toCopy - A tag relationship repository to copy.
  *
  * @return A copy of the given instance.
  */
  public static copy (toCopy : TagRelationshipRepository) : TagRelationshipRepository {
    const result : TagRelationshipRepository = new TagRelationshipRepository(
      toCopy.entities, toCopy.tags
    )

    for (let tag = 0, tagCount = toCopy.tags; tag < tagCount; ++tag) {
      const entities : Collection<number> = toCopy.getEntitiesWithTag(tag)

      for (let index = 0, length = entities.size; index < length; ++index) {
        result.attachTagToEntity(tag, entities.get(index))
      }
    }

    return result
  }

  private _entities : number
  private _entitiesByTag : BufferedNumberSet[]
  private _entitiesViewByTag : View<number>[]

  /**
  * Create a new tag relationship repository with a given relationship capacity.
  *
  * @param entities - Number of entities that this repository handle.
  * @param tags - Number of tags that this repository handle.
  */
  public constructor (entities = 1024, tags = 256) {
    this._entities = entities
    this._entitiesByTag = new Array<BufferedNumberSet>(tags)
    this._entitiesViewByTag = new Array<View<number>>(tags)

    for (let index = 0; index < tags; ++index) {
      this._entitiesByTag[index] = new BufferedNumberSet(entities)
      this._entitiesViewByTag[index] = View.wrap(this._entitiesByTag[index])
    }
  }

  /**
  * @return The number of entities managed by this relationship collection.
  */
  public get entities () : number {
    return this._entities
  }

  /**
  * @return The number of tags managed by this relationship collection.
  */
  public get tags () : number {
    return this._entitiesByTag.length
  }

  /**
  * Reallocate the storing capacity of this relationship collection.
  *
  * @param entities - New number of entities to manage.
  * @param tags - New number of tags to manage.
  */
  public reallocate (entities : number, tags : number) : void {
    const oldTags : number = this._entitiesByTag.length

    this._entitiesByTag.length = tags
    this._entitiesViewByTag.length = tags

    for (let tag = 0, length = Math.min(oldTags, tags); tag < length; ++tag) {
      this._entitiesByTag[tag].reallocate(entities)
    }

    for (let tag = oldTags; tag < tags; ++tag) {
      this._entitiesByTag[tag] = new BufferedNumberSet(entities)
      this._entitiesViewByTag[tag] = View.wrap(this._entitiesByTag[tag])
    }

    this._entities = entities
  }

  /**
  * Return a collection of entities that have a given tag.
  *
  * @param tag - A tag to search for.
  *
  * @return A collection with all entities that have the given tag.
  */
  public getEntitiesWithTag (tag : number) : Collection<number> {
    return this._entitiesViewByTag[tag]
  }

  /**
  * Attach a tag to an entity.
  *
  * @param tag - The tag to attach.
  * @param entity - The entity that must be tagged.
  */
  public attachTagToEntity (tag : number, entity : number) : void {
    this._entitiesByTag[tag].add(entity)
  }

  /**
  * Remove a tag from an entity.
  *
  * @param tag - The tag to detach.
  * @param entity - The entity that must be untagged.
  */
  public detachTagFromEntity (tag : number, entity : number) : void {
    this._entitiesByTag[tag].delete(entity)
  }

  /**
  * Remove all tags attached to a given entity.
  *
  * @param entity - An entity to clean of all its tags.
  */
  public detachAllTagsFromEntity (entity : number) : void {
    for (
      let index = 0, length = this._entitiesByTag.length;
      index < length;
      ++index
    ) {
      this._entitiesByTag[index].delete(entity)
    }
  }

  /**
  * Remove the given tag from all of its attached entities.
  *
  * @param tag - A tag to detach from its entities.
  */
  public detachTagFromItsEntities (tag : number) : void {
    this._entitiesByTag[tag].clear()
  }

  /**
  * Detach all attached tags.
  */
  public clear () : void {
    for (
      let index = 0, length = this._entitiesByTag.length;
      index < length;
      ++index
    ) {
      this._entitiesByTag[index].clear()
    }
  }

  /**
  * @see TagRelationshiprepository.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof TagRelationshipRepository) {
      if (other.tags !== this.tags || other.entities !== this._entities) {
        return false
      }

      for (let index = 0, length = this.tags; index < length; ++index) {
        if (
          !other.getEntitiesWithTag(index).equals(this._entitiesByTag[index])
        ) return false
      }

      return true
    }

    return false
  }
}
