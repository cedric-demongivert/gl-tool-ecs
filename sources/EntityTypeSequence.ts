import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { ComponentType } from './ComponentType'
import { TypeMapping } from './TypeMapping'
import { EntityTypeSequenceIterator } from './EntityTypeSequenceIterator'

export class EntityTypeSequence implements Sequence<ComponentType<any>> {
  private _mapping : TypeMapping
  private _source  : Sequence<number>

  public constructor (source : Sequence<number>, mapping : TypeMapping) {
    this._source  = source
    this._mapping = mapping
  }

  public get size () : number {
    return this._source.size
  }

  public get (index : number): ComponentType<any> {
    return this._mapping.get(this._source.get(index))
  }

  public get last () : ComponentType<any> {
    return this.size <= 0 ? undefined : this.get(this.size - 1)
  }

  public get lastIndex () : number {
    return this.size <= 0 ? 0 : this.size - 1
  }

  public get first () : ComponentType<any> {
    return this.size <= 0 ? undefined : this.get(0)
  }

  public get firstIndex () : number {
    return 0
  }

  public has (element: ComponentType<any>) : boolean {
    return this._source.has(this._mapping.get(element))
  }

  public indexOf (element: ComponentType<any>) : number {
    throw this._source.indexOf(this._mapping.get(element))
  }

  public iterator () : EntityTypeSequenceIterator {
    const result : EntityTypeSequenceIterator = new EntityTypeSequenceIterator()

    result.sequence = this

    return result
  }

  public view () : Sequence<ComponentType<any>> {
    return this
  }

  public clone () : EntityTypeSequence {
    return new EntityTypeSequence(this._source, this._mapping)
  }

  public * [Symbol.iterator] (): Iterator<ComponentType<any>> {
    for (let index = 0, size = this._source.size; index < size; ++index) {
      yield this._mapping.get(this._source.get(index))
    }
  }

  public equals (other: any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof EntityTypeSequence) {
      return other._mapping === this._mapping &&
             other._source === this._source
    }

    return false
  }
}
