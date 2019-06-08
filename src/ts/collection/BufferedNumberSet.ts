import { StaticSet } from './StaticSet'
import { Uint8Set } from './Uint8Set'
import { Uint16Set } from './Uint16Set'
import { Uint32Set } from './Uint32Set'

export class BufferedNumberSet implements StaticSet<number> {
  /**
  * Return a copy of a given sparse set.
  *
  * @param toCopy - A sparse set to copy.
  */
  static copy (toCopy : BufferedNumberSet) : BufferedNumberSet {
    const result : BufferedNumberSet = new BufferedNumberSet(toCopy.capacity)

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.add(toCopy.get(index))
    }

    return result
  }

  private _set : StaticSet<number>

  /**
  * Create a new empty sparse set with an initial capacity.
  *
  * @param capacity - Initial storing capacity of the sparse set.
  */
  public constructor (capacity : number = 16) {
    this._set = this.allocate(capacity)
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
    return this._set.has(element)
  }

  /**
  * @see MutableCollection.add
  */
  public add (element : number) : void {
    this._set.add(element)
  }

  /**
  * @see MutableCollection.delete
  */
  public delete (element : number) : void {
    this._set.delete(element)
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._set.get(index)
  }

  /**
  * Allocate an appropriate buffered set for a given capacity.
  *
  * @param capacity - A capacity to allocate.
  *
  * @return An appropriate buffered set for the given capacity.
  */
  private allocate (capacity : number) : StaticSet<number> {
    if (capacity <= Uint8Set.MAX_CAPACITY) {
      return new Uint8Set(capacity)
    } else if (capacity <= Uint16Set.MAX_CAPACITY) {
      return new Uint16Set(capacity)
    } else {
      return new Uint32Set(capacity)
    }
  }

  /**
  * Return true if the given capacity needs a complete reallocation.
  *
  * @param capacity - A capacity.
  *
  * @return True if the given capacity needs a complete reallocation.
  */
  private isOfDifferentImplementation (capacity : number) : boolean {
    return (
      this._set.capacity <= Uint8Set.MAX_CAPACITY &&
      capacity > Uint8Set.MAX_CAPACITY
    ) || (
      this._set.capacity <= Uint16Set.MAX_CAPACITY && (
        capacity > Uint16Set.MAX_CAPACITY || capacity <= Uint8Set.MAX_CAPACITY
      )
    ) || capacity <= Uint16Set.MAX_CAPACITY;
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    if (this.isOfDifferentImplementation(capacity)) {
      const oldSet : StaticSet<number> = this._set
      this._set = this.allocate(capacity)

      for (let index = 0, size = oldSet.size; index < size; ++index) {
        const value : number = oldSet.get(index)
        if (value < capacity) { this._set.add(value) }
      }
    } else {
      this._set.reallocate(capacity)
    }
  }

  /**
  * @see StaticCollection.fit
  */
  public fit () : void {
    const max : number = this.max()

    if (this.isOfDifferentImplementation(max + 1)) {
      this.reallocate(max + 1)
    } else {
      this._set.reallocate(max + 1)
    }
  }

  /**
  * Return the maximum element of this set.
  *
  * @return The maximum element of this set.
  */
  public max () : number {
    if (this._set.size <= 0) return undefined

    let result : number = this._set.get(0)

    for (let index = 1, length = this._set.size; index < length; ++index) {
      result = this._set.get(index) > result ? this._set.get(index) : result
    }

    return result
  }

  /**
  * Return the minimum element of this set.
  *
  * @return The minimum element of this set.
  */
  public min () : number {
    if (this._set.size <= 0) return undefined

    let result : number = this._set.get(0)

    for (let index = 1, length = this._set.size; index < length; ++index) {
      result = this._set.get(index) < result ? this._set.get(index) : result
    }

    return result
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
    yield * this._set
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
        if (!this._set.has(other.get(index))) return false
      }

      return true
    }

    return false
  }
}
