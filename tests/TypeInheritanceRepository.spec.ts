/** eslint-env jest */

import { TypeInheritanceRepository } from '../src/ts/types/TypeInheritanceRepository'

describe('TypeInheritanceRepository', function () {
  describe('#constructor', function () {
    it('create a new empty inheritance manager', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      expect(inheritances.types).toBe(128)

      for (let index = 0; index < inheritances.types; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([])
      }
    })

    it('create a new empty inheritance manager with a given capacity', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository(256)
      )

      expect(inheritances.types).toBe(256)

      for (let index = 0; index < inheritances.types; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([])
      }
    })
  })

  describe('#create', function () {
    it('create a new empty inheritance manager', function () {
      const inheritances : TypeInheritanceRepository = (
        TypeInheritanceRepository.create()
      )

      expect(inheritances.types).toBe(128)

      for (let index = 0; index < inheritances.types; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([])
      }
    })

    it('create a new empty inheritance manager with a given capacity', function () {
      const inheritances : TypeInheritanceRepository = (
        TypeInheritanceRepository.create(256)
      )

      expect(inheritances.types).toBe(256)

      for (let index = 0; index < inheritances.types; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([])
      }
    })
  })

  describe('#copy', function () {
    it('return a copy of the given manager', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      inheritances.inherit(2, 5)
      inheritances.inherit(5, 3)
      inheritances.inherit(5, 6)
      inheritances.inherit(4, 2)

      const copy : TypeInheritanceRepository = TypeInheritanceRepository.copy(inheritances)

      expect(inheritances.equals(copy)).toBeTruthy()
      expect(inheritances === copy).toBeFalsy()
    })
  })

  describe('#reallocate', function () {
    it('grow the capacity of the manager', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository(10)
      )

      inheritances.inherit(2, 5)
      inheritances.inherit(5, 3)
      inheritances.inherit(5, 6)
      inheritances.inherit(4, 2)

      const muted : TypeInheritanceRepository = TypeInheritanceRepository.copy(inheritances)

      expect(muted.types).toBe(10)

      muted.reallocate(30)

      expect(muted.types).toBe(30)

      for (let index = 0; index < 10; ++index) {
        expect(new Set(muted.getParentTypesOf(index))).toEqual(
          new Set(inheritances.getParentTypesOf(index))
        )
        expect(new Set(muted.getChildTypesOf(index))).toEqual(
          new Set(inheritances.getChildTypesOf(index))
        )
      }

      for (let index = 10; index < 30; ++index) {
        expect(inheritances.getParentTypesOf(index)).toBeUndefined()
        expect(inheritances.getChildTypesOf(index)).toBeUndefined()
        expect(muted.getParentTypesOf(index)).not.toBeUndefined()
        expect(muted.getChildTypesOf(index)).not.toBeUndefined()
      }
    })

    it('reduce the capacity of the manager', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository(30)
      )

      inheritances.inherit(2, 5)
      inheritances.inherit(5, 3)
      inheritances.inherit(5, 6)
      inheritances.inherit(4, 2)

      const muted : TypeInheritanceRepository = (
        TypeInheritanceRepository.copy(inheritances)
      )

      expect(muted.types).toBe(30)

      muted.reallocate(10)

      expect(muted.types).toBe(10)

      for (let index = 0; index < 10; ++index) {
        expect(new Set(muted.getParentTypesOf(index))).toEqual(
          new Set(inheritances.getParentTypesOf(index))
        )
        expect(new Set(muted.getChildTypesOf(index))).toEqual(
          new Set(inheritances.getChildTypesOf(index))
        )
      }

      for (let index = 10; index < 30; ++index) {
        expect(muted.getParentTypesOf(index)).toBeUndefined()
        expect(muted.getChildTypesOf(index)).toBeUndefined()
        expect(inheritances.getParentTypesOf(index)).not.toBeUndefined()
        expect(inheritances.getChildTypesOf(index)).not.toBeUndefined()
      }
    })
  })

  describe('#getChildTypesOf', function () {
    it('return a collection with each types that inherit of a given type', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      inheritances.inherit(2, 5)
      inheritances.inherit(5, 3)
      inheritances.inherit(5, 6)
      inheritances.inherit(4, 2)

      expect(inheritances.getChildTypesOf(2).size).toBe(2)
      expect(
        new Set(inheritances.getChildTypesOf(2))
      ).toEqual(new Set([2, 4]))

      expect(inheritances.getChildTypesOf(3).size).toBe(4)
      expect(
        new Set(inheritances.getChildTypesOf(3))
      ).toEqual(new Set([2, 4, 5, 3]))

      expect(inheritances.getChildTypesOf(4).size).toBe(1)
      expect(
        new Set(inheritances.getChildTypesOf(4))
      ).toEqual(new Set([4]))

      expect(inheritances.getChildTypesOf(5).size).toBe(3)
      expect(
        new Set(inheritances.getChildTypesOf(5))
      ).toEqual(new Set([2, 4, 5]))

      expect(inheritances.getChildTypesOf(6).size).toBe(4)
      expect(
        new Set(inheritances.getChildTypesOf(6))
      ).toEqual(new Set([2, 4, 5, 6]))
    })
  })

  describe('#getParentTypesOf', function () {
    it('allows to iterate over each types that a given type inherits', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      inheritances.inherit(2, 5)
      inheritances.inherit(5, 3)
      inheritances.inherit(5, 6)
      inheritances.inherit(4, 2)

      expect(inheritances.getParentTypesOf(2).size).toBe(4)
      expect(
        new Set(inheritances.getParentTypesOf(2))
      ).toEqual(new Set([2, 5, 6, 3]))

      expect(inheritances.getParentTypesOf(3).size).toBe(1)
      expect(
        new Set(inheritances.getParentTypesOf(3))
      ).toEqual(new Set([3]))

      expect(inheritances.getParentTypesOf(4).size).toBe(5)
      expect(
        new Set(inheritances.getParentTypesOf(4))
      ).toEqual(new Set([2, 5, 4, 3, 6]))

      expect(inheritances.getParentTypesOf(5).size).toBe(3)
      expect(
        new Set(inheritances.getParentTypesOf(5))
      ).toEqual(new Set([3, 6, 5]))

      expect(inheritances.getParentTypesOf(6).size).toBe(1)
      expect(
        new Set(inheritances.getParentTypesOf(6))
      ).toEqual(new Set([6]))
    })
  })

  describe('#inherit', function () {
    it('register an inheritance', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )
      const links : [number, number][] = [[2, 5], [5, 3], [5, 6], [4, 2]]

      for (let index = 0; index < inheritances.types; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([])
      }

      for (let index = 0; index < links.length; ++index) {
        const link : [number, number] = links[index]
        for (let other = index; other < links.length; ++other) {
          const otherLink : [number, number] = links[index]
          expect(
            inheritances.getParentTypesOf(otherLink[0]).has(otherLink[1])
          ).toBeFalsy()
          expect(
            inheritances.getChildTypesOf(otherLink[1]).has(otherLink[0])
          ).toBeFalsy()
        }

        inheritances.inherit(...link)
        expect(inheritances.getParentTypesOf(link[0]).has(link[1])).toBeTruthy()
        expect(inheritances.getChildTypesOf(link[1]).has(link[0])).toBeTruthy()
      }
    })

    it('create identity inheritances', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      for (const type of [4, 2, 5, 3]) {
        expect(inheritances.getParentTypesOf(type).has(type)).toBeFalsy()
        expect(inheritances.getChildTypesOf(type).has(type)).toBeFalsy()
      }

      inheritances.inherit(2, 5)

      for (const type of [2, 5]) {
        expect(inheritances.getParentTypesOf(type).has(type)).toBeTruthy()
        expect(inheritances.getChildTypesOf(type).has(type)).toBeTruthy()
      }

      for (const type of [4, 3]) {
        expect(inheritances.getParentTypesOf(type).has(type)).toBeFalsy()
        expect(inheritances.getChildTypesOf(type).has(type)).toBeFalsy()
      }

      inheritances.inherit(5, 3)

      for (const type of [2, 5, 3]) {
        expect(inheritances.getParentTypesOf(type).has(type)).toBeTruthy()
        expect(inheritances.getChildTypesOf(type).has(type)).toBeTruthy()
      }

      for (const type of [4]) {
        expect(inheritances.getParentTypesOf(type).has(type)).toBeFalsy()
        expect(inheritances.getChildTypesOf(type).has(type)).toBeFalsy()
      }
    })

    it('create transitive inheritances', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )
      const links : [number, number][] = [[2, 5], [5, 3], [5, 6], [4, 2]]

      for (const [x1, y1] of links) {
        for (const [x2, y2] of links) {
          if (y1 === x2) {
            expect(inheritances.getParentTypesOf(x1).has(y2)).toBeFalsy()
            expect(inheritances.getChildTypesOf(y2).has(x1)).toBeFalsy()
          }
        }
      }

      for (const link of links) inheritances.inherit(...link)

      for (const [x1, y1] of links) {
        for (const [x2, y2] of links) {
          if (y1 === x2) {
            expect(inheritances.getParentTypesOf(x1).has(y2)).toBeTruthy()
            expect(inheritances.getChildTypesOf(y2).has(x1)).toBeTruthy()
          }
        }
      }
    })

    it('can register identity inheritance', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      for (let index = 0; index < 5; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([])
      }

      for (let index = 0; index < 5; ++index) {
        inheritances.inherit(index, index)
      }

      for (let index = 0; index < 5; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([index])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([index])
      }
    })

    it('does nothing if an inheritance is declared twice', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      inheritances.inherit(2, 5)
      inheritances.inherit(2, 5)

      expect(inheritances.getParentTypesOf(2).size).toBe(2)
      expect(
        new Set(inheritances.getParentTypesOf(2))
      ).toEqual(new Set([2, 5]))

      expect(inheritances.getParentTypesOf(5).size).toBe(1)
      expect(
        new Set(inheritances.getParentTypesOf(5))
      ).toEqual(new Set([5]))
    })
  })

  describe('#clear', function () {
    it('empty the collection', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )

      inheritances.inherit(2, 5)
      inheritances.inherit(5, 6)
      inheritances.inherit(6, 7)
      inheritances.inherit(6, 9)
      inheritances.inherit(9, 5)
      inheritances.inherit(9, 10)
      inheritances.inherit(10, 3)
      inheritances.inherit(2, 3)

      inheritances.clear()

      for (let index = 0; index < inheritances.types; ++index) {
        expect([...inheritances.getParentTypesOf(index)]).toEqual([])
        expect([...inheritances.getChildTypesOf(index)]).toEqual([])
      }
    })
  })

  describe('#equals', function () {
    it('return true if both collections are equals', function () {
      const inheritances : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )
      inheritances.inherit(2, 5)
      inheritances.inherit(6, 3)

      const different : TypeInheritanceRepository = (
        new TypeInheritanceRepository()
      )
      different.inherit(2, 5)
      different.inherit(3, 6)

      const bigger : TypeInheritanceRepository = new TypeInheritanceRepository()
      bigger.inherit(2, 5)
      bigger.inherit(6, 3)
      bigger.inherit(3, 6)

      const otherCapacity : TypeInheritanceRepository = (
        new TypeInheritanceRepository(256)
      )
      otherCapacity.inherit(2, 5)
      otherCapacity.inherit(6, 3)

      const copy : TypeInheritanceRepository = new TypeInheritanceRepository()
      copy.inherit(2, 5)
      copy.inherit(6, 3)

      expect(inheritances.equals(null)).toBeFalsy()
      expect(inheritances.equals(5)).toBeFalsy()

      expect(inheritances.equals(inheritances)).toBeTruthy()
      expect(inheritances.equals(copy)).toBeTruthy()

      expect(inheritances.equals(different)).toBeFalsy()
      expect(inheritances.equals(bigger)).toBeFalsy()
      expect(inheritances.equals(otherCapacity)).toBeFalsy()
    })
  })
})
