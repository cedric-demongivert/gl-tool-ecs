import { Cursor, BufferedNumberSet } from '../collection'

import { TypeHandler } from './TypeHandler'
import { TypeRepository } from './TypeRepository'

export class StaticTypeRepository implements TypeRepository
{
  /**
  * Create a new empty static type repository with a given capacity.
  *
  * @param [capacity = 128] - Initial capacity of this repository.
  *
  * @return A type repository with the given capacity.
  */
  public static create (capacity = 128) : StaticTypeRepository {
    return new StaticTypeRepository(capacity)
  }

  /**
  * Copy an existing static type repository instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A copy of the given instance.
  */
  public static copy (toCopy : StaticTypeRepository) : StaticTypeRepository {
    const copy : StaticTypeRepository = new StaticTypeRepository(
      toCopy.capacity
    )

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      copy.addTypeWithHandler(
        toCopy.get(index),
        toCopy.getHandlerOfType(toCopy.get(index))
      )
    }

    return copy
  }

  private _cursor : Cursor
  private _types : BufferedNumberSet
  private _handlers : TypeHandler[]
  private _symbol : any

  /**
  * Create a new empty static type repository with a given capacity.
  *
  * @param [capacity = 128] - Initial capacity of this repository.
  */
  public constructor (capacity : number = 128) {
    this._types = new BufferedNumberSet(capacity)
    this._cursor = new Cursor(this._types)
    this._handlers = new Array<TypeHandler>(capacity)
    this._symbol = Symbol()
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._types.capacity
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._types.size
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see TypeRepository.isTypeRepository
  */
  public get isTypeRepository () : boolean {
    return true
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    for (let index = 0, size = this._types.size; index < size; ++index) {
      if (this._types.get(index) >= capacity) {
        this.delete(this._types.get(index))
      }
    }

    this._types.reallocate(capacity)
    this._handlers.length = capacity
  }

  /**
  * @see StaticCollection.fit
  */
  public fit () : void {
    this._types.fit()
    this._handlers.length = this._types.capacity
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._types.get(index)
  }

  public next () : number {
    return this._cursor.next()
  }

  /**
  * Create a new type by using an handler.
  *
  * @param handler - The handler to assign to the type to create.
  *
  * @return The created type.
  */
  public create (handler : TypeHandler) : number {
    if (handler[this._symbol] == null) {
      const type : number = this._cursor.next()
      this._types.add(type)
      this._handlers[type] = handler
      handler[this._symbol] = type
      return type
    } else {
      return handler[this._symbol]
    }
  }

  /**
  * Remove a type from this repository.
  *
  * @param type - A type to delete.
  */
  public delete (type : number) : void {
    this._types.delete(type)
    if (this._cursor.next() > type) this._cursor.move(type)

    const handler : TypeHandler = this._handlers[type]
    this._handlers[type] = null

    if (handler) delete handler[this._symbol]
  }

  /**
  * Register a fully custom type.
  *
  * @param handler - Type handler to register.
  * @param type - Type identifier.
  */
  public addHandlerAsType (handler : TypeHandler, type : number) : void {
    if (handler[this._symbol]) this.delete(handler[this._symbol])
    if (this._types.has(type)) this.delete(type)

    this._handlers[type] = handler
    handler[this._symbol] = type
    this._types.add(type)
  }

  /**
  * Alias of addHandlerAsType.
  */
  public addTypeWithHandler (type : number, handler : TypeHandler) : void {
    this.addHandlerAsType(handler, type)
  }

  /**
  * @see Collection.has
  */
  public has (type : number) : boolean {
    return this._types.has(type)
  }

  /**
  * @see TypeRepository.hasHandler
  */
  public hasHandler (handler : TypeHandler) : boolean {
    return handler[this._symbol] != null
  }

  /**
  * @see TypeRepository.getHandlerOfType
  */
  public getHandlerOfType (type : number) : TypeHandler {
    return this._handlers[type]
  }

  /**
  * @see TypeRepository.getTypeOfHandler
  */
  public getTypeOfHandler (handler : TypeHandler) : number {
    return handler[this._symbol]
  }

  /**
  * @see Collection.clear
  */
  public clear () : void {
    for (let index = 0, length = this._types.size; index < length; ++index) {
      const type = this._types.get(index)
      delete this._handlers[type][this._symbol]
      this._handlers[type] = null
    }

    this._types.clear()
    this._cursor.move(0)
  }

  /**
  * @see TypeRepository.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isTypeRepository) {
      if (other.size !== this._types.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        const type : number = other.get(index)
        if (
          !this._types.has(type) ||
          this._handlers[type] !== other.getHandlerOfType(type)
        ) return false
      }

      return true
    }

    return false
  }

  /**
  * @see TypeRepository.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
    yield * this._types
  }
}
