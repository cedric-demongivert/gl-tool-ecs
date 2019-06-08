import { ComponentTypeEquality } from './ComponentTypeEquality'
import { ComponentTypeEqualityBuilder } from './ComponentTypeEqualityBuilder'
import {
  ComponentTypeEqualityCollection
} from './ComponentTypeEqualityCollection'

const EMPTY_MAP = new Map()

export class MutableComponentTypeEqualityCollection
      implements ComponentTypeEqualityCollection
{
  /**
  * Create a copy of an existing component type equality collection.
  *
  * @param toCopy - A collection to copy.
  *
  * @return A collection that is a copy of the given one.
  */
  public static copy (
    toCopy : ComponentTypeEqualityCollection
  ) : MutableComponentTypeEqualityCollection {
    const copy = new MutableComponentTypeEqualityCollection()

    for (const equality of toCopy) {
      copy._create(ComponentTypeEquality.copy(equality))
    }

    return copy
  }

  private _elements : Map<number, ComponentTypeEquality>
  private _equalitiesByOriginType :
    Map<number, Map<number, ComponentTypeEquality>>
  private _equalitiesByEqualType :
    Map<number, Map<number, ComponentTypeEquality>>
  private _next : number

  /**
  * Create a new empty component type equality collection.
  */
  public constructor () {
    this._elements = new Map<number, ComponentTypeEquality>()
    this._equalitiesByOriginType = (
      new Map<number, Map<number, ComponentTypeEquality>>()
    )
    this._equalitiesByEqualType = (
      new Map<number, Map<number, ComponentTypeEquality>>()
    )
    this._next = 0
  }

  /**
  * @see ComponentTypeEqualityCollection.size
  */
  public get size () : number {
    return this._elements.size
  }

  /**
  * @see ComponentTypeEqualityCollection.isComponentTypeEqualityCollection
  */
  public get isComponentTypeEqualityCollection () : boolean {
    return true
  }

  /**
  * @see ComponentTypeEqualityCollection.get
  */
  public get (identifier : number) : ComponentTypeEquality {
    return this._elements.get(identifier)
  }

  /**
  * @see ComponentTypeEqualityCollection.getEquality
  */
  public getEquality (
    originType : number,
    equalType : number
  ) : ComponentTypeEquality {
    return (this._equalitiesByOriginType.get(originType) || EMPTY_MAP).get(
      equalType
    )
  }

  /**
  * @see ComponentTypeEqualityCollection.equalitiesTo
  */
  public equalitiesTo (equalType : number) : Iterable<ComponentTypeEquality> {
    return (this._equalitiesByEqualType.get(equalType) || EMPTY_MAP).values()
  }

  /**
  * @see ComponentTypeEqualityCollection.equalities
  */
  public equalities (originType : number) : Iterable<ComponentTypeEquality> {
    return (this._equalitiesByOriginType.get(originType) || EMPTY_MAP).values()
  }

  /**
  * @see ComponentTypeEqualityCollection.has
  */
  public has (identifier : number) : boolean {
    return this._elements.has(identifier)
  }

  /**
  * @see ComponentTypeEqualityCollection.hasEquality
  */
  public hasEquality (originType : number, equalType : number) : boolean {
    return (this._equalitiesByOriginType.get(originType) || EMPTY_MAP).has(
      equalType
    )
  }

  /**
  * @see ComponentTypeEqualityCollection.hasEqualitiesTo
  */
  public hasEqualitiesTo (equalType : number) : boolean {
    return (this._equalitiesByEqualType.get(equalType) || EMPTY_MAP).size > 0
  }

  /**
  * @see ComponentTypeEqualityCollection.hasEqualities
  */
  public hasEqualities (originType : number) : boolean {
    return (this._equalitiesByOriginType.get(originType) || EMPTY_MAP).size > 0
  }

  /**
  * @see ComponentTypeEqualityCollection.areEquals
  */
  public areEquals (originType : number, equalType : number) : boolean {
    return originType === equalType || (
      this._equalitiesByOriginType.get(originType) || EMPTY_MAP
    ).has(equalType)
  }

  /**
  * @see ComponentTypeEqualityCollection.isComputed
  */
  public isComputed (originType : number, equalType : number) : boolean {
    return this.hasEquality(originType, equalType) &&
           this.getEquality(originType, equalType).computed
  }

  /**
  * @see ComponentTypeEqualityCollection.isDeclared
  */
  public isDeclared (originType : number, equalType : number) : boolean {
    return this.hasEquality(originType, equalType) &&
           !this.getEquality(originType, equalType).computed
  }

  /**
  * Register a new type equality into this component collection.
  *
  * @param originType - Identifier of a type from wich equality start.
  * @param equalType - Identifier of a type from wich equality end.
  *
  * @return This collection instance for chaining purposes.
  */
  public create (
    originType : number,
    equalType : number
  ) : MutableComponentTypeEqualityCollection {
    if (originType == null) {
      throw new Error('Unable to create a type equality from a null type.')
    }

    if (equalType == null) {
      throw new Error('Unable to create a type equality to a null type.')
    }

    if (originType === equalType) {
      return this
    }

    if (this.areEquals(originType, equalType)) {
      const equality : ComponentTypeEquality = this.getEquality(
        originType,
        equalType
      )

      if (equality.computed) {
        this._update(
          ComponentTypeEqualityBuilder.INSTANCE
                                      .setComponentTypeEquality(equality)
                                      .setComputed(false)
                                      .build()
        )
      } else {
        throw new Error([
          'Unable to set type', originType, 'equal to type', equalType,
          'because both type are already declared as equals.'
        ].join(' '))
      }
    } else {
      const equality : ComponentTypeEquality = (
        ComponentTypeEqualityBuilder.INSTANCE
                                    .setIdentifier(this._next)
                                    .setOriginType(originType)
                                    .setEqualType(equalType)
                                    .setComputed(false)
                                    .build()
      )

      this._create(equality)
      this._createConsequencesOf(equality)

      return this
    }
  }

  private _create (equality : ComponentTypeEquality) : void {
    this._elements.set(equality.identifier, equality)
    if (equality.identifier === this._next) this._computeNext()

    if (!this._equalitiesByOriginType.has(equality.originType)) {
      this._createIdentity(equality.originType)
    }

    if (!this._equalitiesByEqualType.has(equality.equalType)) {
      this._createIdentity(equality.equalType)
    }

    this._equalitiesByOriginType.get(equality.originType).set(
      equality.equalType, equality
    )

    this._equalitiesByEqualType.get(equality.equalType).set(
      equality.originType, equality
    )
  }

  private _update (equality : ComponentTypeEquality) : void {
    this._elements.set(equality.identifier, equality)
    this._equalitiesByOriginType.get(equality.originType).set(
      equality.equalType, equality
    )
    this._equalitiesByEqualType.get(equality.equalType).set(
      equality.originType, equality
    )
  }

  private _createConsequencesOf (equality) {
    for (const equalityToOrigin of this.equalitiesTo(equality.originType)) {
      for (const equalityFromEqual of this.equalities(equality.equalType)) {
        if (
          !this.areEquals(
            equalityToOrigin.originType,
            equalityFromEqual.equalType
          )
        ) {
          this._create(
            ComponentTypeEqualityBuilder.INSTANCE
              .setIdentifier(this._next)
              .setOriginType(equalityToOrigin.originType)
              .setEqualType(equalityFromEqual.equalType)
              .setComputed(true)
              .build()
          )
        }
      }
    }

    return this
  }

  private _createIdentity (componentType : number) {
    const identity : ComponentTypeEquality = (
      ComponentTypeEqualityBuilder.INSTANCE
        .setIdentifier(this._next)
        .setComputed(true)
        .setOriginType(componentType)
        .setEqualType(componentType)
        .build()
    )

    this._elements.set(identity.identifier, identity)
    this._equalitiesByOriginType.set(
      componentType,
      new Map<number, ComponentTypeEquality>()
    )
    this._equalitiesByEqualType.set(
      componentType,
      new Map<number, ComponentTypeEquality>()
    )
    this._equalitiesByOriginType.get(componentType).set(componentType, identity)
    this._equalitiesByEqualType.get(componentType).set(componentType, identity)

    this._computeNext()
  }

  private _computeNext () {
    while (this._elements.has(this._next)) this._next += 1
  }

  public declare (type : number) : MutableComponentTypeEqualityCollection {
    this._createIdentity(type)
    return this
  }

  public drop (type : number) : MutableComponentTypeEqualityCollection {
    for (const equality of this.equalitiesTo(type)) {
      if (!equality.computed) {
        this.delete(equality.identifier)
      }
    }

    for (const equality of this.equalities(type)) {
      if (!equality.computed) {
        this.delete(equality.identifier)
      }
    }

    if (this.hasEquality(type, type)) {
      this._deleteIdentity(type)
    }

    return this
  }

  /**
  * Delete a type equality from this collection by using its identifier.
  *
  * @param identifier - Identifier of the equality to delete.
  *
  * @return This collection instance for chaining purposes.
  */
  public delete (identifier : number) : MutableComponentTypeEqualityCollection {
    if (!this.has(identifier)) {
      throw new Error([
        'Unable to delete equality with identifier', identifier, 'because no',
        'equality exists with the given identifier into this collection.'
      ].join(' '))
    }

    this._userDelete(this.get(identifier))

    return this
  }

  /**
  * Delete a type equality from this collection by using its identifier.
  *
  * @param originType - Identifier of a type from wich equality start.
  * @param equalType - Identifier of a type from wich equality end.
  *
  * @return This collection instance for chaining purposes.
  */
  public deleteEquality (
    originType : number,
    equalType : number
  ) : MutableComponentTypeEqualityCollection {
    if (!this.areEquals(originType, equalType)) {
      throw new Error([
        'Unable to delete equality between', originType, 'and', equalType,
        'because both types are not equals.'
      ].join(' '))
    }

    this._userDelete(this.getEquality(originType, equalType))

    return this
  }

  private _userDelete (equality) {
    if (equality.computed) {
      throw new Error([
        'Unable to delete equality with identifier', equality.identifier,
        'between types', equality.originType, 'and', equality.equalType,
        'because this equality is a consequence of other declared equalities.',
        'If you want to delete this relation you must delete all declared',
        'equality from wich this one is a consequence.'
      ].join(' '))
    }

    if (this._isHardErasable(equality)) {
      this._hardErase(equality)
    } else {
      this._update(
        ComponentTypeEqualityBuilder.INSTANCE
                                    .setComponentTypeEquality(equality)
                                    .setComputed(true)
                                    .build()
      )
    }
  }

  private _hardErase (equality) {
    this._delete(equality)

    for (const equalityToOrigin of this.equalitiesTo(equality.originType)) {
      for (const equalityFromEqual of this.equalities(equality.equalType)) {
        this._recheck(equalityToOrigin.originType, equalityFromEqual.equalType)
      }
    }
  }

  private _recheck (from, to) {
    if (from === to) return
    if (!this.hasEquality(from, to)) return
    if (!this.isComputed(from, to)) return

    if (!this._existsPath(from, to)) {
      this._delete(this.getEquality(from, to))
    }
  }

  private _isHardErasable (erasable) {
    const visited = new Set()
    const visitable = new Set()

    visited.add(erasable.originType)

    for (const equality of this.equalities(erasable.originType)) {
      if (
        equality.equalType !== erasable.equalType &&
        equality.equalType !== erasable.originType &&
        !equality.computed &&
        this.areEquals(equality.equalType, erasable.equalType)
      ) visitable.add(equality.equalType)
    }

    while (visitable.size > 0) {
      const current = visitable.values().next().value

      if (this.isDeclared(current, erasable.equalType)) return false

      visited.add(current)
      visitable.delete(current)

      for (const equality of this.equalities(current)) {
        if (
          !equality.computed &&
          this.areEquals(equality.equalType, erasable.equalType) &&
          !visited.has(equality.equalType)
        ) visitable.add(equality.equalType)
      }
    }

    return true
  }

  private _existsPath (start, end) {
    const visited = new Set()
    const visitable = new Set()

    visited.add(start)

    for (const equality of this.equalities(start)) {
      if (
        equality.equalType !== start &&
        !equality.computed &&
        this.areEquals(equality.equalType, end)
      ) visitable.add(equality.equalType)
    }

    while (visitable.size > 0) {
      const current = visitable.values().next().value

      if (this.isDeclared(current, end)) return true

      visited.add(current)
      visitable.delete(current)

      for (const equality of this.equalities(current)) {
        if (
          !equality.computed &&
          this.areEquals(equality.equalType, end) &&
          !visited.has(equality.equalType)
        ) visitable.add(equality.equalType)
      }
    }

    return false
  }

  private _delete (equality) {
    this._elements.delete(equality.identifier)

    this._equalitiesByOriginType.get(equality.originType).delete(
      equality.equalType
    )

    this._equalitiesByEqualType.get(equality.equalType).delete(
      equality.originType
    )

    if (this._equalitiesByOriginType.get(equality.originType).size <= 1) {
      this._deleteIdentity(equality.originType)
    }

    if (this._equalitiesByEqualType.get(equality.equalType).size <= 1) {
      this._deleteIdentity(equality.equalType)
    }

    if (equality.identifier < this._next) this._next = equality.identifier
  }

  private _deleteIdentity (componentType) {
    const identity = this.getEquality(componentType, componentType)

    this._elements.delete(identity.identifier)
    this._equalitiesByOriginType.delete(componentType)
    this._equalitiesByEqualType.delete(componentType)

    if (identity.identifier < this._next) this._next = identity.identifier
  }

  /**
  * Remove all equalities of this collection.
  *
  * @return This collection instance for chaining purposes.
  */
  public clear () : MutableComponentTypeEqualityCollection {
    this._elements.clear()
    this._equalitiesByOriginType.clear()
    this._equalitiesByEqualType.clear()
    this._next = 0
    return this
  }

  /**
  * @see ComponentTypeEqualityCollection.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other.isComponentTypeEqualityCollection) {
      if (this._elements.size !== other.size) return false

      for (const relationship of other) {
        if (!this.has(relationship.identifier)) return false
        if (!this.get(relationship.identifier).equals(relationship)) {
          return false
        }
      }

      return true
    }

    return false
  }

  /**
  * @return An iterator over each element of this collection.
  */
  public * [Symbol.iterator] () : Iterator<ComponentTypeEquality> {
    yield * this._elements.values()
  }
}
