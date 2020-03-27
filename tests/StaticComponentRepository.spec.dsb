/** eslint-env jest */

import {
  StaticComponentRepository
} from '../src/ts/components/StaticComponentRepository'

describe('StaticComponentRepository', function () {
  describe('#constructor', function () {
    it('create a new empty component repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository()
      )

      expect(components.size).toBe(0)
      expect(components.capacity).toBe(2048)
      expect([...components]).toEqual([])
    })

    it('allows to define the initial capacity of the component repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(256)
      )

      expect(components.size).toBe(0)
      expect(components.capacity).toBe(256)
      expect([...components]).toEqual([])
    })
  })

  describe('#create', function () {
    it('create a new empty component repository', function () {
      const components : StaticComponentRepository = (
        StaticComponentRepository.create()
      )

      expect(components.size).toBe(0)
      expect(components.capacity).toBe(2048)
      expect([...components]).toEqual([])
    })

    it('allows to specify the initial capacity of the component repository', function () {
      const components : StaticComponentRepository = (
        StaticComponentRepository.create(256)
      )

      expect(components.size).toBe(0)
      expect(components.capacity).toBe(256)
      expect([...components]).toEqual([])
    })
  })

  describe('#copy', function () {
    it('copy an existing component repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      const copy : StaticComponentRepository = (
        StaticComponentRepository.copy(components)
      )

      expect(components.equals(copy)).toBeTruthy()
      expect(components === copy).toBeFalsy()
    })
  })

  describe('#reallocate', function () {
    it('augment the capacity of the repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})
      components.add(8, 22, 3, {})
      components.add(9, 32, 8, {})

      const muted : StaticComponentRepository = (
        StaticComponentRepository.copy(components)
      )

      expect(muted.capacity).toBe(10)

      muted.reallocate(30)

      expect(muted.capacity).toBe(30)
      expect(components.equals(muted)).toBeTruthy()
    })

    it('reduce the capacity of the repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})
      components.add(8, 22, 3, {})
      components.add(9, 32, 8, {})

      const muted : StaticComponentRepository = (
        StaticComponentRepository.copy(components)
      )

      expect(muted.capacity).toBe(30)

      muted.reallocate(10)

      expect(muted.capacity).toBe(10)
      expect(components.equals(muted)).toBeTruthy()
    })

    it('remove components if it is necessary', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      const instances : [number, number, number, any][] = [
        [3, 26, 6, {}],
        [4, 26, 4, {}],
        [5, 32, 3, {}],
        [8, 22, 3, {}],
        [9, 32, 8, {}]
      ]

      for (const instance of instances) components.add(...instance)

      expect(components.capacity).toBe(10)
      expect(components.size).toBe(5)

      components.reallocate(6)

      expect(components.capacity).toBe(6)
      expect(components.size).toBe(3)

      for (const [identifier, entity, type, instance] of instances) {
        expect(components.has(identifier)).toBe(identifier < 6)
        expect(components.getComponentOfInstance(instance)).toBe(
          identifier < 6 ? identifier : undefined
        )
      }
    })
  })

  describe('#get', function () {
    it('return the nth component', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})
      components.add(8, 22, 3, {})
      components.add(9, 32, 8, {})

      const itered = new Set<number>()

      for (let identifier = 0; identifier < components.size; ++identifier) {
        itered.add(components.get(identifier))
      }

      expect(itered).toEqual(new Set<number>([3, 4, 5, 8, 9]))
    })
  })

  describe('#getEntityOfComponent', function () {
    it('return the parent entity of the given component', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})
      components.add(8, 22, 3, {})
      components.add(9, 32, 8, {})

      expect([
        components.getEntityOfComponent(3),
        components.getEntityOfComponent(4),
        components.getEntityOfComponent(5),
        components.getEntityOfComponent(8),
        components.getEntityOfComponent(9)
      ]).toEqual([26, 26, 32, 22, 32])
    })
  })

  describe('#getTypeOfComponent', function () {
    it('return the type of a given component', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})
      components.add(8, 22, 3, {})
      components.add(9, 32, 8, {})

      expect([
        components.getTypeOfComponent(3),
        components.getTypeOfComponent(4),
        components.getTypeOfComponent(5),
        components.getTypeOfComponent(8),
        components.getTypeOfComponent(9)
      ]).toEqual([6, 4, 3, 3, 8])
    })
  })

  describe('#getInstanceOfComponent', function () {
    it('return the instance of a given component', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      const instances : any[] = [{}, {}, {}, {}, {}]

      components.add(3, 26, 6, instances[0])
      components.add(4, 26, 4, instances[1])
      components.add(5, 32, 3, instances[2])
      components.add(8, 22, 3, instances[3])
      components.add(9, 32, 8, instances[4])

      expect([
        components.getInstanceOfComponent(3),
        components.getInstanceOfComponent(4),
        components.getInstanceOfComponent(5),
        components.getInstanceOfComponent(8),
        components.getInstanceOfComponent(9)
      ]).toEqual(instances)
    })
  })

  describe('#getComponentOfInstance', function () {
    it('return the component of the given instance', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      const instances : [number, number, number, any][] = [
        [3, 26, 6, {}],
        [4, 26, 4, {}],
        [5, 32, 3, {}],
        [8, 22, 3, {}],
        [9, 32, 8, {}]
      ]

      for (const instance of instances) components.add(...instance)

      for (const [identifier, entity, type, instance] of instances) {
        expect(components.getComponentOfInstance(instance)).toBe(identifier)
      }
    })
  })

  describe('#has', function () {
    it('return true if the given component exists into the repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})
      components.add(8, 22, 3, {})
      components.add(9, 32, 8, {})

      for (let identifier = 0; identifier < 10; ++identifier) {
        expect(components.has(identifier)).toBe(
          [3, 4, 5, 8, 9].indexOf(identifier) >= 0
        )
      }
    })
  })

  describe('#add', function () {
    it('add a component to the repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      expect(components.size).toBe(0)
      expect(new Set(components)).toEqual(new Set([]))

      components.add(3, 26, 6, {})

      expect(components.size).toBe(1)
      expect(new Set(components)).toEqual(new Set([3]))

      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})
      components.add(8, 22, 3, {})
      components.add(9, 32, 8, {})

      expect(components.size).toBe(5)
      expect(new Set(components)).toEqual(new Set([3, 4, 5, 8, 9]))
    })

    it('does nothing if a component is added twice', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(9, 32, 8, {})

      expect(components.size).toBe(3)
      expect(new Set(components)).toEqual(new Set([3, 4, 9]))

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(9, 32, 8, {})

      expect(components.size).toBe(3)
      expect(new Set(components)).toEqual(new Set([3, 4, 9]))
    })
  })

  describe('#delete', function () {
    it('remove a component from the repository by using its identifier', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      const instances : any[] = [{}, {}, {}, {}, {}]

      components.add(3, 26, 6, instances[0])
      components.add(4, 26, 4, instances[1])
      components.add(5, 32, 3, instances[2])
      components.add(8, 22, 3, instances[3])
      components.add(9, 32, 8, instances[4])

      expect(components.size).toBe(5)
      expect(new Set(components)).toEqual(new Set([3, 4, 5, 8, 9]))
      expect(components.getComponentOfInstance(instances[3])).toBe(8)

      components.delete(8)

      expect(components.size).toBe(4)
      expect(new Set(components)).toEqual(new Set([3, 4, 5, 9]))
      expect(components.getComponentOfInstance(instances[3])).toBeUndefined()
    })

    it('does nothing if a given component is deleted twice', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      const instances : any[] = [{}, {}, {}, {}, {}]

      components.add(3, 26, 6, instances[0])
      components.add(4, 26, 4, instances[1])
      components.add(5, 32, 3, instances[2])
      components.add(8, 22, 3, instances[3])
      components.add(9, 32, 8, instances[4])

      components.delete(8)

      expect(components.size).toBe(4)
      expect(new Set(components)).toEqual(new Set([3, 4, 5, 9]))
      expect(components.getComponentOfInstance(instances[3])).toBeUndefined()

      components.delete(8)

      expect(components.size).toBe(4)
      expect(new Set(components)).toEqual(new Set([3, 4, 5, 9]))
      expect(components.getComponentOfInstance(instances[3])).toBeUndefined()
    })
  })

  describe('#clear', function () {
    it('empty a given repository', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(30)
      )

      const instances : any[] = [{}, {}, {}, {}, {}]

      components.add(3, 26, 6, instances[0])
      components.add(4, 26, 4, instances[1])
      components.add(5, 32, 3, instances[2])
      components.add(8, 22, 3, instances[3])
      components.add(9, 32, 8, instances[4])

      expect(components.size).toBe(5)
      expect(new Set(components)).toEqual(new Set([3, 4, 5, 8, 9]))

      components.clear()

      expect(components.size).toBe(0)
      expect(new Set(components)).toEqual(new Set([]))

      for (const instance of instances) {
        expect(components.getComponentOfInstance(instance)).toBeUndefined()
      }
    })
  })

  describe('#equals', function () {
    it('can be compared to any object type', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})

      expect(components.equals(5)).toBeFalsy()
      expect(components.equals(false)).toBeFalsy()
      expect(components.equals({})).toBeFalsy()
    })

    it('can be compared to null', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})

      expect(components.equals(null)).toBeFalsy()
    })

    it('can be compared to itself', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})

      expect(components.equals(components)).toBeTruthy()
    })

    it('return true if it is compared to a copy', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      const instances : any[] = [{}, {}, {}]

      components.add(3, 26, 6, instances[0])
      components.add(4, 26, 4, instances[1])
      components.add(5, 32, 3, instances[1])

      const copy : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      copy.add(3, 26, 6, instances[0])
      copy.add(4, 26, 4, instances[1])
      copy.add(5, 32, 3, instances[1])

      expect(components.equals(copy)).toBeTruthy()
    })

    it('return false if it is compared to a repository with more components', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})

      const bigger : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      bigger.add(3, 26, 6, {})
      bigger.add(4, 26, 4, {})
      bigger.add(5, 32, 3, {})
      bigger.add(8, 32, 5, {})

      expect(components.equals(bigger)).toBeFalsy()
    })

    it('return false if it is compared to a repository with different components', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      components.add(3, 26, 6, {})
      components.add(4, 26, 4, {})
      components.add(5, 32, 3, {})

      const different : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      different.add(3, 26, 6, {})
      different.add(5, 32, 3, {})
      different.add(8, 32, 5, {})

      expect(components.equals(different)).toBeFalsy()
    })

    it('return true if it is compared to a repository with a different capacity but with same components', function () {
      const components : StaticComponentRepository = (
        new StaticComponentRepository(10)
      )

      const instances : any[] = [{}, {}, {}]

      components.add(3, 26, 6, instances[0])
      components.add(4, 26, 4, instances[1])
      components.add(5, 32, 3, instances[1])

      const upperCapacity : StaticComponentRepository = (
        new StaticComponentRepository(20)
      )

      upperCapacity.add(3, 26, 6, instances[0])
      upperCapacity.add(4, 26, 4, instances[1])
      upperCapacity.add(5, 32, 3, instances[1])

      expect(components.equals(upperCapacity)).toBeTruthy()
    })
  })
})
