/** eslint-env jest */

import { StaticTypeRepository } from '../src/ts/types/StaticTypeRepository'
import { TypeHandler } from '../src/ts/types/TypeHandler'
import { createTypeHandler } from './mocks/createTypeHandler'

const OBJECT_HANDLER : TypeHandler = createTypeHandler()
const NUMBER_HANDLER : TypeHandler = createTypeHandler()
const ARRAY_HANDLER : TypeHandler = createTypeHandler()
const STRING_HANDLER : TypeHandler = createTypeHandler()
const DATE_HANDLER : TypeHandler = createTypeHandler()
const BOOLEAN_HANDLER : TypeHandler = createTypeHandler()

describe('StaticTypeRepository', function () {
  describe('#constructor', function () {
    it('create a new empty type repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository()

      expect(types.size).toBe(0)
      expect(types.capacity).toBe(128)
      expect([...types]).toEqual([])
    })

    it('allows to specify the initial capacity of the type repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(256)

      expect(types.size).toBe(0)
      expect(types.capacity).toBe(256)
      expect([...types]).toEqual([])
    })
  })

  describe('#create', function () {
    it('create a new empty type repository', function () {
      const types : StaticTypeRepository = StaticTypeRepository.create()

      expect(types.size).toBe(0)
      expect(types.capacity).toBe(128)
      expect([...types]).toEqual([])
    })

    it('allows to specify the initial capacity of the type repository', function () {
      const types : StaticTypeRepository = StaticTypeRepository.create(256)

      expect(types.size).toBe(0)
      expect(types.capacity).toBe(256)
      expect([...types]).toEqual([])
    })
  })

  describe('#copy', function () {
    it('copy an existing type repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.create(OBJECT_HANDLER)
      types.create(ARRAY_HANDLER)
      types.create(NUMBER_HANDLER)

      const copy : StaticTypeRepository = (
        StaticTypeRepository.copy(types)
      )

      expect(types.equals(copy)).toBeTruthy()
      expect(types === copy).toBeFalsy()

      types.clear()
      copy.clear()
    })
  })

  describe('#reallocate', function () {
    it('augment the capacity of the repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.create(OBJECT_HANDLER)
      types.create(ARRAY_HANDLER)
      types.create(NUMBER_HANDLER)

      const muted : StaticTypeRepository = StaticTypeRepository.copy(types)

      expect(muted.capacity).toBe(10)

      muted.reallocate(30)

      expect(muted.capacity).toBe(30)
      expect(types.equals(muted)).toBeTruthy()
    })

    it('reduce the capacity of the repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(30)

      types.create(OBJECT_HANDLER)
      types.create(ARRAY_HANDLER)
      types.create(NUMBER_HANDLER)

      const muted : StaticTypeRepository = StaticTypeRepository.copy(types)

      expect(muted.capacity).toBe(30)

      muted.reallocate(10)

      expect(muted.capacity).toBe(10)
      expect(types.equals(muted)).toBeTruthy()
    })

    it('remove types if it is necessary', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(30)

      const handlers : TypeHandler[] = [
        OBJECT_HANDLER,
        ARRAY_HANDLER,
        NUMBER_HANDLER,
        BOOLEAN_HANDLER,
        DATE_HANDLER,
        STRING_HANDLER
      ]

      const identifiers : number[] = handlers.map(x => types.create(x))

      expect(types.capacity).toBe(30)
      expect(types.size).toBe(handlers.length)
      types.reallocate(3)

      expect(types.capacity).toBe(3)
      expect(types.size).toBe(3)

      for (let index = 0; index < handlers.length; ++index) {
        expect(types.hasHandler(handlers[index])).toBe(identifiers[index] < 3)
      }
    })
  })

  describe('#get', function () {
    it('return the nth type', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      const itered = new Set<number>()

      for (let identifier = 0; identifier < types.size; ++identifier) {
        itered.add(types.get(identifier))
      }

      expect(itered).toEqual(new Set<number>([5, 3, 8, 1]))

      types.clear()
    })
  })

  describe('#getTypeOfHandler', function () {
    it('return the type identifier of a given handler', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      expect([
        types.getTypeOfHandler(OBJECT_HANDLER),
        types.getTypeOfHandler(ARRAY_HANDLER),
        types.getTypeOfHandler(NUMBER_HANDLER),
        types.getTypeOfHandler(STRING_HANDLER)
      ]).toEqual([5, 3, 8, 1])

      types.clear()
    })
  })

  describe('#getHandlerOfType', function () {
    it('return the handler of a given type', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      expect([
        types.getHandlerOfType(5),
        types.getHandlerOfType(3),
        types.getHandlerOfType(8),
        types.getHandlerOfType(1)
      ]).toEqual([OBJECT_HANDLER, ARRAY_HANDLER, NUMBER_HANDLER, STRING_HANDLER])

      types.clear()
    })
  })

  describe('#has', function () {
    it('return true if the given type exists into the repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      for (let identifier = 0; identifier < 10; ++identifier) {
        expect(types.has(identifier)).toBe(
          identifier === 5 || identifier === 3 || identifier === 8 ||
          identifier === 1
        )
      }

      types.clear()
    })
  })

  describe('#hasHandler', function () {
    it('return true if the given handler is registered into this repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      expect(types.hasHandler(OBJECT_HANDLER)).toBeTruthy()
      expect(types.hasHandler(ARRAY_HANDLER)).toBeTruthy()
      expect(types.hasHandler(NUMBER_HANDLER)).toBeTruthy()
      expect(types.hasHandler(STRING_HANDLER)).toBeTruthy()

      expect(types.hasHandler(DATE_HANDLER)).toBeFalsy()
      expect(types.hasHandler(BOOLEAN_HANDLER)).toBeFalsy()

      types.clear()
    })
  })

  describe('#create', function () {
    it('allows to create new types into the repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      expect(types.size).toBe(0)

      const objectType : number = types.create(OBJECT_HANDLER)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([objectType])
      expect(types.getHandlerOfType(objectType)).toBe(OBJECT_HANDLER)

      for (const handler of [ARRAY_HANDLER, NUMBER_HANDLER, STRING_HANDLER]) {
        types.create(handler)
      }

      expect(types.size).toBe(4)
      expect(types.hasHandler(ARRAY_HANDLER)).toBeTruthy()
      expect(types.hasHandler(NUMBER_HANDLER)).toBeTruthy()
      expect(types.hasHandler(STRING_HANDLER)).toBeTruthy()
      expect(new Set(types).size).toBe(4)

      types.clear()
    })

    it('does nothing if the same handler is added twice', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      expect(types.size).toBe(0)

      const objectType : number = types.create(OBJECT_HANDLER)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([objectType])
      expect(types.getHandlerOfType(objectType)).toBe(OBJECT_HANDLER)

      types.create(OBJECT_HANDLER)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([objectType])
      expect(types.getHandlerOfType(objectType)).toBe(OBJECT_HANDLER)

      types.clear()
    })
  })

  describe('#delete', function () {
    it('remove a type from the repository by using its identifier', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      expect(types.size).toBe(4)
      expect(new Set(types)).toEqual(new Set([5, 3, 8, 1]))
      expect(types.hasHandler(ARRAY_HANDLER)).toBeTruthy()

      types.delete(3)

      expect(types.size).toBe(3)
      expect(new Set(types)).toEqual(new Set([5, 8, 1]))
      expect(types.hasHandler(ARRAY_HANDLER)).toBeFalsy()

      types.clear()
    })

    it('does nothing if a given type is deleted twice', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      expect(types.size).toBe(4)
      expect(new Set(types)).toEqual(new Set([5, 3, 8, 1]))
      expect(types.hasHandler(ARRAY_HANDLER)).toBeTruthy()

      types.delete(3)

      expect(types.size).toBe(3)
      expect(new Set(types)).toEqual(new Set([5, 8, 1]))
      expect(types.hasHandler(ARRAY_HANDLER)).toBeFalsy()

      types.delete(3)

      expect(types.size).toBe(3)
      expect(new Set(types)).toEqual(new Set([5, 8, 1]))
      expect(types.hasHandler(ARRAY_HANDLER)).toBeFalsy()

      types.clear()
    })
  })

  describe('#addHandlerAsType', function () {
    it('register a given type into the repository with the given handler', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      expect(types.size).toBe(0)
      expect([...types]).toEqual([])

      types.addHandlerAsType(OBJECT_HANDLER, 5)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([5])
      expect(types.getHandlerOfType(5)).toBe(OBJECT_HANDLER)

      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 2)
      types.addHandlerAsType(STRING_HANDLER, 9)

      expect(types.size).toBe(4)
      expect(new Set(types)).toEqual(new Set([5, 3, 2, 9]))
      expect(types.getHandlerOfType(5)).toBe(OBJECT_HANDLER)
      expect(types.getHandlerOfType(3)).toBe(ARRAY_HANDLER)
      expect(types.getHandlerOfType(2)).toBe(NUMBER_HANDLER)
      expect(types.getHandlerOfType(9)).toBe(STRING_HANDLER)

      types.clear()
    })

    it('move a type if the same handler is used twice', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      expect(types.size).toBe(0)
      expect([...types]).toEqual([])

      types.addHandlerAsType(OBJECT_HANDLER, 5)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([5])
      expect(types.getHandlerOfType(5)).toBe(OBJECT_HANDLER)

      types.addHandlerAsType(OBJECT_HANDLER, 6)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([6])
      expect(types.getHandlerOfType(5)).toBeNull()
      expect(types.getHandlerOfType(6)).toBe(OBJECT_HANDLER)

      types.clear()
    })

    it('remove an old type if a different handler is added with the same type', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      expect(types.size).toBe(0)
      expect([...types]).toEqual([])

      types.addHandlerAsType(OBJECT_HANDLER, 5)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([5])
      expect(types.getHandlerOfType(5)).toBe(OBJECT_HANDLER)

      types.addHandlerAsType(ARRAY_HANDLER, 5)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([5])
      expect(types.getHandlerOfType(5)).toBe(ARRAY_HANDLER)
      expect(types.hasHandler(OBJECT_HANDLER)).toBeFalsy()

      types.clear()
    })
  })

  describe('#addTypeWithHandler', function () {
    it('is an alias of addHandlerAsType', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      expect(types.size).toBe(0)
      expect([...types]).toEqual([])

      types.addTypeWithHandler(5, OBJECT_HANDLER)

      expect(types.size).toBe(1)
      expect([...types]).toEqual([5])
      expect(types.getHandlerOfType(5)).toBe(OBJECT_HANDLER)

      types.addTypeWithHandler(3, ARRAY_HANDLER)
      types.addTypeWithHandler(2, NUMBER_HANDLER)
      types.addTypeWithHandler(9, STRING_HANDLER)

      expect(types.size).toBe(4)
      expect(new Set(types)).toEqual(new Set([5, 3, 2, 9]))
      expect(types.getHandlerOfType(5)).toBe(OBJECT_HANDLER)
      expect(types.getHandlerOfType(3)).toBe(ARRAY_HANDLER)
      expect(types.getHandlerOfType(2)).toBe(NUMBER_HANDLER)
      expect(types.getHandlerOfType(9)).toBe(STRING_HANDLER)

      types.clear()
    })
  })

  describe('#clear', function () {
    it('empty a given repository', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)
      types.addHandlerAsType(STRING_HANDLER, 1)

      expect(types.size).toBe(4)
      expect(new Set(types)).toEqual(new Set([5, 3, 8, 1]))

      types.clear()

      expect(types.size).toBe(0)
      expect([...types]).toEqual([])
      expect(types.hasHandler(OBJECT_HANDLER)).toBeFalsy()
      expect(types.hasHandler(ARRAY_HANDLER)).toBeFalsy()
      expect(types.hasHandler(NUMBER_HANDLER)).toBeFalsy()
      expect(types.hasHandler(STRING_HANDLER)).toBeFalsy()
    })
  })

  describe('#equals', function () {
    it('can be compared to any object type', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)

      expect(types.equals(5)).toBeFalsy()
      expect(types.equals(false)).toBeFalsy()
      expect(types.equals({})).toBeFalsy()

      types.clear()
    })

    it('can be compared to null', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)

      expect(types.equals(null)).toBeFalsy()

      types.clear()
    })

    it('can be compared to itself', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)

      expect(types.equals(types)).toBeTruthy()

      types.clear()
    })

    it('return true if it is compared to a copy', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)

      const copy : StaticTypeRepository = new StaticTypeRepository(10)

      copy.addHandlerAsType(OBJECT_HANDLER, 5)
      copy.addHandlerAsType(ARRAY_HANDLER, 3)
      copy.addHandlerAsType(NUMBER_HANDLER, 8)

      expect(types.equals(copy)).toBeTruthy()

      copy.clear()
      types.clear()
    })

    it('return false if it is compared to a manager with more relationships', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)

      const bigger : StaticTypeRepository = new StaticTypeRepository(10)

      bigger.addHandlerAsType(OBJECT_HANDLER, 5)
      bigger.addHandlerAsType(ARRAY_HANDLER, 3)
      bigger.addHandlerAsType(NUMBER_HANDLER, 8)
      bigger.addHandlerAsType(STRING_HANDLER, 1)

      expect(types.equals(bigger)).toBeFalsy()

      bigger.clear()
      types.clear()
    })

    it('return false if it is compared to a manager with different relationships', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)

      const different : StaticTypeRepository = new StaticTypeRepository(10)

      different.addHandlerAsType(OBJECT_HANDLER, 5)
      different.addHandlerAsType(ARRAY_HANDLER, 8)
      different.addHandlerAsType(NUMBER_HANDLER, 3)

      expect(types.equals(different)).toBeFalsy()

      different.clear()
      types.clear()
    })
  })

  describe('#iterator', function () {
    it('iterate over each registered type', function () {
      const types : StaticTypeRepository = new StaticTypeRepository(10)

      types.addHandlerAsType(OBJECT_HANDLER, 5)
      types.addHandlerAsType(ARRAY_HANDLER, 3)
      types.addHandlerAsType(NUMBER_HANDLER, 8)

      expect(new Set(types)).toEqual(new Set([5, 3, 8]))

      types.clear()
    })
  })
})
