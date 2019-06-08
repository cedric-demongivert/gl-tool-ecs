import { Collection } from './Collection'

export class Cursor {
  private _collection : Collection<number>
  private _next : number

  /**
  * Create a new cursor.
  */
  public constructor (collection : Collection<number>) {
    this._next = 0
    this._collection = collection
  }

  /**
  * @return The cursored collection.
  */
  public get collection () : Collection<number> {
    return this._collection
  }

  /**
  * Return the next available element.
  *
  * @return The next available element.
  */
  public next () : number {
    while (this._collection.has(this._next)) this._next += 1
    return this._next
  }

  /**
  * Move the cursor to a given location and find the next available element.
  *
  * @param value - The location where the cursor must move.
  */
  public move (value : number) : void {
    this._next = value
  }

  /**
  * Return true if both instance are equals.
  *
  * @param other - Another object instance to compare to this one.
  *
  * @return True if both instance are equals.
  */
  public equals (other : any) : boolean {
    if (other === this) return true

    return false
  }
}
