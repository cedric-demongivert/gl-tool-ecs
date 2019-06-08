import { StaticSet } from './StaticSet'

export class ArraySet<T> implements StaticSet<T> {
  /**
  * Return a copy of a given array set.
  *
  * @param toCopy - An array set to copy.
  */
  static copy <T> (toCopy : ArraySet<T>) : ArraySet<T> {
    const result : ArraySet<T> = new ArraySet<T>(toCopy.capacity)

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.add(toCopy.get(index))
    }

    return result
  }

  private _elements: Array<T>
  private _size: number

  /**
  * Create a new empty array set with an initial capacity.
  *
  * @param capacity - Initial storing capacity of the array set.
  */
  public constructor (capacity : number = 16) {
    this._elements = new Array<T>(capacity)
    this._size = 0
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
    return this._size
  }

  /**
  * @see StaticCollection.capacity
  */
  public get capacity () : number {
    return this._elements.length
  }

  /**
  * @see Collection.has
  */
  public has (element : T) : boolean {
    for (let index = 0, size = this._size; index < size; ++index) {
      if (this._elements[index] === element) {
        return true
      }
    }

    return false
  }

  /**
  * @see MutableCollection.add
  */
  public add (element : T) : void {
    for (let index = 0, size = this._size; index < size; ++index) {
      if (this._elements[index] === element) {
        return
      }
    }

    this._elements[this._size] = element
    this._size += 1
  }

  /**
  * @see MutableCollection.delete
  */
  public delete (element : T) : void {
    for (let index = 0, size = this._size; index < size; ++index) {
      if (this._elements[index] === element) {
        this._elements[index] = this._elements[this._size - 1]
        this._size -= 1
        return
      }
    }
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : T {
    return this._elements[index]
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    this._elements.length = capacity
    this._size = this._size < capacity ? this._size : capacity
  }

  /**
  * @see StaticCollection.fit
  */
  public fit () : void {
    this._elements.length = this._size
  }

  /**
  * @see MutableCollection.clear
  */
  public clear () : void {
    this._size = 0
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () : Iterator<T> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._elements[index]
    }
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isSet) {
      if (other.size !== this._size) return false

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this.has(other.get(index))) return false
      }

      return true
    }

    return false
  }
}
