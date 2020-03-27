import { EntityComponentSystem } from './EntityComponentSystem';
export declare class EntityComponentSystemBuilder {
    private _entities;
    private _tags;
    private _types;
    private _components;
    /**
    * Create a new default entity-component-system-builder.
    */
    constructor();
    /**
    * Build the described entity-component-system and return it.
    */
    build(): EntityComponentSystem;
    /**
    * @return The number of entities that the entity-component-system to build can store.
    */
    /**
    * Update the number of entities that the entity-component-system to build can store.
    *
    * @param entities - The new number of entities that the entity-component-system to build can store.
    */
    entities: number;
    /**
    * @return The number of tags that the entity-component-system to build can store.
    */
    /**
    * Update the number of tags that the entity-component-system to build can store.
    *
    * @param tags - The new number of tags that the entity-component-system to build can store.
    */
    tags: number;
    /**
    * @return The number of types that the entity-component-system to build can store.
    */
    /**
    * Update the number of types that the entity-component-system to build can store.
    *
    * @param types - The new number of types that the entity-component-system to build can store.
    */
    types: number;
    /**
    * @return The number of components that the entity-component-system to build can store.
    */
    /**
    * Update the number of components that the entity-component-system to build can store.
    *
    * @param types - The new number of components that the entity-component-system to build can store.
    */
    components: number;
    /**
    * Return true if the given instance is equal to this one.
    *
    * @param other - Another instance to compare to this one.
    *
    * @return True if the given instance is equal to this one.
    */
    equals(other: any): boolean;
}
