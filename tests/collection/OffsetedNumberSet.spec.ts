/** eslint-env jest */

import { OffsetedNumberSet } from '../../src/ts/collection/OffsetedNumberSet'

describe('OffsetedNumberSet', function () {
  describe('#constructor', function () {
    it('create an empty set with an initial capacity of 16 elements', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet()

      expect(set.size).toBe(0)
      expect(set.offset).toBe(0)
      expect(set.spacing).toBe(1)
      expect(set.capacity).toBe(16)
      expect([...set]).toEqual([])
    })

    it('create an empty set with a given capacity', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(800)

      expect(set.size).toBe(0)
      expect(set.offset).toBe(0)
      expect(set.spacing).toBe(1)
      expect(set.capacity).toBe(800)
      expect([...set]).toEqual([])
    })
  })

  describe('#copy', function () {
    it('copy an existing set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 3
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 10 + 3)

      const copy : OffsetedNumberSet = OffsetedNumberSet.copy(set)

      expect(copy.equals(set)).toBeTruthy()
      expect(copy === set).toBeFalsy()
      expect(copy.capacity).toBe(set.capacity)
    })
  })

  describe('#get isCollection', function () {
    it('returns true', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)

      expect(set.isCollection).toBeTruthy()
    })
  })

  describe('#get isSet', function () {
    it('returns true', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)

      expect(set.isSet).toBeTruthy()
    })
  })

  describe('#has', function () {
    it('return true if the given set contains the given element', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(20)
      set.offset = 13
      set.spacing = 7

      for (let index = 0; index < 10; ++index) set.add(index * 2 * 7 + 13)

      for (let index = 0; index < 20 * 7 + 13; ++index) {
        expect(set.has(index)).toBe(
          index >= 13 &&
          (index - 13) % 7 === 0 &&
          ((index - 13) / 7) % 2 === 0
        )
      }
    })
  })

  describe('#hasRaw', function () {
    it('return true if the underlying set contains the given element', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(20)
      set.offset = 13
      set.spacing = 7

      for (let index = 0; index < 10; ++index) set.add(index * 2 * 7 + 13)

      for (let index = 0; index < 20; ++index) {
        expect(set.hasRaw(index)).toBe(index % 2 === 0)
      }
    })
  })

  describe('#add', function () {
    it('add a value to the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])

      set.add(20)

      expect(set.size).toBe(1)
      expect([...set]).toEqual([20])

      for (let index = 1; index < 20; ++index) set.add(index * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
      ].map(x => x * 5 + 20)))
    })

    it('does nothing if you add the same value twice', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 10 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))

      for (let index = 0; index < 20; ++index) set.add(index * 10 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
    })

    it('does nothing if you add out of range values', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])

      set.add(10)

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])

      set.add(36)

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])
    })
  })

  describe('#addRaw', function () {
    it('add a value to the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])

      set.addRaw(0)

      expect(set.size).toBe(1)
      expect([...set]).toEqual([20])

      for (let index = 1; index < 20; ++index) set.addRaw(index)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
      ].map(x => x * 5 + 20)))
    })

    it('does nothing if you add the same value twice', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.addRaw(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))

      for (let index = 0; index < 20; ++index) set.addRaw(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
    })
  })

  describe('#delete', function () {
    it('delete a value from the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
      ].map(x => x * 5 + 20)))
      expect(set.has(19 * 5 + 20)).toBeTruthy()

      set.delete(19 * 5 + 20)

      expect(set.size).toBe(19)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
      ].map(x => x * 5 + 20)))
      expect(set.has(19 * 5 + 20)).toBeFalsy()

      for (let index = 0; index < 5; ++index) {
        set.delete(index * 2 * 5 + 20)
      }

      expect(set.size).toBe(14)
      expect(new Set([...set])).toEqual(new Set([
        1, 3, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
      ].map(x => x * 5 + 20)))
    })

    it('does nothing if you delete the same value twice', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))

      for (let index = 0; index < 10; ++index) set.delete(index * 4 * 5 + 20)
      for (let index = 0; index < 10; ++index) set.delete(index * 4 * 5 + 20)

      expect(set.size).toBe(10)
      expect(new Set([...set])).toEqual(new Set([
        2, 6, 10, 14, 18, 22, 26, 30, 34, 38
      ].map(x => x * 5 + 20)))
    })

    it('does nothing if you remove out of range values', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))

      set.delete(8)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))

      set.delete(32)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
    })
  })

  describe('#deleteRaw', function () {
    it('delete a value from the underlying set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
      ].map(x => x * 5 + 20)))
      expect(set.has(19 * 5 + 20)).toBeTruthy()

      set.deleteRaw(19)

      expect(set.size).toBe(19)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
      ].map(x => x * 5 + 20)))
      expect(set.has(19 * 5 + 20)).toBeFalsy()

      for (let index = 0; index < 5; ++index) {
        set.deleteRaw(index * 2)
      }

      expect(set.size).toBe(14)
      expect(new Set([...set])).toEqual(new Set([
        1, 3, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
      ].map(x => x * 5 + 20)))
    })

    it('does nothing if you delete the same value twice', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))

      for (let index = 0; index < 10; ++index) set.deleteRaw(index * 4)
      for (let index = 0; index < 10; ++index) set.deleteRaw(index * 4)

      expect(set.size).toBe(10)
      expect(new Set([...set])).toEqual(new Set([
        2, 6, 10, 14, 18, 22, 26, 30, 34, 38
      ].map(x => x * 5 + 20)))
    })
  })

  describe('#get', function () {
    it('allow to random access elements of the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      const access : Set<number> = new Set()

      for (let index = 0; index < 20; ++index) access.add(set.get(index))

      expect(access).toEqual(new Set([...set]))
    })
  })

  describe('#getRaw', function () {
    it('allow to random access elements of the underlying set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      const access : Set<number> = new Set()

      for (let index = 0; index < 20; ++index) access.add(set.getRaw(index))

      expect(access).toEqual(new Set([...set].map(x => (x - 20) / 5)))
    })
  })

  describe('#reallocate', function () {
    it('allows to expand the storing capacity of the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(40)

      set.reallocate(80)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(80)
    })

    it('allows to reduce the storing capacity of the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(80)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(80)

      set.reallocate(43)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(43)
    })

    it('remove elements from the set if it is necessary', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(
        (20 - index - 1) * 2 * 5 + 20
      )

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(40)

      set.reallocate(27)

      expect(set.size).toBe(20 - 6)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(27)
    })
  })

  describe('#fit', function () {
    it('optimize the storing capacity of the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(80)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(80)

      set.fit()

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(39)
    })

    it('reduce the capacity to zero if the set is empty', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(40)
      set.offset = 20
      set.spacing = 5

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])
      expect(set.capacity).toBe(40)

      set.fit()

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])
      expect(set.capacity).toBe(0)
    })
  })

  describe('#clear', function () {
    it('it empty the set', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(80)
      set.offset = 20
      set.spacing = 5

      for (let index = 0; index < 20; ++index) set.add(index * 2 * 5 + 20)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ].map(x => x * 5 + 20)))
      expect(set.capacity).toBe(80)

      set.clear()

      expect(set.size).toBe(0)
      expect(new Set([...set])).toEqual(new Set([]))
      expect(set.capacity).toBe(80)
    })
  })

  describe('#equals', function () {
    it('it return true if both element set are equals', function () {
      const set : OffsetedNumberSet = new OffsetedNumberSet(80)
      const copy : OffsetedNumberSet = new OffsetedNumberSet(80)
      const differentSize : OffsetedNumberSet = new OffsetedNumberSet(80)
      const differentContent : OffsetedNumberSet = new OffsetedNumberSet(80)
      const differentCapacity : OffsetedNumberSet = new OffsetedNumberSet(70)

      set.offset = copy.offset = differentSize.offset = 20
      differentContent.offset = differentCapacity.offset = 20
      set.spacing = copy.spacing = differentSize.spacing = 5
      differentContent.spacing = differentCapacity.spacing = 5

      for (let index = 0; index < 20; ++index) {
        set.add(index * 2 * 5 + 20)
        copy.add(index * 2 * 5 + 20)
        differentSize.add(index * 2 * 5 + 20)
        differentContent.add(index * 2 * 5 + 20)
        differentCapacity.add(index * 2 * 5 + 20)
      }

      differentSize.add(3 * 5 + 20)
      differentContent.delete(2 * 5 + 20)
      differentContent.add(3 * 5 + 20)

      expect(set.equals(null)).toBeFalsy()
      expect(set.equals(15)).toBeFalsy()
      expect(set.equals(differentSize)).toBeFalsy()
      expect(set.equals(differentContent)).toBeFalsy()

      expect(set.equals(set)).toBeTruthy()
      expect(set.equals(copy)).toBeTruthy()
      expect(set.equals(differentCapacity)).toBeTruthy()
    })
  })
})
