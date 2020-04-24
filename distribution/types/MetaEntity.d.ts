import { Collection } from '@cedric-demongivert/gl-tool-collection';
import { EntityComponentSystem } from './EntityComponentSystem';
import { ComponentType } from './ComponentType';
import { Component } from './Component';
import { Tag } from './Tag';
/**
* An entity.
*
* Contains useful helpers in order to retrieve, query, mutate and delete entities.
*/
export declare class MetaEntity {
    private _identifier;
    private _manager;
    /**
    * Create an entity and register it into a manager.
    *
    * @param manager - The entity related manager.
    * @param identifier - The entity identifier.
    */
    constructor(manager: EntityComponentSystem, identifier?: number);
    /**
    * @return The entity identifier.
    */
    readonly identifier: number;
    /**
    * @return The related entity manager.
    */
    readonly manager: EntityComponentSystem;
    /**
    * @return A view over each component type that this entity have.
    */
    readonly types: Collection<ComponentType<any>>;
    /**
    * Check if this entity has a given tag.
    *
    * @param tag - A tag to search for.
    *
    * @return True if this entity has the given tag attached to it.
    */
    hasTag(tag: Tag): boolean;
    /**
    * Add a tag to this entity.
    *
    * @param tag - A tag to add to this entity.
    */
    addTag(tag: Tag): void;
    /**
    * Delete a tag from this entity.
    *
    * @param tag - A tag to delete from this entity.
    */
    deleteTag(tag: Tag): void;
    /**
    * Delete all tags from this entity.
    */
    clearTags(): void;
    /**
    * Check if this entity has a component of a particular type.
    *
    * @param handler - A component type.
    *
    * @return True if this entity has a component of the given type.
    */
    hasComponent(type: ComponentType<any>): boolean;
    /**
    * Return a component of a particular type.
    *
    * @param type - A component type.
    *
    * @return The component of the given type, if exists.
    */
    getComponent<Type>(type: ComponentType<Type>): Component<Type>;
    /**
    * Create a component of a particular type for this entity.
    *
    * @param type - Type of the component to create.
    *
    * @return The created component.
    */
    createComponent<Type>(type: ComponentType<Type>): Component<Type>;
    /**
    * Delete a component of a particular type attached to this entity.
    *
    * @param type - Type of the component to delete.
    */
    deleteComponent(type: ComponentType<any>): void;
    /**
    * Check if this object instance is equal to another one.
    *
    * @param other - Other value to use as a comparison.
    *
    * @return True if this entity is equal to the given value.
    */
    equals(other: any): boolean;
    /**
    * @see Object#toString
    */
    toString(): string;
}
