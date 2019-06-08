import { Collection } from './Collection'

export interface Set<T> extends Collection<T> {
  /**
  * @return True if this collection is a set.
  */
  readonly isSet : boolean

  /**
  * Add a new element to the collection.
  *
  * @param value - The value to add to the collection.
  */
  add (value : T) : void

  /**
  * Remove an element from the collection.
  *
  * @param value - The value to remove from the collection.
  */
  delete (value : T) : void

  /**
  * Empty the collection.
  */
  clear () : void
}
