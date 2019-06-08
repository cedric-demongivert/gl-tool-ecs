/** eslint-env jest */

import { ArraySet } from '../../src/ts/collection/ArraySet'

describe('ArraySet', function () {
  describe('#constructor', function () {
    it('create an empty set with an initial capacity of 16 elements', function () {
      const set : ArraySet<number> = new ArraySet<number>()

      expect(set.size).toBe(0)
      expect(set.capacity).toBe(16)
      expect([...set]).toEqual([])
    })

    it('create an empty set with a given capacity', function () {
      const set : ArraySet<number> = new ArraySet<number>(200)

      expect(set.size).toBe(0)
      expect(set.capacity).toBe(200)
      expect([...set]).toEqual([])
    })
  })

  describe('#copy', function () {
    it('copy an existing set', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 40; ++index) {
        if (index % 2 == 0 && index % 3 == 0) set.add(index)
      }

      const copy : ArraySet<number> = ArraySet.copy(set)

      expect(copy.equals(set)).toBeTruthy()
      expect(copy === set).toBeFalsy()
      expect(copy.capacity).toBe(set.capacity)
    })
  })

  describe('#get isCollection', function () {
    it('returns true', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      expect(set.isCollection).toBeTruthy()
    })
  })

  describe('#get isSet', function () {
    it('returns true', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      expect(set.isSet).toBeTruthy()
    })
  })

  describe('#has', function () {
    it('return true if the given set contains the given element', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 40; ++index) {
        if (index % 2 == 0 && index % 3 == 0) set.add(index)
      }

      for (let index = 0; index < 40; ++index) {
        expect(set.has(index)).toBe(index % 2 == 0 && index % 3 == 0)
      }
    })
  })

  describe('#add', function () {
    it('add a value to the set', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      expect(set.size).toBe(0)
      expect([...set]).toEqual([])

      set.add(0)

      expect(set.size).toBe(1)
      expect([...set]).toEqual([0])

      for (let index = 1; index < 20; ++index) set.add(index)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
      ]))
    })

    it('does nothing if you add the same value twice', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
    })
  })

  describe('#delete', function () {
    it('delete a value from the set', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 20; ++index) set.add(index)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
      ]))
      expect(set.has(19)).toBeTruthy()

      set.delete(19)

      expect(set.size).toBe(19)
      expect(new Set([...set])).toEqual(new Set([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
      ]))
      expect(set.has(19)).toBeFalsy()

      for (let index = 0; index < 5; ++index) {
        set.delete(index * 2)
      }

      expect(set.size).toBe(14)
      expect(new Set([...set])).toEqual(new Set([
        1, 3, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
      ]))
    })

    it('does nothing if you delete the same value twice', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))

      for (let index = 0; index < 10; ++index) set.delete(index * 4)
      for (let index = 0; index < 10; ++index) set.delete(index * 4)

      expect(set.size).toBe(10)
      expect(new Set([...set])).toEqual(new Set([
        2, 6, 10, 14, 18, 22, 26, 30, 34, 38
      ]))
    })
  })

  describe('#get', function () {
    it('allow to random access elements of the set', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      const access : Set<number> = new Set()

      for (let index = 0; index < 20; ++index) access.add(set.get(index))

      expect(access).toEqual(new Set([...set]))
    })
  })

  describe('#reallocate', function () {
    it('allows to expand the storing capacity of the set', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(40)

      set.reallocate(82)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(82)
    })

    it('allows to reduce the storing capacity of the set', function () {
      const set : ArraySet<number> = new ArraySet<number>(80)

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(80)

      set.reallocate(43)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(43)
    })

    it('remove elements from the set if it is necessary', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

      for (let index = 0; index < 20; ++index) set.add((20 - index - 1) * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(40)

      set.reallocate(10)

      expect(set.size).toBe(10)
      expect(new Set([...set])).toEqual(new Set([
        20, 22, 24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(10)
    })
  })

  describe('#fit', function () {
    it('optimize the storing capacity of the set', function () {
      const set : ArraySet<number> = new ArraySet<number>(80)

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(80)

      set.fit()

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(20)
    })

    it('reduce the capacity to zero if the set is empty', function () {
      const set : ArraySet<number> = new ArraySet<number>(40)

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
      const set : ArraySet<number> = new ArraySet<number>(80)

      for (let index = 0; index < 20; ++index) set.add(index * 2)

      expect(set.size).toBe(20)
      expect(new Set([...set])).toEqual(new Set([
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
        24, 26, 28, 30, 32, 34, 36, 38
      ]))
      expect(set.capacity).toBe(80)

      set.clear()

      expect(set.size).toBe(0)
      expect(new Set([...set])).toEqual(new Set([]))
      expect(set.capacity).toBe(80)
    })
  })

  describe('#equals', function () {
    it('it return true if both element set are equals', function () {
      const set : ArraySet<number> = new ArraySet<number>(80)
      const copy : ArraySet<number> = new ArraySet<number>(80)
      const differentSize : ArraySet<number> = new ArraySet<number>(80)
      const differentContent : ArraySet<number> = new ArraySet<number>(80)
      const differentCapacity : ArraySet<number> = new ArraySet<number>(70)

      for (let index = 0; index < 20; ++index) {
        set.add(index * 2)
        copy.add(index * 2)
        differentSize.add(index * 2)
        differentContent.add(index * 2)
        differentCapacity.add(index * 2)
      }

      differentSize.add(3)
      differentContent.delete(2)
      differentContent.add(3)

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
