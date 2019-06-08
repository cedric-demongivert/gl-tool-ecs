import { StaticSet } from './StaticSet'

export class Uint16Set implements StaticSet<number> {
  /**
  * Maximum number capacity of a Uint16Set.
  */
  static MAX_CAPACITY : number = 0xffff + 1

  /**
  * Return a copy of a given sparse set.
  *
  * @param toCopy - A sparse set to copy.
  */
  static copy (toCopy : Uint16Set) : Uint16Set {
    const result : Uint16Set = new Uint16Set(toCopy.capacity)

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.add(toCopy.get(index))
    }

    return result
  }

  private _sparse: Uint16Array
  private _dense: Uint16Array
  private _size: number

  /**
  * Create a new empty sparse set with an initial capacity.
  *
  * @param capacity - Initial storing capacity of the sparse set.
  */
  public constructor (capacity : number = 16) {
    this._sparse = new Uint16Array(capacity)
    this._dense = new Uint16Array(capacity)
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
    return this._dense.length
  }

  /**
  * @see Collection.has
  */
  public has (element : number) : boolean {
    const index : number = this._sparse[element]
    return index < this._size && this._dense[index] === element
  }

  /**
  * @see MutableCollection.add
  */
  public add (element : number) : void {
    const index : number = this._sparse[element]

    if (index >= this._size || this._dense[index] !== element) {
      this._sparse[element] = this._size
      this._dense[this._size] = element
      this._size += 1
    }
  }

  /**
  * @see MutableCollection.delete
  */
  public delete (element : number) : void {
    const index : number = this._sparse[element]

    if (index < this._size && this._dense[index] === element) {
      const last : number = this._dense[this._size - 1]
      this._dense[index] = last
      this._sparse[last] = index
      this._size -= 1
    }
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : number {
    return this._dense[index]
  }

  /**
  * @see StaticCollection.reallocate
  */
  public reallocate (capacity : number) : void {
    const oldDense : Uint16Array = this._dense
    const oldSparse : Uint16Array = this._sparse
    const oldSize : number = this._size

    this._dense = new Uint16Array(capacity)
    this._sparse = new Uint16Array(capacity)
    this._size = 0

    for (let index = 0; index < oldSize; ++index) {
      if (oldDense[index] < capacity) {
        this._sparse[oldDense[index]] = this._size
        this._dense[this._size] = oldDense[index]
        this._size += 1
      }
    }
  }

  /**
  * @see StaticCollection.fit
  */
  public fit () : void {
    const max : number = this.max()
    const oldDense : Uint16Array = this._dense
    const oldSparse : Uint16Array = this._sparse

    if (max == null) {
      this._dense = new Uint16Array(0)
      this._sparse = new Uint16Array(0)
    } else {
      this._dense = new Uint16Array(max + 1)
      this._sparse = new Uint16Array(max + 1)

      this._dense.set(oldDense.subarray(0, max + 1))
      this._sparse.set(oldSparse.subarray(0, max + 1))
    }
  }

  /**
  * Return the maximum element of this set.
  *
  * @return The maximum element of this set.
  */
  public max () : number {
    if (this._size <= 0) return undefined

    let result : number = this._dense[0]

    for (let index = 1, length = this._size; index < length; ++index) {
      result = this._dense[index] > result ? this._dense[index] : result
    }

    return result
  }

  /**
  * Return the minimum element of this set.
  *
  * @return The minimum element of this set.
  */
  public min () : number {
    if (this._size <= 0) return undefined

    let result : number = this._dense[0]

    for (let index = 1, length = this._size; index < length; ++index) {
      result = this._dense[index] < result ? this._dense[index] : result
    }

    return result
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
  public * [Symbol.iterator] () : Iterator<number> {
    for (let index = 0, length = this._size; index < length; ++index) {
      yield this._dense[index]
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
