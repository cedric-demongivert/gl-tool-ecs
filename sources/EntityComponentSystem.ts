import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { Tag } from './Tag'
import { Entity } from './Entity'
import { Component } from './Component'
import { TagRelationshipRepository } from './TagRelationshipRepository'

import { EntityTypeSequence } from './EntityTypeSequence'
import { ComponentRepositorySequence } from './ComponentRepositorySequence'
import { StaticComponentRepository } from './StaticComponentRepository'
import { ComponentIndex } from './ComponentIndex'
import { ComponentType } from './ComponentType'
import { TypeMapping } from './TypeMapping'
import { System } from './System'
import { EntityComponentSystemBuilder } from './EntityComponentSystemBuilder'

export class EntityComponentSystem {
  public readonly entities : Sequence<Entity>
  private _entities : IdentifierSet

  public readonly tags : Sequence<Tag>
  private _tags: IdentifierSet
  private _relationshipsOfTags: TagRelationshipRepository

  public readonly types : Sequence<ComponentType<any>>
  private _types : TypeMapping
  private _typesByEntity : Pack<EntityTypeSequence>

  public readonly systems : Sequence<System>
  private _systems : Pack<System>

  public readonly components : Sequence<Component<any>>
  private _components : StaticComponentRepository
  private _componentsIndex : ComponentIndex

  private _capacity : EntityComponentSystem.Capacity

  /**
  * Create a new entity-component-system in accordance with a given builder.
  *
  * @param builder - A builder with the configuration of the system to build.
  */
  public constructor (builder : EntityComponentSystemBuilder = new EntityComponentSystemBuilder()) {
    this._entities = IdentifierSet.allocate(builder.entities)
    this.entities  = this._entities.view()

    this._tags = IdentifierSet.allocate(builder.tags)
    this._relationshipsOfTags = new TagRelationshipRepository(builder.entities, builder.tags)
    this.tags = this._tags.view()

    this._types = new TypeMapping(builder.types)
    this.types = this._types.types

    this._components = new StaticComponentRepository(builder.components)
    this._componentsIndex = new ComponentIndex(builder.entities, builder.types)
    this.components = new ComponentRepositorySequence(this._components)

    this._systems = Pack.any(32)
    this.systems = this._systems.view()

    this._typesByEntity = Pack.any(builder.entities)

    for (let index = 0; index < builder.entities; ++index) {
      this._typesByEntity.set(index, new EntityTypeSequence(this._componentsIndex.getTypesOfEntity(index), this._types))
    }

    this._capacity = Object.freeze({
      entities: builder.entities,
      tags: builder.tags,
      components: builder.components,
      types: builder.types
    })
  }

  /**
  * @return An object that contains the number of objects that this entity-component-system can store keyed by their type.
  */
  public get capacity () : EntityComponentSystem.Capacity {
    return this._capacity
  }

  /**
  * Create a new entity and return it.
  *
  * @return The created entity.
  */
  public createEntity () : Entity {
    if (this._entities.capacity === this._entities.size) {
      throw new Error(
        'Unable to create a new entity into this entity-component-system ' +
        'because this entity-component-system can\'t handle more than ' +
        this._capacity.entities + ' entities, please reallocate this entity-' +
        'component-system in order to augment its inner capacity.'
      )
    }

    const entity : Entity = this._entities.get(this._entities.size) // @TODO make a specialized method

    this.willAddEntity(entity)
    this._entities.add(entity)
    this.didAddEntity(entity)

    return entity
  }

  /**
  * Add a new entity into this entity-component-system.
  *
  * @param entity - An entity to add to this entity-component-system.
  */
  public addEntity (entity : Entity) : void {
    if (this._entities.has(entity)) {
      throw new Error(
        'Unable to register the entity #' + entity + ' into this entity-' +
        'component-system because the given entity already exists into it.'
      )
    }

    if (entity >= this._capacity.entities) {
      throw new Error(
        'Unable to register the entity #' + entity + ' into this entity-' +
        'component-system because the given entity exceed the current entity ' +
        'capacity of this system ' + this._capacity.entities + ', please ' +
        'reallocate this entity-component-system in order to augment its ' +
        'inner capacity.'
      )
    }

    this.willAddEntity(entity)
    this._entities.add(entity)
    this.didAddEntity(entity)
  }

