import { EntityComponentSystem } from './EntityComponentSystem';
import { Entity } from './Entity';
import { Tag } from './Tag';
import { Component } from './Component';
import { ComponentType } from './ComponentType';
/**
* An engine system.
*/
export declare class System {
    private _manager;
    /**
    * Create a new empty system.
    */
    constructor();
    /**
    * Return the manager of this system.
    *
    * @return The manager of this system.
    */
    readonly manager: EntityComponentSystem;
    /**
    * Called when the system is attached to a manager in order to initialize it.
    */
    initialize(): void;
    /**
    * Called when the parent entity manager will add an entity.
    *
    * @param entity - The identifier of the entity to add.
    */
    managerWillAddEntity(entity: Entity): void;
    /**
    * Called when the parent entity manager did add an entity.
    *
    * @param entity - The identifier of the added entity.
    */
    managerDidAddEntity(entity: Entity): void;
    /**
    * Called when the parent manager will delete an entity.
    *
    * @param entity - The identifier of the entity that will be deleted.
    */
    managerWillDeleteEntity(entity: Entity): void;
    /**
    * Called when the parent manager did delete an entity.
    *
    * @param entity - The identifier of the entity that was deleted.
    */
    managerDidDeleteEntity(entity: Entity): void;
    /**
    * Called when the parent entity manager will add a tag.
    *
    * @param tag - The identifier of the tag to add.
    */
    managerWillAddTag(tag: Tag): void;
    /**
    * Called when the parent entity manager did add a tag.
    *
    * @param tag - The identifier of the added tag.
    */
    managerDidAddTag(tag: Tag): void;
    /**
    * Called when the parent entity manager will delete a tag.
    *
    * @param tag - The identifier of the tag to delete.
    */
    managerWillDeleteTag(tag: Tag): void;
    /**
    * Called when the parent entity manager did delete a tag.
    *
    * @param tag - The identifier of the deleted tag.
    */
    managerDidDeleteTag(tag: Tag): void;
    /**
    * Called when the parent entity manager will attach a tag to an entity.
    *
    * @param tag - The identifier of the tag to attach.
    * @param entity - The identifier of the targeted entity.
    */
    managerWillAttachTagToEntity(tag: Tag, entity: Entity): void;
    /**
    * Called when the parent entity manager did attach a tag to an entity.
    *
    * @param tag - The identifier of the attached tag.
    * @param entity - The identifier of the targeted entity.
    */
    managerDidAttachTagToEntity(tag: Tag, entity: Entity): void;
    /**
    * Called when the parent entity manager will detach a tag from an entity.
    *
    * @param tag - The identifier of the tag to detach.
    * @param entity - The identifier of the targeted entity.
    */
    managerWillDetachTagFromEntity(tag: Tag, entity: Entity): void;
    /**
    * Called when the parent entity manager did detach a tag from an entity.
    *
    * @param tag - The identifier of the detached tag.
    * @param entity - The identifier of the targeted entity.
    */
    managerDidDetachTagFromEntity(tag: Tag, entity: Entity): void;
    /**
    * Called when the parent manager will add a type.
    *
    * @param type - The type that will be added.
    */
    managerWillAddType(type: ComponentType<any>): void;
    /**
    * Called when the parent manager did add a type.
    *
    * @param type - The type that was added.
    */
    managerDidAddType(type: ComponentType<any>): void;
    /**
    * Called when the parent manager will delete a type.
    *
    * @param type - The type that will be deleted.
    */
    managerWillDeleteType(type: ComponentType<any>): void;
    /**
    * Called when the parent manager did delete a type.
    *
    * @param type - The type that was deleted.
    */
    managerDidDeleteType(type: ComponentType<any>): void;
    /**
    * Called when the parent manager will add a component.
    *
    * @param component - The component that will be added.
    * @param entity - The entity that will get the given component.
    * @param type - The type of the component to add.
    */
    managerWillAddComponent(entity: Entity, type: ComponentType<any>): void;
    /**
    * Called when the parent manager did add a component.
    *
    * @param component - The component that was added.
    */
    managerDidAddComponent(component: Component<any>): void;
    /**
    * Called when the parent manager will delete a component.
    *
    * @param component - The component that will be deleted.
    */
    managerWillDeleteComponent(component: Component<any>): void;
    /**
    * Called when the parent manager did delete a component.
    *
    * @param component - The component that was deleted.
    */
    managerDidDeleteComponent(component: Component<any>): void;
    /**
    * Called when the manager will update all its systems.
    *
    * @param delta - The number of seconds between the last update and the current update.
    */
    managerWillUpdate(delta: number): void;
    /**
    * Update this system.
    *
    * @param delta - The number of seconds between the last update and the current update.
    */
    update(delta: number): void;
    /**
    * Called when the manager did update all its systems.
    *
    * @param delta - The number of seconds between the last update and the current update.
    */
    managerDidUpdate(delta: number): void;
    /**
    * Called when this system will be detached of its manager in order to release
    * all of its ressources.
    */
    destroy(): void;
    /**
    * Attach this system to a manager.
    *
    * @param manager - The future parent manager.
    */
    attach(manager: EntityComponentSystem): void;
    /**
    * Detach this system of its manager.
    */
    detach(): void;
}
