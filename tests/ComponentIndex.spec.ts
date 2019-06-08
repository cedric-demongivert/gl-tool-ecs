/** eslint-env jest */

import { ComponentIndex } from '../src/ts/components/ComponentIndex'

describe('ComponentIndex', function () {
  describe('#copy', function () {
    it('create a copy of an existing component index', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      components.set(10, 5, 23)
      components.set(12, 5, 42)
      components.set(168, 5, 42)
      components.set(8, 5, 42)
      components.set(32, 5, 42)

      const copy : ComponentIndex = ComponentIndex.copy(components)

      expect(copy.equals(components)).toBeTruthy()
      expect(copy === components).toBeFalsy()
    })
  })

  describe('#constructor', function () {
    it('create a new empty component index with a given capacity', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      expect(components.entities).toBe(200)
      expect(components.types).toBe(20)

      for (let entity = 0; entity < 200; ++entity) {
        for (let type = 0; type < 20; ++type) {
          expect(components.get(entity, type)).toBeUndefined()
        }
      }
    })
  })

  describe('#set', function () {
    it('index a component', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      expect(components.has(10, 5)).toBeFalsy()
      expect(components.get(10, 5)).toBeUndefined()
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set())
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set())

      components.set(10, 5, 23)

      expect(components.has(10, 5)).toBeTruthy()
      expect(components.get(10, 5)).toBe(23)
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set([5]))
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set([10]))
    })

    it('index multiple component', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      components.set(5, 10, 1)
      components.set(5, 13, 2)
      components.set(5, 8, 2)
      components.set(128, 3, 14)
      components.set(128, 13, 14)
      components.set(128, 14, 14)

      expect(new Set(components.getTypesOfEntity(5))).toEqual(
        new Set([10, 13, 8])
      )

      expect(new Set(components.getTypesOfEntity(128))).toEqual(
        new Set([3, 13, 14])
      )
      expect(new Set(components.getEntitiesWithType(3))).toEqual(new Set([128]))
      expect(new Set(components.getEntitiesWithType(8))).toEqual(new Set([5]))
      expect(new Set(components.getEntitiesWithType(10))).toEqual(new Set([5]))
      expect(new Set(components.getEntitiesWithType(13))).toEqual(
        new Set([128, 5])
      )
      expect(new Set(components.getEntitiesWithType(14))).toEqual(
        new Set([128])
      )
    })

    it('replace a previously setted component', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      components.set(10, 5, 25)

      expect(components.has(10, 5)).toBeTruthy()
      expect(components.get(10, 5)).toBe(25)
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set([5]))
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set([10]))

      components.set(10, 5, 42)

      expect(components.has(10, 5)).toBeTruthy()
      expect(components.get(10, 5)).toBe(42)
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set([5]))
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set([10]))
    })
  })

  describe('#delete', function () {
    it('remove a component from the index', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      components.set(10, 5, 23)

      expect(components.has(10, 5)).toBeTruthy()
      expect(components.get(10, 5)).toBe(23)
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set([5]))
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set([10]))

      components.delete(10, 5)

      expect(components.has(10, 5)).toBeFalsy()
      expect(components.get(10, 5)).toBeUndefined()
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set())
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set())
    })

    it('does nothing if you remove a component multiple times', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      components.set(10, 5, 23)

      expect(components.has(10, 5)).toBeTruthy()
      expect(components.get(10, 5)).toBe(23)
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set([5]))
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set([10]))

      components.delete(10, 5)
      components.delete(10, 5)

      expect(components.has(10, 5)).toBeFalsy()
      expect(components.get(10, 5)).toBeUndefined()
      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set())
      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set())
    })
  })

  describe('#get', function () {
    it('returns undefined if the requested component does not exists', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      expect(components.get(10, 5)).toBeUndefined()
    })

    it('return the requested component if it exists', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      components.set(10, 5, 23)

      expect(components.get(10, 5)).toBe(23)
    })
  })

  describe('#has', function () {
    it('returns false if the requested components does not exists', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      expect(components.has(10, 5)).toBeFalsy()
    })

    it('return true if the requested component exists', function () {
      const components : ComponentIndex = new ComponentIndex(200, 20)

      components.set(10, 5, 23)

      expect(components.has(10, 5)).toBeTruthy()
    })
  })

  describe('#getTypesOfEntity', function () {
    it('returns all types of a given entity', function () {
      const components : ComponentIndex = new ComponentIndex(200, 30)

      components.set(10, 5, 23)
      components.set(10, 5, 42)
      components.set(10, 3, 42)
      components.set(10, 13, 42)
      components.set(10, 28, 42)
      components.set(10, 10, 42)

      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set([
        5, 3, 13, 28, 10
      ]))
    })

    it('return an empty collection if the given entity does not have any components', function () {
      const components : ComponentIndex = new ComponentIndex(200, 30)

      expect(new Set(components.getTypesOfEntity(10))).toEqual(new Set())
    })
  })

  describe('#getEntitiesWithType', function () {
    it('returns all entities with a given type', function () {
      const components : ComponentIndex = new ComponentIndex(200, 30)

      components.set(10, 5, 23)
      components.set(12, 5, 42)
      components.set(168, 5, 42)
      components.set(8, 5, 42)
      components.set(32, 5, 42)

      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set([
        10, 12, 168, 8, 32
      ]))
    })

    it('return an empty collection if the given entity does not have any components', function () {
      const components : ComponentIndex = new ComponentIndex(200, 30)

      expect(new Set(components.getEntitiesWithType(5))).toEqual(new Set())
    })
  })

  describe('#clear', function () {
    it('empty the index', function () {
      const components : ComponentIndex = new ComponentIndex(200, 30)

      components.set(10, 5, 23)
      components.set(12, 5, 42)
      components.set(168, 5, 42)
      components.set(8, 5, 42)
      components.set(32, 5, 42)

      const empty : ComponentIndex = new ComponentIndex(200, 30)

      expect(components.equals(empty)).toBeFalsy()

      components.clear()

      expect(components.equals(empty)).toBeTruthy()
    })
  })

  describe('#reallocate', function () {
    it('expand the index', function () {
      const components : ComponentIndex = new ComponentIndex(40, 20)

      components.set(10, 5, 23)
      components.set(12, 5, 42)
      components.set(38, 5, 42)
      components.set(8, 5, 42)
      components.set(32, 5, 42)

      const expected : ComponentIndex = new ComponentIndex(120, 80)

      expected.set(10, 5, 23)
      expected.set(12, 5, 42)
      expected.set(38, 5, 42)
      expected.set(8, 5, 42)
      expected.set(32, 5, 42)

      expect(components.equals(expected)).toBeFalsy()

      components.reallocate(120, 80)

      expect(components.equals(expected)).toBeTruthy()
    })

    it('reduce the index', function () {
      const components : ComponentIndex = new ComponentIndex(40, 20)

      components.set(10, 5, 23)
      components.set(12, 5, 42)
      components.set(20, 5, 42)
      components.set(8, 5, 42)
      components.set(18, 5, 42)

      const expected : ComponentIndex = new ComponentIndex(30, 10)

      expected.set(10, 5, 23)
      expected.set(12, 5, 42)
      expected.set(20, 5, 42)
      expected.set(8, 5, 42)
      expected.set(18, 5, 42)

      expect(components.equals(expected)).toBeFalsy()

      components.reallocate(30, 10)

      expect(components.equals(expected)).toBeTruthy()
    })

    it('may remove components from the index if necessary', function () {
      const components : ComponentIndex = new ComponentIndex(40, 20)

      components.set(10, 1, 23)
      components.set(12, 2, 42)
      components.set(20, 3, 42)
      components.set(8, 4, 42)
      components.set(18, 5, 42)

      const expected : ComponentIndex = new ComponentIndex(20, 4)

      expected.set(10, 1, 23)
      expected.set(12, 2, 42)

      expect(components.equals(expected)).toBeFalsy()

      components.reallocate(20, 4)

      expect(components.equals(expected)).toBeTruthy()
    })
  })

  describe('#equals', function () {
    it('can be compared to any other kind of objects', function () {
      const components : ComponentIndex = new ComponentIndex(50, 30)

      components.set(10, 5, 23)
      components.set(10, 8, 22)
      components.set(12, 5, 42)
      components.set(8, 12, 33)
      components.set(32, 20, 56)

      expect(components.equals(true)).toBeFalsy()
      expect(components.equals(5)).toBeFalsy()
      expect(components.equals(null)).toBeFalsy()
    })

    it('can be compared to itself', function () {
      const components : ComponentIndex = new ComponentIndex(50, 30)

      components.set(10, 5, 23)
      components.set(10, 8, 22)
      components.set(12, 5, 42)
      components.set(8, 12, 33)
      components.set(32, 20, 56)

      expect(components.equals(components)).toBeTruthy()
    })

    it('returns true if it is compared to a copy of itself', function () {
      const components : ComponentIndex = new ComponentIndex(50, 30)

      components.set(10, 5, 23)
      components.set(10, 8, 22)
      components.set(12, 5, 42)
      components.set(8, 12, 33)
      components.set(32, 20, 56)

      const copy : ComponentIndex = new ComponentIndex(50, 30)

      copy.set(10, 5, 23)
      copy.set(10, 8, 22)
      copy.set(12, 5, 42)
      copy.set(8, 12, 33)
      copy.set(32, 20, 56)

      expect(components.equals(copy)).toBeTruthy()
    })

    it('returns false if the compared index handle more entities', function () {
      const components : ComponentIndex = new ComponentIndex(50, 30)

      components.set(10, 5, 23)
      components.set(10, 8, 22)
      components.set(12, 5, 42)
      components.set(8, 12, 33)
      components.set(32, 20, 56)

      const copy : ComponentIndex = new ComponentIndex(62, 30)

      copy.set(10, 5, 23)
      copy.set(10, 8, 22)
      copy.set(12, 5, 42)
      copy.set(8, 12, 33)
      copy.set(32, 20, 56)

      expect(components.equals(copy)).toBeFalsy()
    })

    it('returns false if the compared index handle more types', function () {
      const components : ComponentIndex = new ComponentIndex(50, 30)

      components.set(10, 5, 23)
      components.set(10, 8, 22)
      components.set(12, 5, 42)
      components.set(8, 12, 33)
      components.set(32, 20, 56)

      const copy : ComponentIndex = new ComponentIndex(50, 50)

      copy.set(10, 5, 23)
      copy.set(10, 8, 22)
      copy.set(12, 5, 42)
      copy.set(8, 12, 33)
      copy.set(32, 20, 56)

      expect(components.equals(copy)).toBeFalsy()
    })

    it('returns false if the compared index is different', function () {
      const components : ComponentIndex = new ComponentIndex(50, 30)

      components.set(10, 5, 23)
      components.set(10, 8, 22)
      components.set(12, 5, 42)
      components.set(8, 12, 33)
      components.set(32, 20, 56)

      const copy : ComponentIndex = new ComponentIndex(50, 30)

      copy.set(10, 5, 23)
      copy.set(10, 8, 22)
      copy.set(12, 5, 18)
      copy.set(8, 12, 33)
      copy.set(32, 20, 56)

      expect(components.equals(copy)).toBeFalsy()
    })

    it('returns false if the compared index is bigger', function () {
      const components : ComponentIndex = new ComponentIndex(50, 30)

      components.set(10, 5, 23)
      components.set(10, 8, 22)
      components.set(12, 5, 42)
      components.set(8, 12, 33)

      const copy : ComponentIndex = new ComponentIndex(50, 30)

      copy.set(10, 5, 23)
      copy.set(10, 8, 22)
      copy.set(12, 5, 42)
      copy.set(8, 12, 33)
      copy.set(32, 20, 56)

      expect(components.equals(copy)).toBeFalsy()
    })
  })
})