  /**
  * Remove an entity from this entity-component-system.
  *
  * @param entity - An entity to remove.
  */
  public deleteEntity (entity : Entity) : void {
    if (!this._entities.has(entity)) {
      throw new Error(
        'Unable to delete the entity ' + entity + ' from this entity-' +
        'component-system because the given entity does not exists into it.'
      )
    }

    const types : Sequence<number> = this._componentsIndex.getTypesOfEntity(entity)

    while (types.size > 0) {
      this.deleteComponentByIdentifier(this._componentsIndex.get(entity, types.first))
    }

    this.detachAllTagsFromEntity(entity)

    this.willDeleteEntity(entity)
    this._entities.delete(entity)
    this.didDeleteEntity(entity)
  }

  /**
  * Return a collection of entities with the given tag.
  *
  * @param tag - A tag to search for.
  *
  * @return A collection of entities with the given tag.
  */
  public getEntitiesWithTag (tag : Tag) : Sequence<Entity> {
    return this._relationshipsOfTags.getEntitiesWithTag(tag)
  }

  /**
  * Return a collection of entities that have a component of the given type.
  *
  * @param type - Type to search for.
  *
  * @return A collection of entities that have a component of the given type.
  */
  public getEntitiesWithType (type : ComponentType<any>) : Sequence<Entity> {
    return this._componentsIndex.getEntitiesWithType(this._types.get(type))
  }

  /**
  * Remove all entities from this entity-component-system.
  */
  public clearEntities () : void {
    const entities : Sequence<Entity> = this._entities

    while (entities.size > 0) {
      this.deleteEntity(entities.get(0))
    }
  }

