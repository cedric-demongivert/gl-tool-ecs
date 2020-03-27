import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { ComponentRepository } from './ComponentRepository'
import { Component } from './Component'
import { ComponentRepositorySequenceIterator } from './ComponentRepositorySequenceIterator'

export class ComponentRepositorySequence implements Sequence<Component> {
  private repository : ComponentRepository

  public constructor (repository : ComponentRepository) {
    this.repository = repository
  }

  public get size () : number {
    return this.repository.size
  }

  public get (index : number) : Component {
    return this.repository.getNth(index)
  }

  public get last () : Component {
    return this.repository.size <= 0 ? undefined : this.repository.getNth(this.repository.size - 1)
  }

  public get lastIndex () : number {
    return this.repository.size <= 0 ? 0 : this.repository.size - 1
  }

  public get first () : Component {
    return this.repository.size <= 0 ? undefined : this.repository.getNth(0)
  }

  public get firstIndex () : number {
    return 0
  }

  public has (element: Component) : boolean {
    return this.repository.has(element)
  }

  public indexOf (element: Component) : number {
    throw this.repository.indexOf(element)
  }

  public iterator () : ComponentRepositorySequenceIterator {
    const result : ComponentRepositorySequenceIterator = new ComponentRepositorySequenceIterator()

    result.sequence = this

    return result
  }

  public view () : Sequence<Component> {
    return this
  }

  public clone () : ComponentRepositorySequence {
    return new ComponentRepositorySequence(this.repository)
  }

  public * [Symbol.iterator] (): Iterator<Component> {
    for (let index = 0, size = this.repository.size; index < size; ++index) {
      yield this.repository.getNth(index)
    }
  }

  public equals (other: any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof ComponentRepositorySequence) {
      return other.repository === this.repository
    }

    return false
  }
}
