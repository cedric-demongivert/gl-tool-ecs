import { StaticSet } from './StaticSet'
import { BufferedNumberSet } from './BufferedNumberSet'

export class OffsetedNumberSet implements StaticSet<number> {
  /**
  * Return a copy of a given sparse set.
  *
  * @param toCopy - A sparse set to copy.
  */
  static copy (toCopy : OffsetedNumberSet) : OffsetedNumberSet {
    const result : OffsetedNumberSet = new OffsetedNumberSet(toCopy.capacity)
    result.offset = toCopy.offset
    result.spacing = toCopy.spacing

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.add(toCopy.get(index))
    }

    return result
  }

  private _set : StaticSet<number>
  private _offset : number
  private _spacing : number

  /**
  * Create a new empty sparse set with an initial capacity.
  *
  * @param capacity - Initial storing capacity of the sparse set.
  */
  public constructor (capacity : number = 16) {
    this._set = new BufferedNumberSet(capacity)
    this._offset = 0
    this._spacing = 1
  }

  /**
  * @return The number of elements between the element 0 and the first element
  * stored into this set.
  */
  public get offset () : number {
    return this._offset
  }

  /**
  * @return The number of elements between two elements stored into this set.
  */
  public get spacing () : number {
    return this._spacing
  }

  /**
  * Change the number of elements between the element 0 and the first element
  * stored into this set.
  *
  * @param offset - The new number of elements between the element 0 and the first element stored into this set.
  */
  public set offset (offset : number) {
    this._offset = offset
  }

  /**
  * Change the number of elements between two elements stored into this set.
  *
  * @param spacing - The new number of elements between two elements stored into this set.
  */
  public set spacing (spacing : number) {
    this._spacing = spacing
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see Set.isSet
  */
  public get isSet () : boolean {
    return true
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._set.size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._set.capacity
  }

  /**
  * @see Collection.has
  */
  public has (element : number) : boolean {
    const realigned : number = element - this._offset
    return realigned >= 0 &&
           realigned % this._spacing === 0 &&
           this._set.has(realigned / this._spacing)
  }

  /**
  * Return true if the underlying set contains the given element.
  *
  * @param element - An element to search for.
  *
  * @return True if the underlying set contains the given element.
  */
  public hasRaw (element : number) : boolean {
    return this._set.has(element)
  }

  /**
  * @see MutableCollection.add
  */
  public add (element : number) : void {
    const realigned : number = element - this._offset
    if (realigned >= 0 && realigned % this._spacing === 0) {
      this._set.add(realigned / this._spacing)
    }
  }

  /**
  * Add the given element to the underlying set.
  *
  * @param element - An element to add.
  */
  public addRaw (element : number) : void {
    this._set.add(element)
  }

  /**
  * @see MutableCollection.delete
  */
  public delete (element : number) : void {
    const realigned : number = (element - this._offset)
    if (realigned >= 0 && realigned % this._spacing === 0) {
      this._set.delete(realigned / this._spacing)
    }
  }

  /**
  * Delete the given element from the underlying set.
  *
  * @param element - An element to delete.
  */
  public deleteRaw (element : number) : void {
    this._set.delete(element)
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._set.get(index) * this._spacing + this._offset
  }

  /**
  * Return the nth element of the underlying set.
  *
  * @param index - The index of the element to return.
  *
  * @return The requested element.
  */
  public getRaw (index : number) : number {
    return this._set.get(index)
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    this._set.reallocate(capacity)
  }

  /**
  * @see StaticCollection.fit
  */
  public fit () : void {
    this._set.fit()
  }

  /**
  * @see MutableCollection.clear
  */
  public clear () : void {
    this._set.clear()
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<number> {
    for (let index = 0, length = this._set.size; index < length; ++index) {
      yield this._set.get(index) * this._spacing + this._offset
    }
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isSet) {
      if (other.size !== this._set.size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) {
          return false
        }
      }

      return true
    }

    return false
  }
}
