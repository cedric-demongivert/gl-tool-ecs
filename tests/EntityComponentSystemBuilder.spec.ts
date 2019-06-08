/** eslint-env jest */

import {
  EntityComponentSystemBuilder
} from '../src/ts/EntityComponentSystemBuilder'

import {
  EntityComponentSystem
} from '../src/ts/EntityComponentSystem'

describe('EntityComponentSystemBuilder', function () {
  describe('#constructor', function () {
    it('create a new default entity-component-system builder', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.entities).toBe(1024)
      expect(builder.tags).toBe(16)
      expect(builder.types).toBe(256)
      expect(builder.components).toBe(4096)
    })
  })

  describe('#set entities', function () {
    it('update the entity capacity of the entity-component-system to build', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.entities).toBe(1024)

      builder.entities = 2000

      expect(builder.entities).toBe(2000)
    })
  })

  describe('#set tags', function () {
    it('update the tag capacity of the entity-component-system to build', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.tags).toBe(16)

      builder.tags = 168

      expect(builder.tags).toBe(168)
    })
  })

  describe('#set types', function () {
    it('update the type capacity of the entity-component-system to build', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.types).toBe(256)

      builder.types = 1548

      expect(builder.types).toBe(1548)
    })
  })

  describe('#set components', function () {
    it('update the component capacity of the entity-component-system to build', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.components).toBe(4096)

      builder.components = 456

      expect(builder.components).toBe(456)
    })
  })

  describe('#build', function () {
    it('instanciate the described entity-component-system', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      const result : EntityComponentSystem = builder.build()

      expect(result.capacity.entities).toBe(builder.entities)
      expect(result.capacity.tags).toBe(builder.tags)
      expect(result.capacity.types).toBe(builder.types)
      expect(result.capacity.components).toBe(builder.components)
    })
  })

  describe('#equals', function () {
    it('can be compared to any other object type', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.equals(null)).toBeFalsy()
      expect(builder.equals(128)).toBeFalsy()
      expect(builder.equals("azeaze")).toBeFalsy()
      expect(builder.equals(true)).toBeFalsy()
    })

    it('can be compared to itself', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.equals(builder)).toBeTruthy()
    })

    it('can be compared to a copy', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      const copy : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      expect(builder.equals(copy)).toBeTruthy()
    })

    it('return false if it is compared to a different builder', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      const different : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      different.entities = 126
      expect(builder.equals(different)).toBeFalsy()

      different.entities = builder.entities
      different.tags = 26
      expect(builder.equals(different)).toBeFalsy()

      different.tags = builder.tags
      different.types = 144
      expect(builder.equals(different)).toBeFalsy()

      different.types = builder.types
      different.components = 5364
      expect(builder.equals(different)).toBeFalsy()
    })
  })
})
