import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { Entity } from './Entity';
import { Tag } from './Tag';
export declare class TagRelationshipRepository {
    private _entities;
    private _entitiesByTag;
    private _entitiesViewByTag;
    /**
    * Create a new tag relationship repository with a given relationship capacity.
    *
    * @param entities - Number of entities that this repository handle.
    * @param tags - Number of tags that this repository handle.
    */
    constructor(entities?: number, tags?: number);
    /**
    * @return The number of entities managed by this relationship collection.
    */
    readonly entities: number;
    /**
    * @return The number of tags managed by this relationship collection.
    */
    readonly tags: number;
    /**
    * Reallocate the storing capacity of this relationship collection.
    *
    * @param entities - New number of entities to manage.
    * @param tags - New number of tags to manage.
    */
    reallocate(entities: number, tags: number): void;
    /**
    * Return a collection of entities that have a given tag.
    *
    * @param tag - A tag to search for.
    *
    * @return A collection with all entities that have the given tag.
    */
    getEntitiesWithTag(tag: Tag): Sequence<Entity>;
    /**
    * Attach a tag to an entity.
    *
    * @param tag - The tag to attach.
    * @param entity - The entity that must be tagged.
    */
    attachTagToEntity(tag: Tag, entity: Entity): void;
    /**
    * Remove a tag from an entity.
    *
    * @param tag - The tag to detach.
    * @param entity - The entity that must be untagged.
    */
    detachTagFromEntity(tag: Tag, entity: Entity): void;
    /**
    * Remove all tags attached to a given entity.
    *
    * @param entity - An entity to clean of all its tags.
    */
    detachAllTagsFromEntity(entity: Entity): void;
    /**
    * Remove the given tag from all of its attached entities.
    *
    * @param tag - A tag to detach from its entities.
    */
    detachTagFromItsEntities(tag: Tag): void;
    /**
    * Detach all attached tags.
    */
    clear(): void;
    /**
    * @see TagRelationshiprepository.equals
    */
    equals(other: any): boolean;
}
export declare namespace TagRelationshipRepository {
    /**
    * Same as new TagRelationshipRepository()
    *
    * @param [entities = 1024] - Number of entities that the created repository handle.
    * @param [tags = 256] - Number of tags that the created repository handle.
    *
    * @return A new TagRelationshipRepository
    */
    function create(entities?: number, tags?: number): TagRelationshipRepository;
    /**
    * Copy an existing tag relationship repository.
    *
    * @param toCopy - A tag relationship repository to copy.
    *
    * @return A copy of the given instance.
    */
    function copy(toCopy: TagRelationshipRepository): TagRelationshipRepository;
}
