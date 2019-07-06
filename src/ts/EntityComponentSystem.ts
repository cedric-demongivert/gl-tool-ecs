import {
  Collection,
  View,
  Cursor,
  BufferedNumberSet,
  ArrayView
} from './collection'

import { StaticTypeRepository, TypeHandler } from './types'
import { StaticComponentRepository, ComponentIndex } from './components'
import { TagRelationshipRepository } from './tags'
import { System } from './systems'
import { EntityComponentSystemBuilder } from './EntityComponentSystemBuilder'

type EntityComponentSystemCapacities = {
  entities : number,
  types : number,
  components : number,
  tags : number
}

export class EntityComponentSystem {
  private _entities: BufferedNumberSet
  private _tags: BufferedNumberSet
  private _relationshipsOfTags: TagRelationshipRepository
  private _types : StaticTypeRepository
  private _components : StaticComponentRepository
  private _systems : Array<System>

  private _componentsIndex : ComponentIndex

  private _entityCursor : Cursor
  private _tagCursor : Cursor

  private _entitiesView : Collection<number>
  private _tagsView : Collection<number>
  private _typesView : Collection<number>
  private _componentsView : Collection<number>
  private _systemsView : Collection<System>

  private _capacity : EntityComponentSystemCapacities

  /**
  * Create a new entity-component-system in accordance with a given builder.
  *
  * @param builder - A builder with the configuration of the system to build.
  */
  public constructor (builder : EntityComponentSystemBuilder) {
    this._entities = new BufferedNumberSet(builder.entities)
    this._tags = new BufferedNumberSet(builder.tags)
    this._relationshipsOfTags = new TagRelationshipRepository(
      builder.entities, builder.tags
    )
    this._types = new StaticTypeRepository(builder.types)
    this._components = new StaticComponentRepository(builder.components)
    this._systems = new Array<System>()

    this._componentsIndex = new ComponentIndex(builder.entities, builder.types)

    this._entityCursor = new Cursor(this._entities)
    this._tagCursor = new Cursor(this._tags)

    this._entitiesView = View.wrap(this._entities)
    this._tagsView = View.wrap(this._tags)
    this._typesView = View.wrap(this._types)
    this._componentsView = View.wrap(this._components)
    this._systemsView = ArrayView.wrap(this._systems)

    this._capacity = Object.freeze({
      entities: builder.entities,
      tags: builder.tags,
      components: builder.components,
      types: builder.types
    })
  }

  /**
  * @return All entities of this entity-component-system as a readonly collection.
  */
  public get entities () : Collection<number> {
    return this._entitiesView
  }

  /**
  * @return All tags of this entity-component-system as a readonly collection.
  */
  public get tags () : Collection<number> {
    return this._tagsView
  }

  /**
  * @return All components of this entity-component-system as a readonly collection.
  */
  public get components () : Collection<number> {
    return this._componentsView
  }

  /**
  * @return All types of this entity-component-system as a readonly collection.
  */
  public get types () : Collection<number> {
    return this._typesView
  }

  /**
  * @return All systems of this entity-component-system as a readonly collection.
  */
  public get systems () : Collection<System> {
    return this._systemsView
  }

  /**
  * @return An object that contains the number of objects that this entity-component-system can store keyed by their type.
  */
  public get capacity () : EntityComponentSystemCapacities {
    return this._capacity
  }

  /**
  * Create a new entity and return it.
  *
  * @return The created entity.
  */
  public createEntity () : number {
    const entity : number = this._entityCursor.next()

    if (entity >= this._capacity.entities) throw new Error([
      'Unable to create a new entity into this entity-component-system ',
      'because this entity-component-system can\'t handle more than ',
      this._capacity.entities, ' entities, please reallocate this entity-',
      'component-system in order to augment its inner capacity.'
    ].join(''))


    this.willAddEntity(entity)
    this._entities.add(this._entityCursor.next())
    this.didAddEntity(entity)

    return entity
  }

