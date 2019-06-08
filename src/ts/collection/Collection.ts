/**
* A collection of values.
*/
export interface Collection<T> extends Iterable<T> {
  /**
  * @return True if this instance is a collection.
  */
  readonly isCollection : boolean

  /**
  * @return The number of elements stored into this collection.
  */
  readonly size : number

  /**
  * Return an element of the collection by using an index.
  *
  * @param index - Index of the element to return.
  *
  * @return The element at the given index.
  */
  get (index : number) : T

  /**
  * Return true if this collection contains the given element.
  *
  * @param element - An element to search for.
  *
  * @return True if the given element exists into this collection.
  */
  has (element : T) : boolean

  /**
  * Return true if both instances are equals.
  *
  * @param other - Object instance to compare to this one.
  */
  equals (other : any) : boolean
}
