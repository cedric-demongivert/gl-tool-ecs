import { EntityComponentSystem } from './EntityComponentSystem'
import { Entity } from './Entity'
import { Tag } from './Tag'
import { Component } from './Component'
import { ComponentType } from './ComponentType'

/**
* An engine system.
*/
export class System {
  private _manager : EntityComponentSystem

  /**
  * Create a new empty system.
  */
  public constructor () {
    this._manager = null
  }

  /**
  * Return the manager of this system.
  *
  * @return The manager of this system.
  */
  public get manager () : EntityComponentSystem {
    return this._manager
  }

  /**
  * Called when the system is attached to a manager in order to initialize it.
  */
  public initialize () : void { }

  /**
  * Called when the parent entity manager will add an entity.
  *
  * @param entity - The identifier of the entity to add.
  */
  public managerWillAddEntity (entity : Entity) : void { }

  /**
  * Called when the parent entity manager did add an entity.
  *
  * @param entity - The identifier of the added entity.
  */
  public managerDidAddEntity (entity : Entity) : void { }

  /**
  * Called when the parent manager will delete an entity.
  *
  * @param entity - The identifier of the entity that will be deleted.
  */
  public managerWillDeleteEntity (entity : Entity) : void { }

  /**
  * Called when the parent manager did delete an entity.
  *
  * @param entity - The identifier of the entity that was deleted.
  */
  public managerDidDeleteEntity (entity : Entity) : void { }

  /**
  * Called when the parent entity manager will add a tag.
  *
  * @param tag - The identifier of the tag to add.
  */
  public managerWillAddTag (tag : Tag) : void { }

  /**
  * Called when the parent entity manager did add a tag.
  *
  * @param tag - The identifier of the added tag.
  */
  public managerDidAddTag (tag : Tag) : void { }

  /**
  * Called when the parent entity manager will delete a tag.
  *
  * @param tag - The identifier of the tag to delete.
  */
  public managerWillDeleteTag (tag : Tag) : void { }

  /**
  * Called when the parent entity manager did delete a tag.
  *
  * @param tag - The identifier of the deleted tag.
  */
  public managerDidDeleteTag (tag : Tag) : void { }

  /**
  * Called when the parent entity manager will attach a tag to an entity.
  *
  * @param tag - The identifier of the tag to attach.
  * @param entity - The identifier of the targeted entity.
  */
  public managerWillAttachTagToEntity (tag : Tag, entity : Entity) : void {}

  /**
  * Called when the parent entity manager did attach a tag to an entity.
  *
  * @param tag - The identifier of the attached tag.
  * @param entity - The identifier of the targeted entity.
  */
  public managerDidAttachTagToEntity (tag : Tag, entity : Entity) : void {}

  /**
  * Called when the parent entity manager will detach a tag from an entity.
  *
  * @param tag - The identifier of the tag to detach.
  * @param entity - The identifier of the targeted entity.
  */
  public managerWillDetachTagFromEntity (tag : Tag, entity : Entity) : void {}

  /**
  * Called when the parent entity manager did detach a tag from an entity.
  *
  * @param tag - The identifier of the detached tag.
  * @param entity - The identifier of the targeted entity.
  */
  public managerDidDetachTagFromEntity (tag : Tag, entity : Entity) : void {}

  /**
  * Called when the parent manager will add a type.
  *
  * @param type - The type that will be added.
  */
  public managerWillAddType (type : ComponentType<any>) : void { }

  /**
  * Called when the parent manager did add a type.
  *
  * @param type - The type that was added.
  */
  public managerDidAddType (type : ComponentType<any>) : void { }

  /**
  * Called when the parent manager will delete a type.
  *
  * @param type - The type that will be deleted.
  */
  public managerWillDeleteType (type : ComponentType<any>) : void { }

  /**
  * Called when the parent manager did delete a type.
  *
  * @param type - The type that was deleted.
  */
  public managerDidDeleteType (type : ComponentType<any>) : void { }

  /**
  * Called when the parent manager will add a component.
  *
  * @param component - The component that will be added.
  * @param entity - The entity that will get the given component.
  * @param type - The type of the component to add.
  */
  public managerWillAddComponent (entity : Entity, type : ComponentType<any>) : void { }

  /**
  * Called when the parent manager did add a component.
  *
  * @param component - The component that was added.
  */
  public managerDidAddComponent (component : Component<any>) : void { }

  /**
  * Called when the parent manager will delete a component.
  *
  * @param component - The component that will be deleted.
  */
  public managerWillDeleteComponent (component : Component<any>) : void { }

  /**
  * Called when the parent manager did delete a component.
  *
  * @param component - The component that was deleted.
  */
  public managerDidDeleteComponent (component : Component<any>) : void { }

  /**
  * Called when the manager will update all its systems.
  *
  * @param delta - The number of seconds between the last update and the current update.
  */
  public managerWillUpdate (delta : number) : void { }

  /**
  * Update this system.
  *
  * @param delta - The number of seconds between the last update and the current update.
  */
  public update (delta : number) : void { }

  /**
  * Called when the manager did update all its systems.
  *
  * @param delta - The number of seconds between the last update and the current update.
  */
  public managerDidUpdate (delta : number) : void { }

  /**
  * Called when this system will be detached of its manager in order to release
  * all of its ressources.
  */
  public destroy () : void { }

  /**
  * Attach this system to a manager.
  *
  * @param manager - The future parent manager.
  */
  public attach (manager : EntityComponentSystem) : void {
    if (this._manager !== manager) {
      if (this._manager) this.detach()

      this._manager = manager
      if (!this._manager.hasSystem(this)) {
        this._manager.addSystem(this)
      }
    }
  }

  /**
  * Detach this system of its manager.
  */
  public detach () : void {
    if (this._manager != null) {
      if (this._manager.hasSystem(this)) {
        const oldManager = this._manager
        this._manager = null
        if (oldManager.hasSystem(this)) {
          oldManager.deleteSystem(this)
        }
      }
    }
  }
}
