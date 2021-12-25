import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { TypeMappingSequence } from './TypeMappingSequence'
import { ComponentType } from './ComponentType'

/**
 * 
 */
export class TypeMapping {
  /**
   * 
   */
  public readonly types: Sequence<ComponentType<any>>

  /**
   * 
   */
  private _identifiers: IdentifierSet

  /**
   * 
   */
  private _typeByIdentifier: Pack<ComponentType<any>>

  /**
   * 
   */
  private _identifierByType: Map<ComponentType<any>, number>

  /**
   * 
   */
  public constructor(capacity: number) {
    this._identifiers = IdentifierSet.allocate(capacity)
    this._typeByIdentifier = Pack.any(capacity)
    this._identifierByType = new Map()
    this.types = new TypeMappingSequence(this)
  }

  /**
   * 
   */
  public get capacity(): number {
    return this._identifiers.capacity
  }

  /**
   * 
   */
  public get size(): number {
    return this._identifiers.size
  }

  /**
   * 
   */
  public add(type: ComponentType<any>): number {
    const existing: number = this._identifierByType.get(type)

    if (existing == null) {
      const next: number = this._identifiers.next()

      this._typeByIdentifier.set(next, type)
      this._identifierByType.set(type, next)

      return next
    } else {
      return existing
    }
  }

  /**
   * 
   */
  public delete(type: ComponentType<any>): void
  /**
   * 
   */
  public delete(type: number): void
  /**
   * 
   */
  public delete(type: number | ComponentType<any>): void
  public delete(type: number | ComponentType<any>): void {
    if (typeof type === 'number') {
      const instance: ComponentType<any> = this._typeByIdentifier.get(type)

      this._identifiers.delete(type)
      this._typeByIdentifier.set(type, undefined)
      this._identifierByType.delete(instance)
    } else {
      const identifier: number = this._identifierByType.get(type)

      this._identifiers.delete(identifier)
      this._typeByIdentifier.set(identifier, undefined)
      this._identifierByType.delete(type)
    }
  }

  /**
   * 
   */
  public has(type: ComponentType<any>): boolean
  /**
   * 
   */
  public has(type: number): boolean
  /**
   * 
   */
  public has(type: number | ComponentType<any>): boolean
  public has(type: number | ComponentType<any>): boolean {
    if (typeof type === 'number') {
      return this._identifiers.has(type)
    } else {
      return this._identifierByType.has(type)
    }
  }

  /**
   * 
   */
  public hasInSubsequence(type: ComponentType<any>, offset: number, size: number): boolean
  /**
   * 
   */
  public hasInSubsequence(type: number, offset: number, size: number): boolean
  /**
   * 
   */
  public hasInSubsequence(type: number | ComponentType<any>, offset: number, size: number): boolean
  public hasInSubsequence(type: number | ComponentType<any>, offset: number, size: number): boolean {
    if (typeof type === 'number') {
      return this._identifiers.hasInSubsequence(type, offset, size)
    } else {
      const identifier: number | undefined = this._identifierByType.get(type)
      return identifier != null && this._identifiers.hasInSubsequence(identifier, offset, size)
    }
  }

  /**
   * 
   */
  public getNth(index: number): ComponentType<any> {
    return this._typeByIdentifier.get(this._identifiers.get(index))
  }

  /**
   * 
   */
  public indexOf(type: ComponentType<any>): number {
    return this._identifiers.indexOf(this._identifierByType.get(type))
  }

  /**
   * 
   */
  public indexOfInSubsequence(type: ComponentType<any>, offset: number, size: number): number {
    return this._identifiers.indexOfInSubsequence(this._identifierByType.get(type), offset, size)
  }

  /**
   * 
   */
  public get(type: ComponentType<any>): number
  /**
   * 
   */
  public get(type: number): ComponentType<any>
  public get(type: number | ComponentType<any>): number | ComponentType<any> {
    if (typeof type === 'number') {
      return this._typeByIdentifier.get(type)
    } else {
      return this._identifierByType.get(type)
    }
  }

  /**
   * 
   */
  public clear(): void {
    this._identifiers.clear()
    this._typeByIdentifier.clear()
    this._identifierByType.clear()
  }
}
