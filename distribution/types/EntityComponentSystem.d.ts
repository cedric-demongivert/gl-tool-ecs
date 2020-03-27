import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { Tag } from './Tag';
import { Entity } from './Entity';
import { Component } from './Component';
import { ComponentType } from './ComponentType';
import { System } from './System';
import { EntityComponentSystemBuilder } from './EntityComponentSystemBuilder';
export declare class EntityComponentSystem {
    readonly entities: Sequence<Entity>;
    private _entities;
    readonly tags: Sequence<Tag>;
    private _tags;
    private _relationshipsOfTags;
    readonly types: Sequence<ComponentType<any>>;
    private _types;
    private _typesByEntity;
    readonly systems: Sequence<System>;
    private _systems;
    readonly components: Sequence<Component>;
    private _components;
    private _componentsIndex;
    private _capacity;
    /**
    * Create a new entity-component-system in accordance with a given builder.
    *
    * @param builder - A builder with the configuration of the system to build.
    */
    constructor(builder?: EntityComponentSystemBuilder);
    /**
    * @return An object that contains the number of objects that this entity-component-system can store keyed by their type.
    */
    readonly capacity: EntityComponentSystem.Capacity;
    /**
    * Create a new entity and return it.
    *
    * @return The created entity.
    */
    createEntity(): Entity;
    /**
    * Add a new entity into this entity-component-system.
    *
    * @param entity - An entity to add to this entity-component-system.
    */
    addEntity(entity: Entity): void;
    /**
    * Remove an entity from this entity-component-system.
    *
    * @param entity - An entity to remove.
    */
    deleteEntity(entity: Entity): void;
    /**
    * Return a collection of entities with the given tag.
    *
    * @param tag - A tag to search for.
    *
    * @return A collection of entities with the given tag.
    */
    getEntitiesWithTag(tag: Tag): Sequence<Entity>;
    /**
    * Return a collection of entities that have a component of the given type.
    *
    * @param type - Type to search for.
    *
    * @return A collection of entities that have a component of the given type.
    */
    getEntitiesWithType(type: ComponentType<any>): Sequence<Entity>;
    /**
    * Remove all entities from this entity-component-system.
    */
    clearEntities(): void;
    /**
    * Called when this entity-component-system will add an entity.
    *
    * @param entity - The identifier of the entity to add.
    */
    private willAddEntity;
    /**
    * Called when this entity-component-system did add an entity.
    *
    * @param entity - The identifier of the added entity.
    */
    private didAddEntity;
    /**
    * Called when this entity-component-system will delete an entity.
    *
    * @param entity - The identifier of the entity that will be deleted.
    */
    private willDeleteEntity;
    /**
    * Called when this entity-component-system did delete an entity.
    *
    * @param entity - The identifier of the entity that was deleted.
    */
    private didDeleteEntity;
    /**
    * Create a new tag and return it.
    *
    * @return The created tag.
    */
    createTag(): Tag;
    /**
    * Add a new tag into this entity-component-system.
    *
    * @param tag - A tag to add to this entity-component-system.
    */
    addTag(tag: Tag): void;
    /**
    * Remove a tag from this manager.
    *
    * @param tag - A tag to remove from the manager.
    */
    deleteTag(tag: Tag): void;
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
    * Remove all tags from this entity-component-system.
    */
    clearTags(): void;
    /**
    * Called when this entity-component-system will add a tag.
    *
    * @param tag - The identifier of the tag to add.
    */
    private willAddTag;
    /**
    * Called whenthis entity-component-system did add a tag.
    *
    * @param tag - The identifier of the added tag.
    */
    private didAddTag;
    /**
    * Called when this entity-component-system will delete a tag.
    *
    * @param tag - The identifier of the tag to delete.
    */
    private willDeleteTag;
    /**
    * Called when this entity-component-system did delete a tag.
    *
    * @param tag - The identifier of the deleted tag.
    */
    private didDeleteTag;
    /**
    * Called when this entity-component-system did attach a tag to an entity.
    *
    * @param tag - The identifier of the attached tag.
    * @param entity - The identifier of the targeted entity.
    */
    private willAttachTagToEntity;
    /**
    * Called when this entity-component-system will detach a tag from an entity.
    *
    * @param tag - The identifier of the tag to detach.
    * @param entity - The identifier of the targeted entity.
    */
    private didAttachTagToEntity;
    /**
    * Called when this entity-component-system will detach a tag from an entity.
    *
    * @param tag - The identifier of the tag to detach.
    * @param entity - The identifier of the targeted entity.
    */
    private willDetachTagFromEntity;
    /**
    * Called when this entity-component-system did detach a tag from an entity.
    *
    * @param tag - The identifier of the detached tag.
    * @param entity - The identifier of the targeted entity.
    */
    private didDetachTagFromEntity;
    /**
    * Add a type to this entity-component-system.
    *
    * @param type - Type to add.
    */
    addType(type: ComponentType<any>): void;
    /**
    * Delete a type from this entity-component-system.
    *
    * @param type - Type to delete.
    */
    deleteType(type: ComponentType<any>): void;
    /**
    * Delete all types of this entity-component-system.
    */
    clearTypes(): void;
    /**
    * Return all types assigned to a given entity.
    *
    * @param entity - An entity to search for.
    *
    * @return A collection of types that exists on the given entity.
    */
    getTypesOfEntity(entity: Entity): Sequence<ComponentType<any>>;
    /**
    * Called when this entity-component-system will add a type.
    *
    * @param type - The type that will be added.
    */
    private willAddType;
    /**
    * Called when this entity-component-system did add a type.
    *
    * @param type - The type that was added.
    */
    private didAddType;
    /**
    * Called when this entity-component-system will delete a type.
    *
    * @param type - The type that will be deleted.
    */
    private willDeleteType;
    /**
    * Called when this entity-component-system did delete a type.
    *
    * @param type - The type that was deleted.
    */
    private didDeleteType;
    /**
    * Create a component and assign it to a given entity.
    *
    * @param entity - The entity to target.
    * @param type - The type of component to create.
    *
    * @return The created component.
    */
    createComponent<Type extends Component>(entity: number, type: ComponentType<Type>): Type;
    /**
    * Return the type of a given component.
    *
    * @param identifier - Identifier of the component to get.
    *
    * @return The type of the given component.
    */
    getTypeOfComponent<Type extends Component>(component: Type): ComponentType<Type>;
    getTypeOfComponent(component: number): ComponentType<any>;
    /**
    * Return the instance of a given component.
    *
    * @param identifier - Identifier of the component to get.
    *
    * @return The instance of the given component.
    */
    getComponent(identifier: number): Component;
    getComponent<Type extends Component>(identifier: number, type: ComponentType<Type>): Type;
    getComponentOfEntity<Type extends Component>(entity: Entity, type: ComponentType<Type>): Type;
    /**
    * Return true if the given entity has a component of the given type.
    *
    * @param entity - Identifier of the entity to search for.
    * @param type - Type of the component to search for.
    *
    * @return True if the given component exists into this collection.
    */
    hasComponent(entity: number, type: ComponentType<any>): boolean;
    /**
    * Delete an existing component.
    *
    * @param entity - Entity that have the component to delete.
    * @param type - Type of component to delete.
    */
    deleteComponent(entity: number, type: ComponentType<any>): void;
    /**
    * Remove a component from this entity-component-system by using its identifier.
    *
    * @param component - Identifier of the component to remove.
    */
    deleteComponentByIdentifier(component: number): void;
    /**
    * Remove all components of this entity-component-system.
    */
    clearComponents(): void;
    /**
    * Called when this entity-component-system will add a component.
    *
    * @param entity - The entity that will get the given component.
    * @param type - The type of the component to add.
    */
    private willAddComponent;
    /**
    * Called when this entity-component-system did add a component.
    *
    * @param component - The component that was added.
    * @param type - The type of the component that was added.
    */
    private didAddComponent;
    /**
    * Called when this entity-component-system will delete a component.
    *
    * @param component - The component that will be deleted.
    * @param type - The type of the component that will be deleted.
    */
    private willDeleteComponent;
    /**
    * Called when this entity-component-system did delete a component.
    *
    * @param component - The component that was deleted.
    * @param type - The type of the component that was deleted.
    */
    private didDeleteComponent;
    /**
    * Add a system to this entity-component-system.
    *
    * @param system - A system to add.
    */
    addSystem(system: System): void;
    /**
    * Require a system of a given type.
    *
    * @param type - The type of system to return.
    *
    * @return The first system of the given type or fail.
    */
    requireSystem(type: Function): System;
    /**
    * Find the first system of a given type.
    *
    * @param type - The type of system to return.
    *
    * @return The first system of the given type or null.
    */
    firstSystem(type: Function): System;
    /**
    * Delete a system from this entity-component-system.
    *
    * @param system - A system to delete from this entity-component-system.
    */
    deleteSystem(system: System): void;
    /**
    * Return true if the given systems belongs to this entity-component-system.
    *
    * @param system - A system to search for.
    * @return True if the given systems belongs to this entity-component-system.
    */
    hasSystem(system: System): boolean;
    /**
    * Update all systems of this entity-component-system.
    *
    * @param delta - Elapsed time between two system update.
    */
    update(delta: number): void;
    /**
    * Remove all systems from this entity-component-system.
    */
    clearSystems(): void;
    /**
    * Empty this entity-component-system.
    */
    clear(): void;
}
export declare namespace EntityComponentSystem {
    type Capacity = {
        entities: number;
        types: number;
        components: number;
        tags: number;
    };
}
