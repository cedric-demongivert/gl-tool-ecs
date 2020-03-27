import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { Entity } from './Entity';
export declare class ComponentIndex {
    private _index;
    private _typesByEntity;
    private _typesViewByEntity;
    private _entitiesByType;
    private _entitiesViewByType;
    /**
    * Instanciate a new empty component index with an initial capacity.
    *
    * @param entities - Number of entities handled by this index.
    * @param types - Number of types handled by this index.
    */
    constructor(entities: number, types: number);
    /**
    * @return The number of entities handled by this index.
    */
    readonly entities: number;
    /**
    * @return The number of types handled by this index.
    */
    readonly types: number;
    /**
    * Change the number of entities and types handled by this index.
    *
    * @param entities - The new number of entities handled by this index.
    * @param types - The new number of types handled by this index.
    */
    reallocate(entities: number, types: number): void;
    /**
    * Remove a previously registered component.
    *
    * @param entity - Entity that is the parent of the component to remove.
    * @param type - Type of the component to remove.
    */
    delete(entity: Entity, type: number): void;
    /**
    * Index a component.
    *
    * @param entity - Entity that is the parent of the component to index.
    * @param type - Type of the component to index.
    * @param component - Identifier of the indexed component.
    */
    set(entity: Entity, type: number, component: number): void;
    /**
    * Return the identifier of a component that belongs to an entity and that is of a given type.
    *
    * @param entity - An entity to search for.
    * @param type - A type to search for.
    *
    * @return The identifier of the component that belongs to the given entity and that is of the given type.
    */
    get(entity: Entity, type: number): number;
    /**
    * Return true if the given entity has a component of the given type.
    *
    * @param entity - Identifier of the entity to search for.
    * @param type - Type of the component to search for.
    *
    * @return True if the given component exists into this collection.
    */
    has(entity: Entity, type: number): boolean;
    /**
    * Return a collection of types that are present on a given entity.
    *
    * @param entity - An entity to search for.
    *
    * @return A collection of types that are present on the given entity.
    */
    getTypesOfEntity(entity: Entity): Sequence<number>;
    /**
    * Return a collection with all entities that have a component of a given type.
    *
    * @param type - Type of component to search for.
    *
    * @return A collection with all entities that have a component of the given type.
    */
    getEntitiesWithType(type: number): Sequence<Entity>;
    /**
    * Empty this index.
    */
    clear(): void;
    /**
    * Return true if both instances are equals.
    *
    * @param other - Another object instance to compare to this one.
    *
    * @return True if both instances are equals.
    */
    equals(other: any): boolean;
}
export declare namespace ComponentIndex {
    /**
    * Copy an existing component index.
    *
    * @param toCopy - An existing component index instance to copy.
    *
    * @return A copy of the given component index instance.
    */
    function copy(toCopy: ComponentIndex): ComponentIndex;
}
