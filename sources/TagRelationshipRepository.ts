import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { Entity } from './Entity'
import { Tag } from './Tag'

/**
 * 
 */
export class TagRelationshipRepository {
  /**
   * 
   */
  private _entities: number

  /**
   * 
   */
  private _entitiesByTag: Pack<IdentifierSet>

  /**
   * 
   */
  private _entitiesViewByTag: Pack<Sequence<Entity>>

  /**
   * Create a new tag relationship repository with a given relationship capacity.
   *
   * @param entities - Number of entities that this repository handle.
   * @param tags - Number of tags that this repository handle.
   */
  public constructor(entities: number = 1024, tags: number = 256) {
    this._entities = entities
    this._entitiesByTag = Pack.any(tags)
    this._entitiesViewByTag = Pack.any(tags)

    for (let index = 0; index < tags; ++index) {
      const set: IdentifierSet = IdentifierSet.allocate(entities)
      this._entitiesByTag.set(index, set)
      this._entitiesViewByTag.set(index, set.view())
    }
  }

  /**
   * @return The number of entities managed by this relationship collection.
   */
  public get entities(): number {
    return this._entities
  }

  /**
   * @return The number of tags managed by this relationship collection.
   */
  public get tags(): number {
    return this._entitiesByTag.size
  }

  /**
   * Reallocate the storing capacity of this relationship collection.
   *
   * @param entities - New number of entities to manage.
   * @param tags - New number of tags to manage.
   */
  public reallocate(entities: number, tags: number): void {
    const oldTags: number = this._entitiesByTag.size

    this._entitiesByTag.size = tags
    this._entitiesViewByTag.size = tags

    for (let tag = 0, length = Math.min(oldTags, tags); tag < length; ++tag) {
      this._entitiesByTag[tag].reallocate(entities)
    }

    for (let tag = oldTags; tag < tags; ++tag) {
      const set: IdentifierSet = IdentifierSet.allocate(entities)
      this._entitiesByTag.set(tag, set)
      this._entitiesViewByTag.set(tag, set.view())
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
  public getEntitiesWithTag(tag: Tag): Sequence<Entity> {
    return this._entitiesViewByTag.get(tag)
  }

  /**
   * Attach a tag to an entity.
   *
   * @param tag - The tag to attach.
   * @param entity - The entity that must be tagged.
   */
  public attachTagToEntity(tag: Tag, entity: Entity): void {
    this._entitiesByTag.get(tag).add(entity)
  }

  /**
   * Remove a tag from an entity.
   *
   * @param tag - The tag to detach.
   * @param entity - The entity that must be untagged.
   */
  public detachTagFromEntity(tag: Tag, entity: Entity): void {
    this._entitiesByTag.get(tag).delete(entity)
  }

  /**
   * Remove all tags attached to a given entity.
   *
   * @param entity - An entity to clean of all its tags.
   */
  public detachAllTagsFromEntity(entity: Entity): void {
    for (
      let index = 0, length = this._entitiesByTag.size;
      index < length;
      ++index
    ) { this._entitiesByTag.get(index).delete(entity) }
  }

  /**
   * Remove the given tag from all of its attached entities.
   *
   * @param tag - A tag to detach from its entities.
   */
  public detachTagFromItsEntities(tag: Tag): void {
    this._entitiesByTag.get(tag).clear()
  }

  /**
   * Detach all attached tags.
   */
  public clear(): void {
    for (
      let index = 0, length = this._entitiesByTag.size;
      index < length;
      ++index
    ) {
      this._entitiesByTag.get(index).clear()
    }
  }

  /**
   * @see TagRelationshiprepository.equals
   */
  public equals(other: any): boolean {
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

export namespace TagRelationshipRepository {
  /**
   * Same as new TagRelationshipRepository()
   *
   * @param [entities = 1024] - Number of entities that the created repository handle.
   * @param [tags = 256] - Number of tags that the created repository handle.
   *
   * @return A new TagRelationshipRepository
   */
  export function create(entities: number = 1024, tags: number = 256): TagRelationshipRepository {
    return new TagRelationshipRepository(entities, tags)
  }

  /**
   * Copy an existing tag relationship repository.
   *
   * @param toCopy - A tag relationship repository to copy.
   *
   * @return A copy of the given instance.
   */
  export function copy(toCopy: TagRelationshipRepository): TagRelationshipRepository {
    const result: TagRelationshipRepository = new TagRelationshipRepository(
      toCopy.entities, toCopy.tags
    )

    for (let tag = 0, tagCount = toCopy.tags; tag < tagCount; ++tag) {
      const entities: Sequence<Entity> = toCopy.getEntitiesWithTag(tag)

      for (let index = 0, length = entities.size; index < length; ++index) {
        result.attachTagToEntity(tag, entities.get(index))
      }
    }

    return result
  }
}
