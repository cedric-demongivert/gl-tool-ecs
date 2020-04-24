import { CollectionIterator } from '@cedric-demongivert/gl-tool-collection'
import { BidirectionalIterator } from '@cedric-demongivert/gl-tool-collection'

import { Component } from './Component'
import { ComponentRepositorySequence } from './ComponentRepositorySequence'

export class ComponentRepositorySequenceIterator implements BidirectionalIterator<Component<any>> {
  /**
  *
  */
  public sequence : ComponentRepositorySequence

  /**
  * The location of the element described by this iterator in the parent pack.
  */
  public index : number

  /**
  * Instantiate a new random access iterator instance.
  */
  public constructor () {
    this.sequence = null
    this.index = 0
  }

  /**
  * @see Iterator.collection
  */
  public collection () : ComponentRepositorySequence {
    return this.sequence
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext () : boolean {
    return this.sequence && this.index < this.sequence.size
  }

  /**
  * @see ForwardIterator.next
  */
  public next () : void {
    this.index += 1
  }

  /**
  * @see ForwardIterator.forward
  */
  public forward (count : number) : void {
    this.index += count
  }

  /**
  * @see ForwardIterator.end
  */
  public end () : void {
    this.index = this.sequence ? this.sequence.size - 1 : 0
  }

  /**
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious () : boolean {
    return this.sequence && this.index > 0
  }

  /**
  * @see BackwardIterator.previous
  */
  public previous () : void {
    this.index -= 1
  }

  /**
  * @see BackwardIterator.backward
  */
  public backward (count : number) : void {
    this.index -= count
  }

  /**
  * @see BackwardIterator.start
  */
  public start () : void {
    this.index = 0
  }

  /**
  * @see Iterator.get
  */
  public get () : Component<any> {
    return this.sequence.get(this.index)
  }

  /**
  * @see Iterator.move
  */
  public move (iterator : CollectionIterator<Component<any>>) : void {
    if (iterator instanceof ComponentRepositorySequenceIterator) {
      this.sequence = iterator.sequence
      this.index = iterator.index
    } else {
      throw new Error(
        'Trying to move to a location described by an unsupported type of ' +
        'iterator'
      )
    }
  }

  /**
  * @see BidirectionalIterator.go
  */
  public go (index : number) : void {
    this.index = index
  }

  /**
  * Shallow-copy the given instance.
  *
  * @param toCopy
  */
  public copy (toCopy : ComponentRepositorySequenceIterator) : void {
    this.sequence = toCopy.sequence
    this.index = toCopy.index
  }

  /**
  * @see Iterator.clone
  */
  public clone () : ComponentRepositorySequenceIterator {
    const copy : ComponentRepositorySequenceIterator = new ComponentRepositorySequenceIterator()

    copy.copy(this)

    return copy
  }

  /**
  * @see Iterator.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ComponentRepositorySequenceIterator) {
      return other.sequence === this.sequence &&
             other.index === this.index
    }

    return false
  }
}

export namespace ComponentRepositorySequenceIterator {
  /**
  * Return a shallow copy of the given iterator.
  *
  * A shallow-copy *b* of an iterator *a* is an instance that follow both
  * properties :
  *  - b !== a
  *  - b.equals(a)
  *
  * @param toCopy - An iterator to copy.
  *
  * @return A shallow copy of the given iterator.
  */
  export function copy (toCopy : ComponentRepositorySequenceIterator) : ComponentRepositorySequenceIterator {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
