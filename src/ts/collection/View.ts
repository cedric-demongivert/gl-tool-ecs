import { Collection } from './Collection'

/**
* A readonly view over a given collection of values.
*/
export class View<T> implements Collection<T> {
  /**
  * Wrap an existing collection.
  *
  * @param collection - A collection to wrap in a view.
  *
  * @return A view over the given collection.
  */
  public static wrap <T> (collection : Collection<T>) : View<T> {
    if (collection instanceof View) {
      return collection
    } else {
      return new View<T>(collection)
    }
  }

  _collection : Collection<T>

  /**
  * Create a new view over an existing collection.
  *
  * @param collection - A collection to wrap.
  */
  public constructor (collection : Collection<T>) {
    this._collection = collection
  }

  /**
  * @see Collection.size
  */
  public get size () : number {
    return this._collection.size
  }

  /**
  * @see Collection.isCollection
  */
  public get isCollection () : boolean {
    return this._collection.isCollection
  }

  /**
  * @see Collection.get
  */
  public get (index : number) : T {
    return this._collection.get(index)
  }

  /**
  * @see Collection.has
  */
  public has (element : T) : boolean {
    return this._collection.has(element)
  }

  /**
  * @see Collection.equals
  */
  public equals (other : any) : boolean {
    return this._collection.equals(other)
  }

  /**
  * @see Collection.iterator
  */
  public * [Symbol.iterator] () {
    yield * this._collection
  }
}
