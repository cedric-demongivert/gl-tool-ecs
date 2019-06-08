import { StaticSet, BufferedNumberSet, View, Collection } from '../collection'

export class TypeInheritanceRepository {
  /**
  * Create a new manager with a given capacity.
  *
  * @param [types = 128] - Number of types handled by the manager to create.
  *
  * @return A new manager.
  */
  public static create (types : number = 128) {
    return new TypeInheritanceRepository(types)
  }

  /**
  * Copy an existing manager.
  *
  * @param toCopy - An existing manager instance to copy.
  *
  * @return A copy of the given instance.
  */
  public static copy (toCopy : TypeInheritanceRepository) : TypeInheritanceRepository {
    const copy : TypeInheritanceRepository = new TypeInheritanceRepository(toCopy.types)

    for (let type = 0, length = toCopy.types; type < length; ++type) {
      const parents : Collection<number> = toCopy.getParentTypesOf(type)

      for (let index = 0, length = parents.size; index < length; ++index) {
        copy.inherit(type, parents.get(index))
      }
    }

    return copy
  }

  private _parentsByType : BufferedNumberSet[]
  private _childrenByType : BufferedNumberSet[]

  private _parentsViewByType : View<number>[]
  private _childrenViewByType : View<number>[]

  /**
  * Create a new inheritance manager with an initial type capacity.
  *
  * @param [types = 128] - Number of types that this collection can handle.
  */
  public constructor (types : number = 128) {
    this._parentsByType = new Array<BufferedNumberSet>(types)
    this._childrenByType = new Array<BufferedNumberSet>(types)
    this._parentsViewByType = new Array<View<number>>(types)
    this._childrenViewByType = new Array<View<number>>(types)

    for (let index = 0; index < types; ++index) {
      this._parentsByType[index] = new BufferedNumberSet(types)
      this._childrenByType[index] = new BufferedNumberSet(types)
      this._parentsViewByType[index] = View.wrap(this._parentsByType[index])
      this._childrenViewByType[index] = View.wrap(this._childrenByType[index])
    }
  }

  /**
  * @return The number of types that this manager handle.
  */
  public get types () : number {
    return this._parentsByType.length
  }

  /**
  * Change the number of types handled by this manager.
  *
  * @param capacity - The new number of types to handle.
  */
  public reallocate (capacity : number) : void {
    const oldSize : number = this._parentsByType.length

    this._parentsByType.length = capacity
    this._childrenByType.length = capacity
    this._parentsViewByType.length = capacity
    this._childrenViewByType.length = capacity

    const minLength : number = Math.min(oldSize, capacity)
    for (let index = 0; index < minLength; ++index) {
      this._parentsByType[index].reallocate(capacity)
      this._childrenByType[index].reallocate(capacity)
    }

    for (let index = oldSize; index < capacity; ++index) {
      this._parentsByType[index] =new BufferedNumberSet(capacity)
      this._childrenByType[index] = new BufferedNumberSet(capacity)
      this._parentsViewByType[index] = View.wrap(this._parentsByType[index])
      this._childrenViewByType[index] = View.wrap(this._childrenByType[index])
    }
  }

  /**
  * Return a collection of types that are parent of the given one.
  *
  * @param type - A type to search for.
  *
  * @return A collection of types that are parent of the given one.
  */
  public getParentTypesOf (type : number) : Collection<number> {
    return this._parentsViewByType[type]
  }

  /**
  * Return a collection of types that are children of the given one.
  *
  * @param type - A type to search for.
  *
  * @return A collection of types that are children of the given one.
  */
  public getChildTypesOf (type : number) : Collection<number> {
    return this._childrenViewByType[type]
  }

  /**
  * Mark a type as inherited from another.
  *
  * @param child - Type that inherits.
  * @param parent - Inherited type.
  */
  public inherit (child : number, parent : number) : void {
    if (child === parent) {
      this.identity(child)
    } else {
      this.identity(child)
      this.identity(parent)

      const parentParents : BufferedNumberSet = this._parentsByType[parent]
      const childChildren : BufferedNumberSet = this._childrenByType[child]

      for (
        let parentIndex = 0, parentLength = parentParents.size;
        parentIndex < parentLength;
        ++parentIndex
      ) {
        for (
          let childIndex = 0, childLength = childChildren.size;
          childIndex < childLength;
          ++childIndex
        ) {
          this._childrenByType[parentParents.get(parentIndex)].add(
            childChildren.get(childIndex)
          )
          this._parentsByType[childChildren.get(childIndex)].add(
            parentParents.get(parentIndex)
          )
        }
      }
    }
  }

  /**
  * Mark an identity (a type inherits from itself).
  *
  * @param type - Type to mark as identity.
  */
  public identity (type : number) : void {
    this._parentsByType[type].add(type)
    this._childrenByType[type].add(type)
  }

  /**
  * Clear this manager of all of its datas.
  */
  public clear () : void {
    for (
      let index = 0, length = this._parentsByType.length;
      index < length;
      ++index
    ) {
      this._parentsByType[index].clear()
      this._childrenByType[index].clear()
    }
  }

  /**
  * Return true if this instance is equal to another one.
  *
  * @param other - Another instance to compare to this one.
  *
  * @return True if both instances are equals.
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof TypeInheritanceRepository) {
      if (other.types !== this._parentsByType.length) return false

      for (let index = 0, length = other.types; index < length; ++index) {
        if (!other.getParentTypesOf(index).equals(this._parentsByType[index])) {
          return false
        }
      }

      return true
    }

    return false
  }
}