  /**
  * Called when this entity-component-system will add an entity.
  *
  * @param entity - The identifier of the entity to add.
  */
  private willAddEntity (entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillAddEntity(entity)
    }
  }

  /**
  * Called when this entity-component-system did add an entity.
  *
  * @param entity - The identifier of the added entity.
  */
  private didAddEntity (entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidAddEntity(entity)
    }
  }

  /**
  * Called when this entity-component-system will delete an entity.
  *
  * @param entity - The identifier of the entity that will be deleted.
  */
  private willDeleteEntity (entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillDeleteEntity(entity)
    }
  }

  /**
  * Called when this entity-component-system did delete an entity.
  *
  * @param entity - The identifier of the entity that was deleted.
  */
  private didDeleteEntity (entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidDeleteEntity(entity)
    }
  }

  /**
  * Create a new tag and return it.
  *
  * @return The created tag.
  */
  public createTag () : Tag {
    if (this._tags.capacity === this._tags.size) {
      throw new Error(
        'Unable to create a new tag because this entity-component-system ' +
        'can\'t handle more than ' + this._capacity.tags + ' tags, please ' +
        'reallocate  this entity-component-system in order to augment is ' +
        'inner capacity.'
      )
    }

    const tag : Tag = this._tags.get(this._tags.size) // @TODO make a specialized method
    this.willAddTag(tag)
    this._tags.add(tag)
    this.didAddTag(tag)

    return tag
  }

  /**
  * Add a new tag into this entity-component-system.
  *
  * @param tag - A tag to add to this entity-component-system.
  */
  public addTag (tag : Tag) : void {
    if (this._tags.has(tag)) {
      throw new Error(
        'Unable to add the tag #' + tag + ' to this entity-component-system ' +
        'because the given tag already exists into it.'
      )
    }

    if (tag >= this._capacity.tags) throw new Error(
      'Unable to add the tag #' + tag + ' to this entity-component-system ' +
      'because the given tag exceed its inner capacity of ' +
      this._capacity.tags + ' tags, please reallocate this ' +
      'entity-component-system in order to augment is inner capacity.'
    )

    this.willAddTag(tag)
    this._tags.add(tag)
    this.didAddTag(tag)
  }

  /**
  * Remove a tag from this manager.
  *
  * @param tag - A tag to remove from the manager.
  */
  public deleteTag (tag : Tag) : void {
    if (!this._tags.has(tag)) {
      throw new Error(
        'Unable to delete the tag #' + tag + ' from this entity-' +
        'component-system because the given tag does not exists into it.'
      )
    }

    this.detachTagFromItsEntities(tag)
    this.willDeleteTag(tag)
    this._tags.delete(tag)
    this.didDeleteTag(tag)
  }

  /**
  * Attach a tag to an entity.
  *
  * @param tag - The tag to attach.
  * @param entity - The entity that must be tagged.
  */
  public attachTagToEntity (tag : Tag, entity : Entity) : void {
    if (!this._tags.has(tag)) {
      throw new Error(
        'Unable to attach the tag #' + tag + ' to entity #' + entity +
        ' because the given tag does not exists into this entity-' +
        'component-system.'
      )
    }

    if (!this._entities.has(entity)) {
      throw new Error(
        'Unable to attach the tag #' + tag + ' to entity #' + entity +
        ' because the given entity does not exists into this entity-' +
        'component-system.'
      )
    }

    if (!this._relationshipsOfTags.getEntitiesWithTag(tag).has(entity)) {
      this.willAttachTagToEntity(tag, entity)
      this._relationshipsOfTags.attachTagToEntity(tag, entity)
      this.didAttachTagToEntity(tag, entity)
    } else {
      throw new Error(
        'Unable to attach the tag #' + tag + ' to entity #' + entity +
        ' because the given tag is already attached to the given entity.'
      )
    }
  }

  /**
  * Remove a tag from an entity.
  *
  * @param tag - The tag to detach.
  * @param entity - The entity that must be untagged.
  */
  public detachTagFromEntity (tag : Tag, entity : Entity) : void {
    if (!this._tags.has(tag)) {
      throw new Error(
        'Unable to detach the tag #' + tag + ' from entity #' + entity +
        ' because the given tag does not exists into this entity-' +
        'component-system.'
      )
    }

    if (!this._entities.has(entity)) {
      throw new Error(
        'Unable to detach the tag #' + tag + ' from entity #' + entity +
        ' because the given entity does not exists into this entity-' +
        'component-system.'
      )
    }

    if (this._relationshipsOfTags.getEntitiesWithTag(tag).has(entity)) {
      this.willDetachTagFromEntity(tag, entity)
      this._relationshipsOfTags.detachTagFromEntity(tag, entity)
      this.didDetachTagFromEntity(tag, entity)
    } else {
      throw new Error(
        'Unable to detach the tag #' + tag + ' to entity #' + entity +
        ' because the given tag is not attached to the given entity.'
      )
    }
  }

  /**
  * Remove all tags attached to a given entity.
  *
  * @param entity - An entity to clean of all its tags.
  */
  public detachAllTagsFromEntity (entity : Entity) : void {
    if (!this._entities.has(entity)) {
      throw new Error(
        'Unable to detach all tags of entity #' + entity + ' because ' +
        'the given entity does not exists into this entity-component-system.'
      )
    }

    const tags : Sequence<number> = this._tags

    for (let index = 0, size = tags.size; index < size; ++index) {
      const tag : number = tags.get(index)

      if (this._relationshipsOfTags.getEntitiesWithTag(tag).has(entity)) {
        this.willDetachTagFromEntity(tag, entity)
        this._relationshipsOfTags.detachTagFromEntity(tag, entity)
        this.didDetachTagFromEntity(tag, entity)
      }
    }
  }

  /**
  * Remove the given tag from all of its attached entities.
  *
  * @param tag - A tag to detach from its entities.
  */
  public detachTagFromItsEntities (tag : Tag) : void {
    if (!this._tags.has(tag)) {
      throw new Error(
        'Unable to detach the tag #' + tag + ' from its entities because ' +
        'the given tag does not exists into this entity-component-system.'
      )
    }

    const entities : Sequence<number> = this._relationshipsOfTags.getEntitiesWithTag(tag)

    while (entities.size > 0) {
      const entity : number = entities.get(0)

      this.willDetachTagFromEntity(tag, entity)
      this._relationshipsOfTags.detachTagFromEntity(tag, entity)
      this.didDetachTagFromEntity(tag, entity)
    }
  }

  /**
  * Remove all tags from this entity-component-system.
  */
  public clearTags () : void {
    const tags : Sequence<number> = this._tags

    while (tags.size > 0) this.deleteTag(tags.get(0))
  }

  /**
  * Called when this entity-component-system will add a tag.
  *
  * @param tag - The identifier of the tag to add.
  */
  private willAddTag (tag : Tag) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillAddTag(tag)
    }
  }

  /**
  * Called whenthis entity-component-system did add a tag.
  *
  * @param tag - The identifier of the added tag.
  */
  private didAddTag (tag : Tag) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidAddTag(tag)
    }
  }

  /**
  * Called when this entity-component-system will delete a tag.
  *
  * @param tag - The identifier of the tag to delete.
  */
  private willDeleteTag (tag : Tag) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillDeleteTag(tag)
    }
  }

  /**
  * Called when this entity-component-system did delete a tag.
  *
  * @param tag - The identifier of the deleted tag.
  */
  private didDeleteTag (tag : Tag) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidDeleteTag(tag)
    }
  }

  /**
  * Called when this entity-component-system did attach a tag to an entity.
  *
  * @param tag - The identifier of the attached tag.
  * @param entity - The identifier of the targeted entity.
  */
  private willAttachTagToEntity (tag : Tag, entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillAttachTagToEntity(tag, entity)
    }
  }

  /**
  * Called when this entity-component-system will detach a tag from an entity.
  *
  * @param tag - The identifier of the tag to detach.
  * @param entity - The identifier of the targeted entity.
  */
  private didAttachTagToEntity (tag : Tag, entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidAttachTagToEntity(tag, entity)
    }
  }

  /**
  * Called when this entity-component-system will detach a tag from an entity.
  *
  * @param tag - The identifier of the tag to detach.
  * @param entity - The identifier of the targeted entity.
  */
  private willDetachTagFromEntity (tag : Tag, entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillDetachTagFromEntity(tag, entity)
    }
  }

  /**
  * Called when this entity-component-system did detach a tag from an entity.
  *
  * @param tag - The identifier of the detached tag.
  * @param entity - The identifier of the targeted entity.
  */
  private didDetachTagFromEntity (tag : Tag, entity : Entity) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidDetachTagFromEntity(tag, entity)
    }
  }

  /**
  * Add a type to this entity-component-system.
  *
  * @param type - Type to add.
  */
  public addType (type : ComponentType<any>) : void {
    if (this._types.has(type)) {
      throw new Error(
        'Unable to register the type ' + type + ' because the given type ' +
        'already exists.'
      )
    }

    if (this._types.size === this._types.capacity) {
      throw new Error(
        'Unable to register the type ' + type + ' because it will ' +
        'exceed the type capacity of this entity-component-system that is of ' +
        this._types.capacity + ', please reallocate this ' +
        'entity-component-system in order to expand its inner capacity.'
      )
    }

    this.willAddType(type)
    this._types.add(type)
    this.didAddType(type)
  }

  /**
  * Delete a type from this entity-component-system.
  *
  * @param type - Type to delete.
  */
  public deleteType (type : ComponentType<any>) : void {
    if (!this._types.has(type)) {
      throw new Error(
        'Unable to delete the type ' + type + ' because the given type does ' +
        'not exists into this entity-component-system.'
      )
    }

    const identifier : number = this._types.get(type)
    const entities : Sequence<Entity> = this._componentsIndex.getEntitiesWithType(identifier)

    while (entities.size > 0) {
      this.deleteComponentByIdentifier(this._componentsIndex.get(entities.first, identifier))
    }

    this.willDeleteType(type)
    this._types.delete(type)
    this.didDeleteType(type)
  }

  /**
  * Delete all types of this entity-component-system.
  */
  public clearTypes () : void {
    const types : Sequence<ComponentType<any>> = this.types
    while (types.size > 0) this.deleteType(types.get(0))
  }

  /**
  * Return all types assigned to a given entity.
  *
  * @param entity - An entity to search for.
  *
  * @return A collection of types that exists on the given entity.
  */
  public getTypesOfEntity (entity : Entity) : Sequence<ComponentType<any>> {
    return this._typesByEntity.get(entity)
  }

  /**
  * Called when this entity-component-system will add a type.
  *
  * @param type - The type that will be added.
  */
  private willAddType (type : ComponentType<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillAddType(type)
    }
  }

  /**
  * Called when this entity-component-system did add a type.
  *
  * @param type - The type that was added.
  */
  private didAddType (type : ComponentType<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidAddType(type)
    }
  }

  /**
  * Called when this entity-component-system will delete a type.
  *
  * @param type - The type that will be deleted.
  */
  private willDeleteType (type : ComponentType<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillDeleteType(type)
    }
  }

  /**
  * Called when this entity-component-system did delete a type.
  *
  * @param type - The type that was deleted.
  */
  private didDeleteType (type : ComponentType<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidDeleteType(type)
    }
  }

  /**
  * Create a component and assign it to a given entity.
  *
  * @param entity - The entity to target.
  * @param type - The type of component to create.
  *
  * @return The created component.
  */
  public createComponent <Type> (entity : number, type : ComponentType<Type>, ...parameters : any[]) : Component<Type> {
    if (!this._entities.has(entity)) {
      throw new Error(
        'Unable to create a component of type ' + type + ' on entity #' +
        entity + ' because the given entity does not exists into this ' +
        'entity-component-system.'
      )
    }

    if (!this._types.has(type)) {
      throw new Error(
        'Unable to create a component of type ' + type + ' on entity #' +
        entity + ' because the handler does not have a type assigned to it.'
      )
    }

    const identifier : number = this._types.get(type)

    if (this._componentsIndex.has(entity, identifier)) {
      throw new Error(
        'Unable to create a component of type ' + type + ' on entity #' +
        entity + ' because a component of the given type is already ' +
        'assigned to the given entity.'
      )
    }

    if (this._components.size === this._components.capacity) {
      throw new Error(
        'Unable to create a component of type ' + type + ' on entity #' +
        entity + ' because it will exceed the component capacity of ' +
        this._components.capacity + ' of this entity-component-system, ' +
        'please reallocate this entity-component-system in order to expand ' +
        'its component capacity.'
      )
    }

    this.willAddComponent(entity, type)
    const component : Component<Type> = this._components.create(entity, type, ...parameters)
    this._componentsIndex.set(entity, identifier, component.identifier)
    this.didAddComponent(component)

    return component
  }

  /**
  * Return the instance of a given component.
  *
  * @param identifier - Identifier of the component to get.
  *
  * @return The instance of the given component.
  */
  public getComponent (identifier : number) : Component<any>
  public getComponent <Type> (identifier : number, type : ComponentType<Type>) : Component<Type>
  public getComponent <Type> (identifier : number, type? : ComponentType<Type>) : Component<any> {
    return this._components.get(identifier, type)
  }

  public getComponentOfEntity <Type> (entity : Entity, type : ComponentType<Type>) : Component<Type> {
    return this._components.get(this._componentsIndex.get(entity, this._types.get(type)), type)
  }

  /**
  * Return true if the given entity has a component of the given type.
  *
  * @param entity - Identifier of the entity to search for.
  * @param type - Type of the component to search for.
  *
  * @return True if the given component exists into this collection.
  */
  public hasComponent (entity : number, type : ComponentType<any>) : boolean {
    return this._componentsIndex.has(entity, this._types.get(type))
  }

  /**
  * Delete an existing component.
  *
  * @param entity - Entity that have the component to delete.
  * @param type - Type of component to delete.
  */
  public deleteComponent (entity : number, type : ComponentType<any>) : void {
    if (!this._entities.has(entity)) {
      throw new Error(
        'Unable to delete component of type ' + type + ' from entity #' +
        entity + ' because the given entity does not exists into this entity-' +
        'component-system.'
      )
    }

    if(!this._types.has(type)) {
      throw new Error(
        'Unable to delete component of type ' + type + ' from entity #' +
        entity + ' because the handler is not attached to a type of this ' +
        'entity-component-system.'
      )
    }

    const identifier : number = this._types.get(type)

    if(!this._componentsIndex.has(entity, identifier)) {
      throw new Error(
        'Unable to delete component of type ' + type + ' from entity #' +
        entity + ' because the given component does not exists in this ' +
        'entity-component-system.'
      )
    }

    const component : Component<any> = this._components.get(
      this._componentsIndex.get(entity, identifier)
    )

    this.willDeleteComponent(component)
    this._componentsIndex.delete(entity, identifier)
    this._components.delete(component.identifier)
    this.didDeleteComponent(component)
  }

  /**
  * Remove a component from this entity-component-system by using its identifier.
  *
  * @param component - Identifier of the component to remove.
  */
  public deleteComponentByIdentifier (component : number) : void {
    if (!this._components.has(component)) {
      throw new Error(
        'Unable to delete the component #' + component + ' because the given ' +
        'component does not exists into this entity-component-system.'
      )
    }

    const instance : Component<any> = this._components.get(component)
    const type : ComponentType<any> = instance.type

    this.willDeleteComponent(instance)
    this._componentsIndex.delete(instance.entity, this._types.get(type))
    this._components.delete(component)
    this.didDeleteComponent(instance)
  }

  /**
  * Remove all components of this entity-component-system.
  */
  public clearComponents () : void {
    const components : Sequence<Component<any>> = this.components

    while (components.size > 0) {
      this.deleteComponentByIdentifier(components.get(0).identifier)
    }
  }

  /**
  * Called when this entity-component-system will add a component.
  *
  * @param entity - The entity that will get the given component.
  * @param type - The type of the component to add.
  */
  private willAddComponent (entity : Entity, type : ComponentType<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillAddComponent(entity, type)
    }
  }

  /**
  * Called when this entity-component-system did add a component.
  *
  * @param component - The component that was added.
  */
  private didAddComponent (component : Component<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidAddComponent(component)
    }
  }

  /**
  * Called when this entity-component-system will delete a component.
  *
  * @param component - The component that will be deleted.
  */
  private willDeleteComponent (component : Component<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillDeleteComponent(component)
    }
  }

  /**
  * Called when this entity-component-system did delete a component.
  *
  * @param component - The component that was deleted.
  * @param type - The type of the component that was deleted.
  */
  private didDeleteComponent (component : Component<any>) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidDeleteComponent(component)
    }
  }

  /**
  * Add a system to this entity-component-system.
  *
  * @param system - A system to add.
  */
  public addSystem (system : System) : void {
    if (this._systems.indexOf(system) >= 0) {
      throw new Error(
        'Unable to add the system instance ' + system + ' to this ' +
        'entity-component-system because the given system was already added ' +
        'to it.'
      )
    }

    for (const registeredSystem of this._systems) {
      registeredSystem.managerWillAddSystem(system)
    }

    this._systems.push(system)
    system.attach(this)
    system.initialize()

    for (const registeredSystem of this._systems) {
      registeredSystem.managerDidAddSystem(system)
    }
  }

  /**
  * Require a system of a given type.
  *
  * @param type - The type of system to return.
  *
  * @return The first system of the given type or fail.
  */
  public requireSystem <T extends System> (type : new (...args : any) => T) : T {
    const result : T = this.firstSystem(type)

    if (result == null) {
      throw new Error(
        'No system of type ' + type.name + ' found in this entity-component ' +
        'system.'
      )
    } else {
      return result
    }
  }

  /**
  * Find the first system of a given type.
  *
  * @param type - The type of system to return.
  *
  * @return The first system of the given type or null.
  */
  public firstSystem <T extends System> (type : new (...args : any) => T) : T {
    const systems : Pack<System> = this._systems

    for (let index = 0, size = systems.size; index < size; ++index) {
      const system : System = this._systems.get(index)

      if (system instanceof type) {
        return system as T
      }
    }

    return null
  }

  /**
  * Delete a system from this entity-component-system.
  *
  * @param system - A system to delete from this entity-component-system.
  */
  public deleteSystem (system : System) : void {
    const index : number = this._systems.indexOf(system)

    if (index < 0) {
      throw new Error(
        'Unable to delete the system instance ' + system + ' from this ' +
        'entity-component-system because the given system does not exists.'
      )
    }

    for (const registeredSystem of this._systems) {
      registeredSystem.managerWillDeleteSystem(system)
    }

    system.destroy()
    this._systems.delete(index)
    system.detach()

    for (const registeredSystem of this._systems) {
      registeredSystem.managerDidDeleteSystem(system)
    }
  }

  /**
  * Return true if the given systems belongs to this entity-component-system.
  *
  * @param system - A system to search for.
  * @return True if the given systems belongs to this entity-component-system.
  */
  public hasSystem (system : System) : boolean {
    return this._systems.indexOf(system) >= 0
  }

  /**
  * Update all systems of this entity-component-system.
  *
  * @param delta - Elapsed time between two system update.
  */
  public update (delta : number) : void {
    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerWillUpdate(delta)
    }

    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).update(delta)
    }

    for (let index = 0, size = this._systems.size; index < size; ++index) {
      this._systems.get(index).managerDidUpdate(delta)
    }
  }

  /**
  * Remove all systems from this entity-component-system.
  */
  public clearSystems () : void {
    const systems : Pack<System> = this._systems

    while (systems.size > 0) {
      const system : System = systems.last
      system.destroy()
      this._systems.pop()
      system.detach()
    }
  }

  /**
  * Empty this entity-component-system.
  */
  public clear () : void {
    this.clearSystems()
    this.clearComponents()
    this.clearTypes()
    this.clearEntities()
    this.clearTags()
  }
}

export namespace EntityComponentSystem {
  export type Capacity = {
    entities : number,
    types : number,
    components : number,
    tags : number
  }
}
