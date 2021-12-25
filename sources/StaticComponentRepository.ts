import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { Entity } from './Entity'
import { ComponentType } from './ComponentType'
import { Component } from './Component'

import { ComponentRepository } from './ComponentRepository'

/**
 * 
 */
export class StaticComponentRepository implements ComponentRepository {
  /**
   * 
   */
  private _identifiers: IdentifierSet

  /**
   * 
   */
  private _components: Pack<Component<any>>

  /**
   * Create a new empty static component repository with a given capacity.
   *
   * @param [capacity = 2048] - Number of component to store.
   */
  public constructor(capacity: number = 2048) {
    this._identifiers = IdentifierSet.allocate(capacity)
    this._components = Pack.any(capacity)
  }

  /**
   * @return The number of component that this repository can store.
   */
  public get capacity(): number {
    return this._identifiers.capacity
  }

  /**
   * @see ComponentRepository.size
   */
  public get size(): number {
    return this._identifiers.size
  }

  /**
   * Update the capacity of this component repository.
   *
   * @param capacity - The new number of component that this repository can store.
   */
  public reallocate(capacity: number): void {
    this._components.reallocate(capacity)
    this._identifiers.reallocate(capacity)
  }

  /**
   * Fit this repository allocated memory to its content.
   */
  public fit(): void {
    this._identifiers.fit()
    this._components.reallocate(this._identifiers.capacity)
  }

  /**
   * @see ComponentRepository.create
   */
  public create<Type>(entity: Entity, type: ComponentType<Type>, ...parameters: any[]): Component<Type> {
    const identifier: number = this._identifiers.next()
    const instance: Component<Type> = new Component(entity, type, identifier, ...parameters)

    this._components.set(identifier, instance)

    return instance
  }

  /**
   * @see ComponentRepository.delete
   */
  public delete(identifier: number): void
  public delete(component: Component<any>): void
  public delete(parameter: number | Component<any>): void {
    const identifier: number = typeof parameter === 'number' ? parameter : parameter.identifier

    this._components.set(identifier, undefined)
    this._identifiers.delete(identifier)
  }

  /**
   * @see ComponentRepository.getNth
   */
  public getNth(index: number): Component<any> {
    return this._components.get(this._identifiers.get(index))
  }

  /**
   * @see ComponentRepository.indexOf
   */
  public indexOf(component: Component<any>): number {
    return this._identifiers.indexOf(component.identifier)
  }

  /**
  * @see ComponentRepository.indexOfInSubsequence
  */
  public indexOfInSubsequence(component: Component<any>, offset: number, size: number): number {
    return this._identifiers.indexOfInSubsequence(component.identifier, offset, size)
  }

  /**
   * @see ComponentRepository.get
   */
  public get(identifier: number): Component<any>
  /**
   * @see ComponentRepository.get
   */
  public get<Type>(identifier: number, type: ComponentType<Type>): Component<Type>
  public get(identifier: number, type?: ComponentType<any>): Component<any> {
    if (type == null || this._components.get(identifier).type === type) {
      return this._components.get(identifier)
    } else {
      return undefined
    }
  }

  /**
   * @see ComponentRepository.has
   */
  public has(identifier: number): boolean
  /**
   * @see ComponentRepository.has
   */
  public has(component: Component<any>): boolean
  /**
   * @see ComponentRepository.has
   */
  public has(parameter: number | Component<any>): boolean
  public has(parameter: number | Component<any>): boolean {
    return this._identifiers.has(
      typeof parameter === 'number' ? parameter : parameter.identifier
    )
  }

  /**
  * @see ComponentRepository.hasInSubsequence
  */
  public hasInSubsequence(identifier: number, offset: number, size: number): boolean
  /**
   * @see ComponentRepository.has
   */
  public hasInSubsequence(component: Component<any>, offset: number, size: number): boolean
  /**
   * @see ComponentRepository.has
   */
  public hasInSubsequence(parameter: number | Component<any>, offset: number, size: number): boolean
  public hasInSubsequence(parameter: number | Component<any>, offset: number, size: number): boolean {
    return this._identifiers.hasInSubsequence(
      typeof parameter === 'number' ? parameter : parameter.identifier,
      offset, size
    )
  }

  /**
   * 
   */
  public clone(): StaticComponentRepository {
    const result: StaticComponentRepository = new StaticComponentRepository(this.capacity)

    for (let index = 0, size = this._identifiers.size; index < size; ++index) {
      const identifier: number = this._identifiers.get(index)
      const component: Component<any> = this._components.get(identifier)
      const type: ComponentType<any> = component.type
      const copy: Component<any> = new Component(component.entity, type, identifier)

      type.copy(component.data, copy.data)

      result._identifiers.add(identifier)
      result._components.set(identifier, copy)
    }

    return result
  }

  /**
   * @see ComponentRepository.clear
   */
  public clear(): void {
    while (this._components.size > 0) {
      this.delete(this._components.get(0))
    }
  }

  /**
   * @see Collection.iterator
   */
  public *[Symbol.iterator](): Iterator<Component<any>> {
    for (const identifier of this._identifiers) {
      yield this._components.get(identifier)
    }
  }

  /**
   * @see Collection.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof StaticComponentRepository) {
      if (other.size !== this._identifiers.size) return false

      for (let index = 0, size = this._identifiers.size; index < size; ++index) {
        const identifier: number = this._identifiers.get(index)

        if (
          !other.has(identifier) ||
          !this._components.get(identifier).equals(other.get(identifier))
        ) { return false }
      }

      return true
    }

    return false
  }
}

export namespace StaticComponentRepository {
  /**
   * Create a new empty static component repository with a given capacity.
   *
   * @param [capacity = 2048] - Number of component to store.
   *
   * @return The new empty static component repository.
   */
  export function allocate(capacity: number = 2048): StaticComponentRepository {
    return new StaticComponentRepository(capacity)
  }

  /**
   * Copy an existing static component repository.
   *
   * @param toCopy - A static component repository to copy.
   *
   * @return A new repository that is a copy of the given one.
   */
  export function copy(toCopy: StaticComponentRepository): StaticComponentRepository {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
