import { Collection } from './Collection'

/**
* A readonly view over an array of values.
*/
export class ArrayView<T> implements Collection<T> {
  /**
  * Wrap an existing array.
  *
  * @param array - An array to wrap in a view.
  *
  * @return A view over the given collection.
  */
  public static wrap <T> (array : Array<T>) : ArrayView<T> {
    if (array instanceof ArrayView) {
      return array
    } else {
      return new ArrayView<T>(array)
    }
  }

  _array : Array<T>

  /**
  * Create a new view over an existing array.
  *
  * @param array - An array to wrap.
  */
  public constructor (array : Array<T>) {
    this._array = array
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._array.length
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return true
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : T {
    return this._array[index]
  }

  /**
  * @see Collection.has
  */
  public has (element : T) : boolean {
    return this._array.indexOf(element) >= 0
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ArrayView) {
      if (other.size !== this._array.length) return false

      for (let index = 0, size = other.size; index < size; ++index  ) {
        if (other.get(index) !== this._array[index]) return false
      }

      return true
    }

    return false
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () {
    yield * this._array
  }
}