  /**
  * Add a new entity into this entity-component-system.
  *
  * @param entity - An entity to add to this entity-component-system.
  */
  public addEntity (entity : number) : void {
    if (this._entities.has(entity)) throw new Error([
      'Unable to register the entity #', entity, ' into this entity-',
      'component-system because the given entity already exists into it.'
    ].join(''))

    if (entity >= this._capacity.entities) throw new Error([
      'Unable to register the entity #', entity, ' into this entity-',
      'component-system because the given entity exceed the current entity ',
      'capacity of this system ', this._capacity.entities, ', please ',
      'reallocate this entity-component-system in order to augment its inner ',
      'capacity.'
    ].join(''))

    this.willAddEntity(entity)
    this._entities.add(entity)
    this.didAddEntity(entity)
  }

  /**
  * Return true if the given entity exists.
  *
  * @param entity - An entity to search for.
  *
  * @return True if the given entity exists.
  */
  public hasEntity (entity : number) : boolean {
    return this._entities.has(entity)
  }

  /**
  * Remove an entity from this entity-component-system.
  *
  * @param entity - An entity to remove.
  */
  public deleteEntity (entity : number) : void {
    if (!this._entities.has(entity)) throw new Error([
      'Unable to delete the entity ', entity, ' from this entity-component',
      '-system because the given entity does not exists into it.'
    ].join(''))

    const types : Collection<number> = (
      this._componentsIndex.getTypesOfEntity(entity)
    )

    while (types.size > 0) {
      this.deleteComponentByIdentifier(
        this._componentsIndex.get(entity, types.get(0))
      )
    }

    this.detachAllTagsFromEntity(entity)

    this.willDeleteEntity(entity)
    this._entities.delete(entity)
    if (entity < this._entityCursor.next()) this._entityCursor.move(entity)
    this.didDeleteEntity(entity)
  }

  /**
  * Return a collection of entities with the given tag.
  *
  * @param tag - A tag to search for.
  *
  * @return A collection of entities with the given tag.
  */
  public getEntitiesWithTag (tag : number) : Collection<number> {
    return this._relationshipsOfTags.getEntitiesWithTag(tag)
  }

  /**
  * Return a collection of entities that have a component of the given type.
  *
  * @param handler - Handler of the type to search for.
  *
  * @return A collection of entities that have a component of the given type.
  */
  public getEntitiesWithType (handler : TypeHandler) : Collection<number> {
    return this._componentsIndex.getEntitiesWithType(
      this._types.getTypeOfHandler(handler)
    )
  }

  /**
  * Return a collection of entities that have a component of the given type.
  *
  * @param type - Type to search for.
  *
  * @return A collection of entities that have a component of the given type.
  */
  public getEntitiesWithTypeIdentifier (type : number) : Collection<number> {
    return this._componentsIndex.getEntitiesWithType(type)
  }

  /**
  * Remove all entities from this entity-component-system.
  */
  public clearEntities () : void {
    const entities : BufferedNumberSet = this._entities
    while (entities.size > 0) this.deleteEntity(entities.get(0))
  }

