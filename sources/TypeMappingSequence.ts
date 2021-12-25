import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { TypeMapping } from './TypeMapping'
import { ComponentType } from './ComponentType'
import { TypeMappingSequenceIterator } from './TypeMappingSequenceIterator'

/**
 * 
 */
export class TypeMappingSequence implements Sequence<ComponentType<any>> {
  /**
   * 
   */
  private mapping: TypeMapping

  /**
   * 
   */
  public constructor(mapping: TypeMapping) {
    this.mapping = mapping
  }

  /**
   * 
   */
  public get size(): number {
    return this.mapping.size
  }

  /**
   * 
   */
  public get(index: number): ComponentType<any> {
    return this.mapping.getNth(index)
  }

  /**
   * 
   */
  public get last(): ComponentType<any> {
    return this.mapping.size <= 0 ? undefined : this.mapping.getNth(this.mapping.size - 1)
  }

  /**
   * 
   */
  public get lastIndex(): number {
    return this.mapping.size <= 0 ? 0 : this.mapping.size - 1
  }

  /**
   * 
   */
  public get first(): ComponentType<any> {
    return this.mapping.size <= 0 ? undefined : this.mapping.getNth(0)
  }

  /**
   * 
   */
  public get firstIndex(): number {
    return 0
  }

  /**
   * 
   */
  public has(element: ComponentType<any>): boolean {
    return this.mapping.has(element)
  }

  /**
   * 
   */
  public hasInSubsequence(element: ComponentType<any>, offset: number, size: number): boolean {
    return this.mapping.hasInSubsequence(element, offset, size)
  }

  /**
   * 
   */
  public indexOf(element: ComponentType<any>): number {
    return this.mapping.indexOf(element)
  }

  /**
   * 
   */
  public indexOfInSubsequence(element: ComponentType<any>, offset: number, size: number): number {
    return this.mapping.indexOfInSubsequence(element, offset, size)
  }

  /**
   * 
   */
  public iterator(): TypeMappingSequenceIterator {
    const result: TypeMappingSequenceIterator = new TypeMappingSequenceIterator()

    result.sequence = this

    return result
  }

  /**
   * 
   */
  public view(): Sequence<ComponentType<any>> {
    return this
  }

  /**
   * 
   */
  public clone(): TypeMappingSequence {
    return new TypeMappingSequence(this.mapping)
  }

  /**
   * 
   */
  public *[Symbol.iterator](): Iterator<ComponentType<any>> {
    for (let index = 0, size = this.mapping.size; index < size; ++index) {
      yield this.mapping.getNth(index)
    }
  }

  /**
   * 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof TypeMappingSequence) {
      return other.mapping === this.mapping
    }

    return false
  }
}