  /**
  * Called when this entity-component-system will add an entity.
  *
  * @param entity - The identifier of the entity to add.
  */
  private willAddEntity (entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillAddEntity(entity)
    }
  }

  /**
  * Called when this entity-component-system did add an entity.
  *
  * @param entity - The identifier of the added entity.
  */
  private didAddEntity (entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidAddEntity(entity)
    }
  }

  /**
  * Called when this entity-component-system will delete an entity.
  *
  * @param entity - The identifier of the entity that will be deleted.
  */
  private willDeleteEntity (entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillDeleteEntity(entity)
    }
  }

  /**
  * Called when this entity-component-system did delete an entity.
  *
  * @param entity - The identifier of the entity that was deleted.
  */
  private didDeleteEntity (entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidDeleteEntity(entity)
    }
  }

  /**
  * Create a new tag and return it.
  *
  * @return The created tag.
  */
  public createTag () : number {
    const tag : number = this._tagCursor.next()

    if (tag >= this._capacity.tags) throw new Error([
      'Unable to create a new tag because this entity-component-system can\'t ',
      'handle more than ', this._capacity.tags, ' tags, please reallocate ',
      'this entity-component-system in order to augment is inner capacity.'
    ].join(''))

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
  public addTag (tag : number) : void {
    if (this._tags.has(tag)) throw new Error([
      'Unable to add the tag #', tag, ' to this entity-component-system ',
      'because the given tag already exists into it.'
    ].join(''))

    if (tag >= this._capacity.tags) throw new Error([
      'Unable to add the tag #', tag, ' to this entity-component-system ',
      'because the given tag exceed its inner capacity of ',
      this._capacity.tags, ' tags, please reallocate this ',
      'entity-component-system in order to augment is inner capacity.'
    ].join(''))

    this.willAddTag(tag)
    this._tags.add(tag)
    this.didAddTag(tag)
  }

  /**
  * Return true if the given tag exists.
  *
  * @param tag - A tag to search for.
  *
  * @return True if the given tag exists.
  */
  public hasTag (tag : number) : boolean {
    return this._tags.has(tag)
  }

  /**
  * Remove a tag from this manager.
  *
  * @param tag - A tag to remove from the manager.
  */
  public deleteTag (tag : number) : void {
    if (!this._tags.has(tag)) throw new Error([
      'Unable to delete the tag #', tag, ' from this entity-component-system ',
      'because the given tag does not exists into it.'
    ].join(''))

    this.detachTagFromItsEntities(tag)
    this.willDeleteTag(tag)
    this._tags.delete(tag)
    if (tag < this._tagCursor.next()) this._tagCursor.move(tag)
    this.didDeleteTag(tag)
  }

  /**
  * Attach a tag to an entity.
  *
  * @param tag - The tag to attach.
  * @param entity - The entity that must be tagged.
  */
  public attachTagToEntity (tag : number, entity : number) : void {
    if (!this._tags.has(tag)) throw new Error([
      'Unable to attach the tag #', tag, ' to entity #', entity, ' because ',
      'the given tag does not exists into this entity-component-system.'
    ].join(''))

    if (!this._entities.has(entity)) throw new Error([
      'Unable to attach the tag #', tag, ' to entity #', entity, ' because ',
      'the given entity does not exists into this entity-component-system.'
    ].join(''))

    if (!this._relationshipsOfTags.getEntitiesWithTag(tag).has(entity)) {
      this.willAttachTagToEntity(tag, entity)
      this._relationshipsOfTags.attachTagToEntity(tag, entity)
      this.didAttachTagToEntity(tag, entity)
    } else {
      throw new Error([
        'Unable to attach the tag #', tag, ' to entity #', entity, ' because ',
        'the given tag is already attached to the given entity.'
      ].join(''))
    }
  }

  /**
  * Remove a tag from an entity.
  *
  * @param tag - The tag to detach.
  * @param entity - The entity that must be untagged.
  */
  public detachTagFromEntity (tag : number, entity : number) : void {
    if (!this._tags.has(tag)) throw new Error([
      'Unable to detach the tag #', tag, ' from entity #', entity, ' because ',
      'the given tag does not exists into this entity-component-system.'
    ].join(''))

    if (!this._entities.has(entity)) throw new Error([
      'Unable to detach the tag #', tag, ' from entity #', entity, ' because ',
      'the given entity does not exists into this entity-component-system.'
    ].join(''))

    if (this._relationshipsOfTags.getEntitiesWithTag(tag).has(entity)) {
      this.willDetachTagFromEntity(tag, entity)
      this._relationshipsOfTags.detachTagFromEntity(tag, entity)
      this.didDetachTagFromEntity(tag, entity)
    } else {
      throw new Error([
        'Unable to detach the tag #', tag, ' to entity #', entity, ' because ',
        'the given tag is not attached to the given entity.'
      ].join(''))
    }
  }

  /**
  * Remove all tags attached to a given entity.
  *
  * @param entity - An entity to clean of all its tags.
  */
  public detachAllTagsFromEntity (entity : number) : void {
    if (!this._entities.has(entity)) throw new Error([
      'Unable to detach all tags of entity #', entity, ' because ',
      'the given entity does not exists into this entity-component-system.'
    ].join(''))

    const tags : Collection<number> = this._tags

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
  public detachTagFromItsEntities (tag : number) : void {
    if (!this._tags.has(tag)) throw new Error([
      'Unable to detach the tag #', tag, ' from its entities because ',
      'the given tag does not exists into this entity-component-system.'
    ].join(''))

    const entities : Collection<number> = (
      this._relationshipsOfTags.getEntitiesWithTag(tag)
    )

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
    const tags : Collection<number> = this._tags
    while (tags.size > 0) this.deleteTag(tags.get(0))
  }

  /**
  * Called when this entity-component-system will add a tag.
  *
  * @param tag - The identifier of the tag to add.
  */
  private willAddTag (tag : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillAddTag(tag)
    }
  }

  /**
  * Called whenthis entity-component-system did add a tag.
  *
  * @param tag - The identifier of the added tag.
  */
  private didAddTag (tag : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidAddTag(tag)
    }
  }

  /**
  * Called when this entity-component-system will delete a tag.
  *
  * @param tag - The identifier of the tag to delete.
  */
  private willDeleteTag (tag : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillDeleteTag(tag)
    }
  }

  /**
  * Called when this entity-component-system did delete a tag.
  *
  * @param tag - The identifier of the deleted tag.
  */
  private didDeleteTag (tag : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidDeleteTag(tag)
    }
  }

  /**
  * Called when this entity-component-system did attach a tag to an entity.
  *
  * @param tag - The identifier of the attached tag.
  * @param entity - The identifier of the targeted entity.
  */
  private willAttachTagToEntity (tag : number, entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillAttachTagToEntity(tag, entity)
    }
  }

  /**
  * Called when this entity-component-system will detach a tag from an entity.
  *
  * @param tag - The identifier of the tag to detach.
  * @param entity - The identifier of the targeted entity.
  */
  private didAttachTagToEntity (tag : number, entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidAttachTagToEntity(tag, entity)
    }
  }

  /**
  * Called when this entity-component-system will detach a tag from an entity.
  *
  * @param tag - The identifier of the tag to detach.
  * @param entity - The identifier of the targeted entity.
  */
  private willDetachTagFromEntity (tag : number, entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillDetachTagFromEntity(tag, entity)
    }
  }

  /**
  * Called when this entity-component-system did detach a tag from an entity.
  *
  * @param tag - The identifier of the detached tag.
  * @param entity - The identifier of the targeted entity.
  */
  private didDetachTagFromEntity (tag : number, entity : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidDetachTagFromEntity(tag, entity)
    }
  }

  /**
  * Create a type for the given handler.
  *
  * @param type - Handler of the type to create.
  *
  * @return The identifier of the created type.
  */
  public createType (type : TypeHandler) : number {
    if (this._types.hasHandler(type)) throw new Error([
      'Unable to create a type for the handler ', type, ' because the given ',
      'handler is already assigned to the type ',
      this._types.getTypeOfHandler(type), '.'
    ].join(''))

    if (this._types.size === this._types.capacity) throw new Error([
      'Unable to create a type for the handler ', type, ' because it will ',
      'exceed the type capacity of this entity-component-system that is of ',
      this._types.capacity, ', please reallocate this entity-component-system ',
      'in order to expand its inner capacity.'
    ].join(''))

    this.willAddType(this._types.next())
    const result : number = this._types.create(type)
    this.didAddType(result)

    return result
  }

  /**
  * Assign the type to the given handler.
  *
  * @param type - Type identifier to assign.
  * @param handler - Handler of the type to create.
  */
  public setType (type : number, handler : TypeHandler) : void {
    if (this._types.hasHandler(handler)) throw new Error([
      'Unable to set the type #', type, ' for the handler ', handler,
      ' because the given handler is already assigned to the type ',
      this._types.getTypeOfHandler(handler), '.'
    ].join(''))

    if (this._types.has(type)) throw new Error([
      'Unable to set the type #', type, ' for the handler ', handler,
      ' because the given type is already assigned to the handler ',
      this._types.getHandlerOfType(type), '.'
    ].join(''))

    if (type >= this._types.capacity) throw new Error([
      'Unable to set the type #', type, ' for the handler ', handler,
      ' because the given type exceed the capacity of this entity-component-',
      'system that is of ', this._types.capacity, ' please reallocate this ',
      'entity-component-system in order to expand its inner capacity.'
    ].join(''))

    this.willAddType(type)
    this._types.addHandlerAsType(handler, type)
    this.didAddType(type)
  }

  /**
  * Delete a type from this entity-component-system.
  *
  * @param handler - Handler of the type to delete.
  */
  public deleteType (handler : TypeHandler) : void {
    if (!this._types.hasHandler(handler)) throw new Error([
      'Unable to delete the type assigned to the handler ', handler,
      ' because the given handler does not hava a type assigned to it.'
    ].join(''))

    this.deleteTypeByIdentifier(this.getTypeOfHandler(handler))
  }

  /**
  * Delete a type from this entity-component-system.
  *
  * @param type - Type to delete.
  */
  public deleteTypeByIdentifier (type : number) : void {
    if (!this._types.has(type)) throw new Error([
      'Unable to delete the type #', type, ' because the given type does not ',
      'exists into this entity-component-system.'
    ].join(''))

    const entities : Collection<number> = (
      this._componentsIndex.getEntitiesWithType(type)
    )

    while (entities.size > 0) {
      this.deleteComponentByIdentifier(
        this._componentsIndex.get(entities.get(0), type)
      )
    }

    this.willDeleteType(type)
    this._types.delete(type)
    this.didDeleteType(type)
  }

  /**
  * Delete all types of this entity-component-system.
  */
  public clearTypes () : void {
    const types : Collection<number> = this._types
    while (types.size > 0) this.deleteTypeByIdentifier(types.get(0))
  }

  /**
  * Return the type assigned to a given handler if any.
  *
  * @param handler - An handler to search for.
  *
  * @return The type assigned to the given handler if any.
  */
  public getTypeOfHandler (handler : TypeHandler) : number {
    return this._types.getTypeOfHandler(handler)
  }

  /**
  * Return the handler of the given type if any.
  *
  * @param type - A type to search for.
  *
  * @return The handler of the given type if any.
  */
  public getHandlerOfType (type : number) : TypeHandler {
    return this._types.getHandlerOfType(type)
  }

  /**
  * Return all types assigned to a given entity.
  *
  * @param entity - An entity to search for.
  *
  * @return A collection of types that exists on the given entity.
  */
  public getTypesOfEntity (entity : number) : Collection<number> {
    return this._componentsIndex.getTypesOfEntity(entity)
  }

  /**
  * Return true if this entity-component-system has the given type.
  *
  * @param type - A type to search for.
  *
  * @return True if this entity-component-system has the given type.
  */
  public hasType (type : number) : boolean {
    return this._types.has(type)
  }

  /**
  * Return true if a type is assigned to the given handler.
  *
  * @param handler - A type handler to search for.
  *
  * @return True if this entity-component-system has assigned a type to the given handler.
  */
  public hasHandler (handler : TypeHandler) : boolean {
    return this._types.hasHandler(handler)
  }

  /**
  * Called when this entity-component-system will add a type.
  *
  * @param type - The type that will be added.
  */
  private willAddType (type : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillAddType(type)
    }
  }

  /**
  * Called when this entity-component-system did add a type.
  *
  * @param type - The type that was added.
  */
  private didAddType (type : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidAddType(type)
    }
  }

  /**
  * Called when this entity-component-system will delete a type.
  *
  * @param type - The type that will be deleted.
  */
  private willDeleteType (type : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillDeleteType(type)
    }
  }

  /**
  * Called when this entity-component-system did delete a type.
  *
  * @param type - The type that was deleted.
  */
  private didDeleteType (type : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidDeleteType(type)
    }
  }

  /**
  * Create a component and assign it to a given entity.
  *
  * @param entity - The entity to target.
  * @param handler - The handler of the type of component to create.
  *
  * @return The identifier of the created component.
  */
  public createComponent (entity : number, handler : TypeHandler) : number {
    if (!this._entities.has(entity)) throw new Error([
      'Unable to create a component of type ', handler, ' on entity #', entity,
      ' because the given entity does not exists into this entity-component',
      '-system.'
    ].join(''))

    if (!this._types.hasHandler(handler)) throw new Error([
      'Unable to create a component of type ', handler, ' on entity #', entity,
      ' because the handler does not have a type assigned to it.'
    ].join(''))

    const type : number = this._types.getTypeOfHandler(handler)

    if (this._componentsIndex.has(entity, type)) throw new Error([
      'Unable to create a component of type ', handler, ' on entity #', entity,
      ' because a component of the given type is already assigned to the ',
      'given entity.'
    ].join(''))

    const component : number = this._components.next()

    if (component >= this._capacity.components) throw new Error([
      'Unable to create a component of type ', handler, ' on entity #', entity,
      ' because it will exceed the component capacity of ',
      this._capacity.components, ' of this entity-component-system, please ',
      'reallocate this entity-component-system in order to expand its ',
      'component capacity.'
    ].join(''))

    this.willAddComponent(component, entity, type)
    this._components.create(entity, type, handler.instanciate())
    this._componentsIndex.set(entity, type, component)
    this.didAddComponent(component)

    return component
  }

  /**
  * Return the entity that possess the component with the given identifier.
  *
  * @param identifier - A component identifier to search for.
  *
  * @return The entity that possess the given component.
  */
  public getEntityOfComponent (component : number) : number {
    return this._components.getEntityOfComponent(component)
  }

  /**
  * Return the type of a given component.
  *
  * @param identifier - Identifier of the component to get.
  *
  * @return The type of the given component.
  */
  public getTypeOfComponent (component : number) : number {
    return this._components.getTypeOfComponent(component)
  }

  /**
  * Return the instance of a given component.
  *
  * @param identifier - Identifier of the component to get.
  *
  * @return The instance of the given component.
  */
  public getInstanceOfComponent (component : number) : any {
    return this._components.getInstanceOfComponent(component)
  }

  public getInstance (entity : number, handler : TypeHandler) : any {
    return this.getInstanceOfComponent(this.getComponent(entity, handler))
  }

  public getEntityOfInstance (instance : any) : number {
    return this.getEntityOfComponent(this.getComponentOfInstance(instance))
  }

  /**
  * Return the identifier of a component instance.
  *
  * @param instance - A component instance.
  *
  * @return The identifier of the given component instance.
  */
  public getComponentOfInstance (instance : any) : number {
    return this._components.getComponentOfInstance(instance)
  }

  /**
  * Return true if the given instance is a component instance.
  *
  * @param instance - An instance to check.
  *
  * @return True if the given instance is a component instance.
  */
  public isComponentInstance (instance : any) : boolean {
    return this._components.getComponentOfInstance(instance) != null
  }

  /**
  * Return the identifier of a component that belongs to an entity and that is of a given type.
  *
  * @param entity - An entity to search for.
  * @param type - A type to search for.
  *
  * @return The identifier of the component that belongs to the given entity and that is of the given type.
  */
  public getComponent (entity : number, handler : TypeHandler) : number {
    return this._componentsIndex.get(
      entity,
      this._types.getTypeOfHandler(handler)
    )
  }

  /**
  * Return true if the given entity has a component of the given type.
  *
  * @param entity - Identifier of the entity to search for.
  * @param type - Type of the component to search for.
  *
  * @return True if the given component exists into this collection.
  */
  public hasComponent (entity : number, handler : TypeHandler) : boolean {
    return this._componentsIndex.has(
      entity,
      this._types.getTypeOfHandler(handler)
    )
  }

  /**
  * Delete an existing component.
  *
  * @param entity - Entity that have the component to delete.
  * @param handler - Type of component to delete.
  */
  public deleteComponent (entity : number, handler : TypeHandler) : void {
    if (!this._entities.has(entity)) throw new Error([
      'Unable to delete component of type ', handler, ' from entity #',
      entity, ' because the given entity does not exists into this entity-',
      'component-system.'
    ].join(''))

    if(!this._types.hasHandler(handler)) throw new Error([
      'Unable to delete component of type ', handler, ' from entity #',
      entity, ' because the handler is not attached to a type of this entity-',
      'component-system.'
    ].join(''))

    const type : number = this._types.getTypeOfHandler(handler)

    if(!this._componentsIndex.has(entity, type)) throw new Error([
      'Unable to delete component of type ', handler, ' from entity #',
      entity, ' because the given component does not exists in this entity-',
      'component-system.'
    ].join(''))

    const component : number = this._componentsIndex.get(entity, type)

    this.willDeleteComponent(component)
    this._componentsIndex.delete(entity, type)
    this._components.delete(component)
    this.didDeleteComponent(component, entity, type)
  }

  /**
  * Remove a component from this entity-component-system by using its identifier.
  *
  * @param component - Identifier of the component to remove.
  */
  public deleteComponentByIdentifier (component : number) : void {
    if (!this._components.has(component)) throw new Error([
      'Unable to delete the component #', component, ' because the given ',
      'component does not exists into this entity-component-system.'
    ].join(''))

    const entity : number = this._components.getEntityOfComponent(component)
    const type : number = this._components.getTypeOfComponent(component)

    this.willDeleteComponent(component)
    this._componentsIndex.delete(entity, type)
    this._components.delete(component)
    this.didDeleteComponent(component, entity, type)
  }

  /**
  * Remove all components of this entity-component-system.
  */
  public clearComponents () {
    const components : Collection<number> = this._components

    while (components.size > 0) {
      this.deleteComponentByIdentifier(components.get(0))
    }
  }

  /**
  * Called when this entity-component-system will add a component.
  *
  * @param component - The component that will be added.
  * @param entity - The entity that will get the given component.
  * @param type - The type of the component to add.
  */
  private willAddComponent (
    component : number, entity : number, type : number
  ) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillAddComponent(component, entity, type)
    }
  }

  /**
  * Called when this entity-component-system did add a component.
  *
  * @param component - The component that was added.
  */
  private didAddComponent (component : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidAddComponent(component)
    }
  }

  /**
  * Called when this entity-component-system will delete a component.
  *
  * @param component - The component that will be deleted.
  */
  private willDeleteComponent (component : number) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillDeleteComponent(component)
    }
  }

  /**
  * Called when this entity-component-system did delete a component.
  *
  * @param component - The component that will be deleted.
  * @param entity - The entity that will loose the given component.
  * @param type - The type of the component to delete.
  */
  private didDeleteComponent (
    component : number, entity : number, type : number
  ) : void {
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidDeleteComponent(component, entity, type)
    }
  }

  /**
  * Add a system to this entity-component-system.
  *
  * @param system - A system to add.
  */
  public addSystem (system : System) : void {
    if (this._systems.indexOf(system) >= 0) throw new Error([
      'Unable to add the system instance ', system, ' to this entity-component',
      '-system because the given system was already added to it.'
    ].join(''))

    this._systems.push(system)
    system.attach(this)
    system.initialize()
  }

  /**
  * Require a system of a given type.
  *
  * @param type - The type of system to return.
  *
  * @return The first system of the given type or fail.
  */
  public requireSystem (type : any) : System {
    const result : System = this.firstSystem(type)

    if (result == null) {
      throw new Error([
        'No system of type ', type.name, ' found in this entity-component ',
        'system.'
      ].join(''))
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
  public firstSystem (type : any) : System {
    const systems : Array<System> = this._systems

    for (let index = 0, size = systems.length; index < size; ++index) {
      const system : System = this._systems[index]

      if (system instanceof type) {
        return system
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

    if (index < 0) throw new Error([
      'Unable to delete the system instance ', system, ' from this entity-component',
      '-system because the given system does not exists.'
    ].join(''))

    system.destroy()
    this._systems.splice(index, 1)
    system.detach()
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
    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerWillUpdate(delta)
    }

    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].update(delta)
    }

    for (let index = 0, size = this._systems.length; index < size; ++index) {
      this._systems[index].managerDidUpdate(delta)
    }
  }

  /**
  * Remove all systems from this entity-component-system.
  */
  public clearSystems () : void {
    const systems : Array<System> = this._systems

    while (systems.length > 0) {
      const system : System = systems[systems.length - 1]
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
