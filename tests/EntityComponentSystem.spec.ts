/** eslint-env jest */

import {
  EntityComponentSystemBuilder
} from '../src/ts/EntityComponentSystemBuilder'

import { EntityComponentSystem } from '../src/ts/EntityComponentSystem'
import { System } from '../src/ts/systems/System'
import { TypeHandler } from '../src/ts/types/TypeHandler'
import { Collection } from '../src/ts/collection/Collection'

import { createSystem } from './mocks/createSystem'
import { createTypeHandler } from './mocks/createTypeHandler'

describe('EntityComponentSystem', function () {
  describe('#constructor', function () {
    it('create a new entity-component-system from a builder', function () {
      const builder : EntityComponentSystemBuilder = (
        new EntityComponentSystemBuilder()
      )

      const ecs : EntityComponentSystem = new EntityComponentSystem(builder)

      expect(builder.entities).toBe(ecs.capacity.entities)
      expect(builder.tags).toBe(ecs.capacity.tags)
      expect(builder.types).toBe(ecs.capacity.types)
      expect(builder.components).toBe(ecs.capacity.components)
      expect(ecs.entities.size).toBe(0)
      expect(ecs.tags.size).toBe(0)
      expect(ecs.types.size).toBe(0)
      expect(ecs.components.size).toBe(0)
    })
  })

  const BUILDER : EntityComponentSystemBuilder = (
    new EntityComponentSystemBuilder()
  )

  BUILDER.entities = 100
  BUILDER.tags = 100
  BUILDER.types = 100
  BUILDER.components = 100

  describe('#createEntity', function () {
    it('create an entity and return it', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.entities)).toEqual(new Set())

      const entity : number = ecs.createEntity()

      expect(new Set(ecs.entities)).toEqual(new Set([entity]))
    })

    it('allows to create multiple entities', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.entities)).toEqual(new Set())

      const entities : Set<number> = new Set<number>()

      for (let index = 0; index < 10; ++index) {
        entities.add(ecs.createEntity())
      }

      expect(entities.size).toBe(10)
      expect(new Set(ecs.entities)).toEqual(entities)
    })

    it('does not recreate existing entities', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const existingEntities : Set<number> = new Set<number>(
        [5, 2, 1, 18, 17, 11]
      )

      for (const entity of existingEntities) {
        ecs.addEntity(entity)
      }

      expect(new Set(ecs.entities)).toEqual(existingEntities)

      for (let index = 0; index < 14; ++index) {
        existingEntities.add(ecs.createEntity())
      }

      expect(existingEntities.size).toBe(20)
      expect(new Set(ecs.entities)).toEqual(existingEntities)
    })

    it('can reallocated previously deleted entities', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const existingEntities : Set<number> = new Set<number>()

      for (let index = 0; index < 20; ++index) {
        existingEntities.add(ecs.createEntity())
      }

      ecs.deleteEntity(ecs.entities.get(10))
      ecs.createEntity()

      expect(new Set(ecs.entities)).toEqual(existingEntities)
    })

    it('do inform underlying systems of the creation', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      const entity : number = ecs.createEntity()

      expect(system.managerWillAddEntity).toHaveBeenCalledWith(entity)
      expect(system.managerDidAddEntity).toHaveBeenCalledWith(entity)
    })

    it('throw an error if you trying to add an entity beyond the capacity of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      for (let index = 0; index < ecs.capacity.entities; ++index) {
        ecs.createEntity()
      }

      expect(_ => ecs.createEntity()).toThrow()
    })
  })

  describe('#addEntity', function () {
    it('register a given entity into the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.entities)).toEqual(new Set())

      ecs.addEntity(26)

      expect(new Set(ecs.entities)).toEqual(new Set([26]))
    })

    it('allows to create multiple entities', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.entities)).toEqual(new Set())

      const entities : Set<number> = new Set([1, 32, 89, 65, 42])

      for (const entity of entities) {
        ecs.addEntity(entity)
      }

      expect(new Set(ecs.entities)).toEqual(entities)
    })

    it('do inform underlying systems of the creation', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addEntity(32)

      expect(system.managerWillAddEntity).toHaveBeenCalledWith(32)
      expect(system.managerDidAddEntity).toHaveBeenCalledWith(32)
    })

    it('throw an error if you trying to add an existing entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(25)

      expect(_ => ecs.addEntity(25)).toThrow()
    })

    it('throw an error if you trying to add an entity beyond the capacity of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(_ => ecs.addEntity(ecs.capacity.entities)).toThrow()
    })
  })

  describe('#hasEntity', function () {
    it('returns true if this entity-component-system contains the given entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(26)
      ecs.addEntity(5)
      ecs.addEntity(12)

      expect(ecs.hasEntity(26)).toBeTruthy()
      expect(ecs.hasEntity(5)).toBeTruthy()
      expect(ecs.hasEntity(12)).toBeTruthy()
    })

    it('returns true if this entity-component-system contains the given entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(26)
      ecs.addEntity(5)
      ecs.addEntity(12)

      expect(ecs.hasEntity(32)).toBeFalsy()
      expect(ecs.hasEntity(14)).toBeFalsy()
      expect(ecs.hasEntity(4)).toBeFalsy()
    })
  })

  describe('#deleteEntity', function () {
    it('remove an entity from the ecs', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(26)
      ecs.addEntity(5)
      ecs.addEntity(12)

      expect(new Set(ecs.entities)).toEqual(new Set([26, 5, 12]))

      ecs.deleteEntity(5)

      expect(new Set(ecs.entities)).toEqual(new Set([26, 12]))
    })

    it('throw an error if you trying to remove an entity that does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(26)
      ecs.addEntity(5)
      ecs.addEntity(12)

      expect(_ => ecs.deleteEntity(32)).toThrow()
    })

    it('inform underlying systems of the deletion', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addEntity(32)
      ecs.deleteEntity(32)

      expect(system.managerWillDeleteEntity).toHaveBeenCalledWith(32)
      expect(system.managerDidDeleteEntity).toHaveBeenCalledWith(32)
    })

    it('remove entity tags', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      ecs.attachTagToEntity(12, 23)
      ecs.attachTagToEntity(12, 12)
      ecs.attachTagToEntity(3, 12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([12, 23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))

      ecs.deleteEntity(12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set())
    })

    it('remove entity components', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentTypeA : TypeHandler = createTypeHandler()
      const ComponentTypeB : TypeHandler = createTypeHandler()
      const ComponentTypeC : TypeHandler = createTypeHandler()

      ecs.createType(ComponentTypeA)
      ecs.createType(ComponentTypeB)
      ecs.createType(ComponentTypeC)
      ecs.addEntity(23)
      ecs.addEntity(12)

      const a12 : number = ecs.createComponent(12, ComponentTypeA)
      const b12 : number = ecs.createComponent(12, ComponentTypeB)
      const c12 : number = ecs.createComponent(12, ComponentTypeC)
      const a23 : number = ecs.createComponent(23, ComponentTypeB)
      const b23 : number = ecs.createComponent(23, ComponentTypeC)

      expect(new Set(ecs.components)).toEqual(
        new Set([a12, b12, c12, a23, b23])
      )

      ecs.deleteEntity(12)

      expect(new Set(ecs.components)).toEqual(
        new Set([a23, b23])
      )
    })

    it('move back the entity cursor if necessary', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      for (let index = 0; index < 20; ++index) {
        ecs.createEntity()
      }

      const deleted : number = ecs.entities.get(5)
      ecs.deleteEntity(deleted)

      expect(ecs.createEntity()).toBe(deleted)
    })
  })

  describe('#getEntitiesWithTag', function () {
    it('return a view over all entities with the given tag', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(25)
      ecs.addEntity(21)
      ecs.addEntity(13)

      ecs.addTag(12)
      ecs.addTag(5)

      const entitiesWithTag12 : Collection<number> = ecs.getEntitiesWithTag(12)
      const entitiesWithTag5 : Collection<number> = ecs.getEntitiesWithTag(5)

      ecs.attachTagToEntity(5, 25)
      ecs.attachTagToEntity(5, 13)
      ecs.attachTagToEntity(12, 21)
      ecs.attachTagToEntity(12, 25)

      expect(new Set(entitiesWithTag12)).toEqual(new Set([21, 25]))
      expect(new Set(entitiesWithTag5)).toEqual(new Set([25, 13]))
    })
  })

  describe('#getEntitiesWithType', function () {
    it('return a view over all entities with a component of a given type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentTypeA : TypeHandler = createTypeHandler()
      const ComponentTypeB : TypeHandler = createTypeHandler()
      const ComponentTypeC : TypeHandler = createTypeHandler()

      ecs.addEntity(25)
      ecs.addEntity(21)
      ecs.addEntity(13)

      ecs.createType(ComponentTypeA)
      ecs.createType(ComponentTypeB)
      ecs.createType(ComponentTypeC)

      const entitiesWithTypeA : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeA)
      )
      const entitiesWithTypeB : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeB)
      )
      const entitiesWithTypeC : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeC)
      )

      ecs.createComponent(25, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeB)
      ecs.createComponent(21, ComponentTypeC)
      ecs.createComponent(13, ComponentTypeA)
      ecs.createComponent(13, ComponentTypeC)

      expect(new Set(entitiesWithTypeA)).toEqual(new Set([21, 25, 13]))
      expect(new Set(entitiesWithTypeB)).toEqual(new Set([21]))
      expect(new Set(entitiesWithTypeC)).toEqual(new Set([13, 21]))
    })
  })

  describe('#getEntitiesWithTypeIdentifier', function () {
    it('return a view over all entities with a component of a given type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentTypeA : TypeHandler = createTypeHandler()
      const ComponentTypeB : TypeHandler = createTypeHandler()
      const ComponentTypeC : TypeHandler = createTypeHandler()

      ecs.addEntity(25)
      ecs.addEntity(21)
      ecs.addEntity(13)

      const typeA : number = ecs.createType(ComponentTypeA)
      const typeB : number = ecs.createType(ComponentTypeB)
      const typeC : number = ecs.createType(ComponentTypeC)

      const entitiesWithTypeA : Collection<number> = (
        ecs.getEntitiesWithTypeIdentifier(typeA)
      )
      const entitiesWithTypeB : Collection<number> = (
        ecs.getEntitiesWithTypeIdentifier(typeB)
      )
      const entitiesWithTypeC : Collection<number> = (
        ecs.getEntitiesWithTypeIdentifier(typeC)
      )

      ecs.createComponent(25, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeB)
      ecs.createComponent(21, ComponentTypeC)
      ecs.createComponent(13, ComponentTypeA)
      ecs.createComponent(13, ComponentTypeC)

      expect(new Set(entitiesWithTypeA)).toEqual(new Set([21, 25, 13]))
      expect(new Set(entitiesWithTypeB)).toEqual(new Set([21]))
      expect(new Set(entitiesWithTypeC)).toEqual(new Set([13, 21]))
    })
  })

  describe('#clearEntities', function () {
    it('apply deleteEntity over all entities of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.deleteEntity = jest.fn(ecs.deleteEntity.bind(ecs))

      ecs.addEntity(25)
      ecs.addEntity(21)
      ecs.addEntity(13)

      expect(new Set(ecs.entities)).toEqual(new Set([25, 21, 13]))

      ecs.clearEntities()

      expect(ecs.deleteEntity).toHaveBeenCalledWith(25)
      expect(ecs.deleteEntity).toHaveBeenCalledWith(21)
      expect(ecs.deleteEntity).toHaveBeenCalledWith(13)

      expect(new Set(ecs.entities)).toEqual(new Set())
    })
  })

  describe('#createTag', function () {
    it('create a tag and return it', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.tags)).toEqual(new Set())

      const tag : number = ecs.createTag()

      expect(new Set(ecs.tags)).toEqual(new Set([tag]))
    })

    it('allows to create multiple tags', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.tags)).toEqual(new Set())

      const tags : Set<number> = new Set<number>()

      for (let index = 0; index < 10; ++index) {
        tags.add(ecs.createTag())
      }

      expect(tags.size).toBe(10)
      expect(new Set(ecs.tags)).toEqual(tags)
    })

    it('does not recreate existing tags', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const existingTags : Set<number> = new Set<number>(
        [5, 2, 1, 18, 17, 11]
      )

      for (const tag of existingTags) {
        ecs.addTag(tag)
      }

      expect(new Set(ecs.tags)).toEqual(existingTags)

      for (let index = 0; index < 14; ++index) {
        existingTags.add(ecs.createTag())
      }

      expect(existingTags.size).toBe(20)
      expect(new Set(ecs.tags)).toEqual(existingTags)
    })

    it('can reallocate previously deleted tags', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const existingTags : Set<number> = new Set<number>()

      for (let index = 0; index < 20; ++index) {
        existingTags.add(ecs.createTag())
      }

      ecs.deleteTag(ecs.tags.get(10))
      ecs.createTag()

      expect(new Set(ecs.tags)).toEqual(existingTags)
    })

    it('do inform underlying systems of the creation', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      const tag : number = ecs.createTag()

      expect(system.managerWillAddTag).toHaveBeenCalledWith(tag)
      expect(system.managerDidAddTag).toHaveBeenCalledWith(tag)
    })

    it('throw an error if you trying to add a tag beyond the capacity of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      for (let index = 0; index < ecs.capacity.tags; ++index) {
        ecs.createTag()
      }

      expect(_ => ecs.createTag()).toThrow()
    })
  })

  describe('#addTag', function () {
    it('register a given tag into the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.tags)).toEqual(new Set())

      ecs.addTag(26)

      expect(new Set(ecs.tags)).toEqual(new Set([26]))
    })

    it('allows to create multiple tags', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.tags)).toEqual(new Set())

      const tags : Set<number> = new Set([1, 32, 89, 65, 42])

      for (const tag of tags) {
        ecs.addTag(tag)
      }

      expect(new Set(ecs.tags)).toEqual(tags)
    })

    it('do inform underlying systems of the creation', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addTag(32)

      expect(system.managerWillAddTag).toHaveBeenCalledWith(32)
      expect(system.managerDidAddTag).toHaveBeenCalledWith(32)
    })

    it('throw an error if you trying to add an existing tag', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addTag(25)

      expect(_ => ecs.addTag(25)).toThrow()
    })

    it('throw an error if you trying to add a tag beyond the capacity of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(_ => ecs.addTag(ecs.capacity.tags)).toThrow()
    })
  })

  describe('#hasTag', function () {
    it('returns true if this entity-component-system contains the given entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addTag(26)
      ecs.addTag(5)
      ecs.addTag(12)

      expect(ecs.hasTag(26)).toBeTruthy()
      expect(ecs.hasTag(5)).toBeTruthy()
      expect(ecs.hasTag(12)).toBeTruthy()
    })

    it('returns true if this entity-component-system contains the given tag', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addTag(26)
      ecs.addTag(5)
      ecs.addTag(12)

      expect(ecs.hasTag(32)).toBeFalsy()
      expect(ecs.hasTag(14)).toBeFalsy()
      expect(ecs.hasTag(4)).toBeFalsy()
    })
  })

  describe('#deleteTag', function () {
    it('remove a tag from the ecs', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addTag(26)
      ecs.addTag(5)
      ecs.addTag(12)

      expect(new Set(ecs.tags)).toEqual(new Set([26, 5, 12]))

      ecs.deleteTag(5)

      expect(new Set(ecs.tags)).toEqual(new Set([26, 12]))
    })

    it('throw an error if you trying to remove a tag that does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addTag(26)
      ecs.addTag(5)
      ecs.addTag(12)

      expect(_ => ecs.deleteTag(32)).toThrow()
    })

    it('inform underlying systems of the deletion', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addTag(32)
      ecs.deleteTag(32)

      expect(system.managerWillDeleteTag).toHaveBeenCalledWith(32)
      expect(system.managerDidDeleteTag).toHaveBeenCalledWith(32)
    })

    it('detach the tag from all of its entities', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      ecs.attachTagToEntity(12, 23)
      ecs.attachTagToEntity(12, 12)
      ecs.attachTagToEntity(3, 12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([12, 23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))

      ecs.deleteTag(12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set())
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))
    })

    it('move back the tag cursor if necessary', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      for (let index = 0; index < 20; ++index) {
        ecs.createTag()
      }

      const deleted : number = ecs.tags.get(5)
      ecs.deleteTag(deleted)

      expect(ecs.createTag()).toBe(deleted)
    })
  })

  describe('#attachTagToEntity', function () {
    it('attach a tag to an entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([]))

      ecs.attachTagToEntity(12, 23)
      ecs.attachTagToEntity(12, 12)
      ecs.attachTagToEntity(3, 12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([12, 23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))
    })

    it('throw an error if the tag to attach does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(_ => ecs.attachTagToEntity(25, 13)).toThrow()
    })

    it('throw an error if the entity to target does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(_ => ecs.attachTagToEntity(12, 25)).toThrow()
    })

    it('throw an error if you try to attach a tag to the same entity twice', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      ecs.attachTagToEntity(3, 23)

      expect(_ => ecs.attachTagToEntity(3, 23)).toThrow()
    })

    it('inform underlying systems', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addTag(32)
      ecs.addEntity(23)

      ecs.attachTagToEntity(32, 23)

      expect(system.managerWillAttachTagToEntity).toHaveBeenCalledWith(32, 23)
      expect(system.managerDidAttachTagToEntity).toHaveBeenCalledWith(32, 23)
    })
  })

  describe('#detachTagFromEntity', function () {
    it('detach a tag from an entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      ecs.attachTagToEntity(12, 23)
      ecs.attachTagToEntity(12, 12)
      ecs.attachTagToEntity(3, 12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([12, 23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))

      ecs.detachTagFromEntity(12, 23)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([12]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))
    })

    it('throw an error if the tag to detach does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(_ => ecs.detachTagFromEntity(25, 13)).toThrow()
    })

    it('throw an error if the entity to target does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(_ => ecs.detachTagFromEntity(12, 25)).toThrow()
    })

    it('throw an error if you try to detach a tag from an entity that do not have it', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(_ => ecs.detachTagFromEntity(3, 23)).toThrow()
    })

    it('inform underlying systems', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addTag(32)
      ecs.addEntity(23)

      ecs.attachTagToEntity(32, 23)
      ecs.detachTagFromEntity(32, 23)

      expect(system.managerWillDetachTagFromEntity).toHaveBeenCalledWith(32, 23)
      expect(system.managerDidDetachTagFromEntity).toHaveBeenCalledWith(32, 23)
    })
  })

  describe('#detachAllTagsFromEntity', function () {
    it('detach all tag from an entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      ecs.attachTagToEntity(12, 23)
      ecs.attachTagToEntity(12, 12)
      ecs.attachTagToEntity(3, 12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([12, 23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))

      ecs.detachAllTagsFromEntity(12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set())
    })

    it('throw an error if the entity to target does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(_ => ecs.detachAllTagsFromEntity(25)).toThrow()
    })

    it('inform underlying systems', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addTag(32)
      ecs.addTag(18)
      ecs.addTag(23)
      ecs.addTag(3)
      ecs.addEntity(23)
      ecs.addEntity(14)

      ecs.attachTagToEntity(32, 23)
      ecs.attachTagToEntity(18, 23)
      ecs.attachTagToEntity(23, 23)
      ecs.attachTagToEntity(32, 14)
      ecs.attachTagToEntity(3, 14)

      ecs.detachAllTagsFromEntity(23)

      expect(system.managerWillDetachTagFromEntity).toHaveBeenCalledWith(32, 23)
      expect(system.managerWillDetachTagFromEntity).toHaveBeenCalledWith(18, 23)
      expect(system.managerWillDetachTagFromEntity).toHaveBeenCalledWith(23, 23)
      expect(system.managerDidDetachTagFromEntity).toHaveBeenCalledWith(32, 23)
      expect(system.managerDidDetachTagFromEntity).toHaveBeenCalledWith(18, 23)
      expect(system.managerDidDetachTagFromEntity).toHaveBeenCalledWith(23, 23)
    })
  })

  describe('#detachTagFromItsEntities', function () {
    it('detach a tag from all entities that have it', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      ecs.attachTagToEntity(12, 23)
      ecs.attachTagToEntity(12, 12)
      ecs.attachTagToEntity(3, 12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set([12, 23]))
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))

      ecs.detachTagFromItsEntities(12)

      expect(new Set(ecs.getEntitiesWithTag(12))).toEqual(new Set())
      expect(new Set(ecs.getEntitiesWithTag(3))).toEqual(new Set([12]))
    })

    it('throw an error if the tag to detach does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)

      expect(_ => ecs.detachTagFromItsEntities(25)).toThrow()
    })

    it('inform underlying systems', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.addTag(32)
      ecs.addTag(18)
      ecs.addTag(23)
      ecs.addTag(3)
      ecs.addEntity(23)
      ecs.addEntity(14)

      ecs.attachTagToEntity(32, 23)
      ecs.attachTagToEntity(18, 23)
      ecs.attachTagToEntity(23, 23)
      ecs.attachTagToEntity(32, 14)
      ecs.attachTagToEntity(3, 14)

      ecs.detachTagFromItsEntities(32)

      expect(system.managerWillDetachTagFromEntity).toHaveBeenCalledWith(32, 23)
      expect(system.managerWillDetachTagFromEntity).toHaveBeenCalledWith(32, 14)
      expect(system.managerDidDetachTagFromEntity).toHaveBeenCalledWith(32, 23)
      expect(system.managerDidDetachTagFromEntity).toHaveBeenCalledWith(32, 14)
    })
  })

  describe('#clearTags', function () {
    it('remove all tags of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.addEntity(32)
      ecs.addEntity(23)
      ecs.addEntity(12)
      ecs.addTag(12)
      ecs.addTag(3)
      ecs.addTag(8)

      ecs.attachTagToEntity(12, 23)
      ecs.attachTagToEntity(12, 12)
      ecs.attachTagToEntity(3, 12)

      ecs.deleteTag = jest.fn(ecs.deleteTag.bind(ecs))

      ecs.clearTags()

      expect(ecs.deleteTag).toHaveBeenCalledWith(12)
      expect(ecs.deleteTag).toHaveBeenCalledWith(3)
      expect(ecs.deleteTag).toHaveBeenCalledWith(8)
    })
  })

  describe('#createType', function () {
    it('create a type from an handler and return it', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const handler : TypeHandler = createTypeHandler()

      expect(new Set(ecs.types)).toEqual(new Set())

      const type : number = ecs.createType(handler)

      expect(new Set(ecs.types)).toEqual(new Set([type]))
    })

    it('allows to create multiple types', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.types)).toEqual(new Set())

      const types : Set<number> = new Set<number>()

      for (let index = 0; index < 10; ++index) {
        types.add(ecs.createType(createTypeHandler()))
      }

      expect(types.size).toBe(10)
      expect(new Set(ecs.types)).toEqual(types)
    })

    it('throw an error if you trying to create two types with the same handler', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const handler : TypeHandler = createTypeHandler()

      ecs.createType(handler)

      expect(_ => ecs.createType(handler)).toThrow()
    })

    it('does not recreate existing types', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const existingTypes : Set<number> = new Set<number>(
        [5, 2, 1, 18, 17, 11]
      )

      for (const type of existingTypes) {
        ecs.setType(type, createTypeHandler())
      }

      expect(new Set(ecs.types)).toEqual(existingTypes)

      for (let index = 0; index < 14; ++index) {
        existingTypes.add(ecs.createType(createTypeHandler()))
      }

      expect(existingTypes.size).toBe(20)
      expect(new Set(ecs.types)).toEqual(existingTypes)
    })

    it('can reallocate previously deleted types', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const existingTypes : Set<number> = new Set<number>()

      for (let index = 0; index < 20; ++index) {
        existingTypes.add(ecs.createType(createTypeHandler()))
      }

      ecs.deleteType(ecs.getHandlerOfType(ecs.types.get(10)))
      ecs.createType(createTypeHandler())

      expect(new Set(ecs.types)).toEqual(existingTypes)
    })

    it('do inform underlying systems of the creation', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      const type : number = ecs.createType(createTypeHandler())
      ecs.deleteType(ecs.getHandlerOfType(type))

      expect(system.managerWillAddType).toHaveBeenCalledWith(type)
      expect(system.managerDidAddType).toHaveBeenCalledWith(type)
    })

    it('throw an error if you trying to add a type beyond the capacity of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      for (let index = 0; index < ecs.capacity.types; ++index) {
        ecs.createType(createTypeHandler())
      }

      expect(_ => ecs.createType(createTypeHandler())).toThrow()
    })
  })

  describe('#setType', function () {
    it('register a given type into the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.types)).toEqual(new Set())

      ecs.setType(26, createTypeHandler())

      expect(new Set(ecs.types)).toEqual(new Set([26]))
    })

    it('allows to create multiple types', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(new Set(ecs.types)).toEqual(new Set())

      const types : Set<number> = new Set([1, 32, 89, 65, 42])

      for (const type of types) {
        ecs.setType(type, createTypeHandler())
      }

      expect(new Set(ecs.types)).toEqual(types)
    })

    it('do inform underlying systems of the creation', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.setType(32, createTypeHandler())

      expect(system.managerWillAddType).toHaveBeenCalledWith(32)
      expect(system.managerDidAddType).toHaveBeenCalledWith(32)
    })

    it('throw an error if you trying to add an existing type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(25, createTypeHandler())

      expect(_ => ecs.setType(25, createTypeHandler())).toThrow()
    })

    it('throw an error if you trying to add two types with the same handler', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const handler : TypeHandler = createTypeHandler()

      ecs.setType(25, handler)

      expect(_ => ecs.setType(30, handler)).toThrow()
    })

    it('throw an error if you trying to add a type beyond the capacity of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      expect(
        _ => ecs.setType(ecs.capacity.types, createTypeHandler())
      ).toThrow()
    })
  })

  describe('#hasType', function () {
    it('returns true if this entity-component-system contains the given type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(ecs.hasType(26)).toBeTruthy()
      expect(ecs.hasType(5)).toBeTruthy()
      expect(ecs.hasType(12)).toBeTruthy()
    })

    it('returns true if this entity-component-system contains the given type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(ecs.hasType(32)).toBeFalsy()
      expect(ecs.hasType(14)).toBeFalsy()
      expect(ecs.hasType(4)).toBeFalsy()
    })
  })

  describe('#hasHandler', function () {
    it('returns true if this entity-component-system contains the given handler', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(ecs.hasHandler(ecs.getHandlerOfType(26))).toBeTruthy()
      expect(ecs.hasHandler(ecs.getHandlerOfType(5))).toBeTruthy()
      expect(ecs.hasHandler(ecs.getHandlerOfType(12))).toBeTruthy()
    })

    it('returns true if this entity-component-system contains the given handler', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(ecs.hasHandler(createTypeHandler())).toBeFalsy()
      expect(ecs.hasHandler(createTypeHandler())).toBeFalsy()
      expect(ecs.hasHandler(createTypeHandler())).toBeFalsy()
    })
  })

  describe('#deleteType', function () {
    it('remove a type from the ecs', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(new Set(ecs.types)).toEqual(new Set([26, 5, 12]))

      ecs.deleteType(ecs.getHandlerOfType(5))

      expect(new Set(ecs.types)).toEqual(new Set([26, 12]))
    })

    it('throw an error if you trying to remove a type that does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(_ => ecs.deleteType(createTypeHandler())).toThrow()
    })

    it('inform underlying systems of the deletion', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())
      ecs.deleteType(ecs.getHandlerOfType(5))

      expect(system.managerWillDeleteType).toHaveBeenCalledWith(5)
      expect(system.managerDidDeleteType).toHaveBeenCalledWith(5)
    })

    it('remove all components of the given type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentTypeA : TypeHandler = createTypeHandler()
      const ComponentTypeB : TypeHandler = createTypeHandler()
      const ComponentTypeC : TypeHandler = createTypeHandler()

      ecs.addEntity(25)
      ecs.addEntity(21)
      ecs.addEntity(13)

      ecs.createType(ComponentTypeA)
      ecs.createType(ComponentTypeB)
      ecs.createType(ComponentTypeC)

      ecs.createComponent(25, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeB)
      ecs.createComponent(21, ComponentTypeC)
      ecs.createComponent(13, ComponentTypeA)
      ecs.createComponent(13, ComponentTypeC)

      const entitiesWithTypeA : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeA)
      )
      const entitiesWithTypeB : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeB)
      )
      const entitiesWithTypeC : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeC)
      )

      expect(new Set(entitiesWithTypeA)).toEqual(new Set([25, 21, 13]))
      expect(new Set(entitiesWithTypeB)).toEqual(new Set([21]))
      expect(new Set(entitiesWithTypeC)).toEqual(new Set([21, 13]))

      ecs.deleteType(ComponentTypeA)

      expect(new Set(entitiesWithTypeA)).toEqual(new Set())
      expect(new Set(entitiesWithTypeB)).toEqual(new Set([21]))
      expect(new Set(entitiesWithTypeC)).toEqual(new Set([21, 13]))
    })

    it('move back the type cursor if necessary', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      for (let index = 0; index < 20; ++index) {
        ecs.createType(createTypeHandler())
      }

      const deleted : number = ecs.types.get(5)
      ecs.deleteType(ecs.getHandlerOfType(deleted))

      expect(ecs.createType(createTypeHandler())).toBe(deleted)
    })
  })

  describe('#deleteTypeByIdentifier', function () {
    it('remove a type from the ecs', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(new Set(ecs.types)).toEqual(new Set([26, 5, 12]))

      ecs.deleteTypeByIdentifier(5)

      expect(new Set(ecs.types)).toEqual(new Set([26, 12]))
    })

    it('throw an error if you trying to remove a type that does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())

      expect(_ => ecs.deleteTypeByIdentifier(50)).toThrow()
    })

    it('inform underlying systems of the deletion', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      ecs.setType(26, createTypeHandler())
      ecs.setType(5, createTypeHandler())
      ecs.setType(12, createTypeHandler())
      ecs.deleteTypeByIdentifier(5)

      expect(system.managerWillDeleteType).toHaveBeenCalledWith(5)
      expect(system.managerDidDeleteType).toHaveBeenCalledWith(5)
    })

    it('remove all components of the given type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentTypeA : TypeHandler = createTypeHandler()
      const ComponentTypeB : TypeHandler = createTypeHandler()
      const ComponentTypeC : TypeHandler = createTypeHandler()

      ecs.addEntity(25)
      ecs.addEntity(21)
      ecs.addEntity(13)

      ecs.createType(ComponentTypeA)
      ecs.createType(ComponentTypeB)
      ecs.createType(ComponentTypeC)

      ecs.createComponent(25, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeB)
      ecs.createComponent(21, ComponentTypeC)
      ecs.createComponent(13, ComponentTypeA)
      ecs.createComponent(13, ComponentTypeC)

      const entitiesWithTypeA : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeA)
      )
      const entitiesWithTypeB : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeB)
      )
      const entitiesWithTypeC : Collection<number> = (
        ecs.getEntitiesWithType(ComponentTypeC)
      )

      expect(new Set(entitiesWithTypeA)).toEqual(new Set([25, 21, 13]))
      expect(new Set(entitiesWithTypeB)).toEqual(new Set([21]))
      expect(new Set(entitiesWithTypeC)).toEqual(new Set([21, 13]))

      ecs.deleteTypeByIdentifier(ecs.getTypeOfHandler(ComponentTypeA))

      expect(new Set(entitiesWithTypeA)).toEqual(new Set())
      expect(new Set(entitiesWithTypeB)).toEqual(new Set([21]))
      expect(new Set(entitiesWithTypeC)).toEqual(new Set([21, 13]))
    })

    it('move back the type cursor if necessary', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      for (let index = 0; index < 20; ++index) {
        ecs.createType(createTypeHandler())
      }

      const deleted : number = ecs.types.get(5)
      ecs.deleteTypeByIdentifier(deleted)

      expect(ecs.createType(createTypeHandler())).toBe(deleted)
    })
  })

  describe('#getTypeOfHandler', function () {
    it('return the type assigned to a given handler', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      const handler26 : TypeHandler = createTypeHandler()
      const handler5 : TypeHandler = createTypeHandler()
      const handler12 : TypeHandler = createTypeHandler()

      ecs.setType(26, handler26)
      ecs.setType(5, handler5)
      ecs.setType(12, handler12)

      expect(ecs.getTypeOfHandler(handler26)).toBe(26)
      expect(ecs.getTypeOfHandler(handler5)).toBe(5)
      expect(ecs.getTypeOfHandler(handler12)).toBe(12)
    })
  })

  describe('#getHandlerOfType', function () {
    it('return the handler assigned to a given type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      const handler26 : TypeHandler = createTypeHandler()
      const handler5 : TypeHandler = createTypeHandler()
      const handler12 : TypeHandler = createTypeHandler()

      ecs.setType(26, handler26)
      ecs.setType(5, handler5)
      ecs.setType(12, handler12)

      expect(ecs.getHandlerOfType(26)).toBe(handler26)
      expect(ecs.getHandlerOfType(5)).toBe(handler5)
      expect(ecs.getHandlerOfType(12)).toBe(handler12)
    })
  })

  describe('#getTypesOfEntity', function () {
    it('return a view over the types of a given entity', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentTypeA : TypeHandler = createTypeHandler()
      const ComponentTypeB : TypeHandler = createTypeHandler()
      const ComponentTypeC : TypeHandler = createTypeHandler()

      ecs.addEntity(25)
      ecs.addEntity(21)
      ecs.addEntity(13)

      const typeA : number = ecs.createType(ComponentTypeA)
      const typeB : number = ecs.createType(ComponentTypeB)
      const typeC : number = ecs.createType(ComponentTypeC)

      const typesOfEntity25 : Collection<number> = ecs.getTypesOfEntity(25)
      const typesOfEntity21 : Collection<number> = ecs.getTypesOfEntity(21)
      const typesOfEntity13 : Collection<number> = ecs.getTypesOfEntity(13)

      ecs.createComponent(25, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeA)
      ecs.createComponent(21, ComponentTypeB)
      ecs.createComponent(21, ComponentTypeC)
      ecs.createComponent(13, ComponentTypeA)
      ecs.createComponent(13, ComponentTypeC)

      expect(new Set(typesOfEntity25)).toEqual(new Set([typeA]))
      expect(new Set(typesOfEntity21)).toEqual(new Set([typeA, typeB, typeC]))
      expect(new Set(typesOfEntity13)).toEqual(new Set([typeA, typeC]))
    })
  })

  describe('#createComponent', function () {
    it('allows to instanciate new components', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      expect(new Set(ecs.components)).toEqual(new Set())

      const component : number = ecs.createComponent(25, ComponentType)

      expect(new Set(ecs.components)).toEqual(new Set([component]))
    })

    it('allows to instanciate multiple components', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const types : TypeHandler[] = [
        createTypeHandler(),
        createTypeHandler(),
        createTypeHandler()
      ]

      for (const type of types) ecs.createType(type)

      expect(new Set(ecs.components)).toEqual(new Set())
      const components : Set<number> = new Set<number>()

      for (let index = 0; index < 20; ++index) {
        if (index % 3 === 0) ecs.addEntity(index / 3)
        components.add(ecs.createComponent((index / 3) << 0, types[index % 3]))
      }

      expect(components.size).toBe(20)
      expect(new Set(ecs.components)).toEqual(components)
    })

    it('throw an error if the entity to mutate does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)

      expect(_ => ecs.createComponent(20, ComponentType)).toThrow()
    })

    it('throw an error if the type to instanciate does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.addEntity(20)

      expect(_ => ecs.createComponent(20, ComponentType)).toThrow()
    })

    it('throw an error if the entity to mutate does already have a component of the same type', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.addEntity(20)
      ecs.createType(ComponentType)

      ecs.createComponent(20, ComponentType)

      expect(_ => ecs.createComponent(20, ComponentType)).toThrow()
    })

    it('throw an error if you exceed the component capacity of the ecs', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const types : TypeHandler[] = [
        createTypeHandler(),
        createTypeHandler(),
        createTypeHandler()
      ]

      for (const type of types) ecs.createType(type)

      for (let index = 0; index < ecs.capacity.components; ++index) {
        if (index % 3 === 0) ecs.addEntity(index / 3)
        ecs.createComponent((index / 3) << 0, types[index % 3])
      }

      expect(_ => {
        const index : number = ecs.capacity.components
        if (index % 3 === 0) ecs.addEntity(index / 3)
        ecs.createComponent((index / 3) << 0, types[index % 3])
      }).toThrow()
    })

    it('inform underlying systems of the action', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      const system : System = createSystem()

      ecs.addSystem(system)
      const componentType : number = ecs.createType(ComponentType)
      ecs.addEntity(15)
      const component : number = ecs.createComponent(15, ComponentType)

      expect(system.managerWillAddComponent).toHaveBeenCalledWith(
        component, 15, componentType
      )
      expect(system.managerDidAddComponent).toHaveBeenCalledWith(
        component
      )
    })
  })

  describe('#getEntityOfComponent', function () {
    it('return the entity of a given component', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(ecs.getEntityOfComponent(component)).toBe(25)
    })
  })

  describe('#getTypeOfComponent', function () {
    it('return the type of a given component', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      const componentType : number = ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(ecs.getTypeOfComponent(component)).toBe(componentType)
    })
  })

  describe('#getInstanceOfComponent', function () {
    it('return the instance of a given component', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      const instance : any = {}

      ComponentType.instanciate = function () { return instance }

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(ecs.getInstanceOfComponent(component)).toBe(instance)
    })
  })

  describe('#getComponentOfInstance', function () {
    it('return the component related to the given instance', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      const instance : any = {}

      ComponentType.instanciate = function () { return instance }

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(ecs.getComponentOfInstance(instance)).toBe(component)
    })
  })

  describe('#isComponentInstance', function () {
    it('return true if the given object is a component instance', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      const instance : any = {}

      ComponentType.instanciate = function () { return instance }

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(ecs.isComponentInstance(instance)).toBeTruthy()
      expect(ecs.isComponentInstance(25)).toBeFalsy()
    })
  })

  describe('#getComponent', function () {
    it('return a component', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(ecs.getComponent(25, ComponentType)).toBe(component)
    })
  })

  describe('#hasComponent', function () {
    it('return true if the given component exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      const ComponentTypeB : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)
      ecs.createType(ComponentTypeB)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(ecs.hasComponent(25, ComponentType)).toBeTruthy()
      expect(ecs.hasComponent(10, ComponentType)).toBeFalsy()
      expect(ecs.hasComponent(25, ComponentTypeB)).toBeFalsy()
    })
  })

  describe('#deleteComponent', function () {
    it('allows to delete existing components', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(new Set(ecs.components)).toEqual(new Set([component]))

      ecs.deleteComponent(25, ComponentType)

      expect(new Set(ecs.components)).toEqual(new Set())
    })

    it('throw an error if the entity to mutate does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)

      expect(_ => ecs.deleteComponent(20, ComponentType)).toThrow()
    })

    it('throw an error if the type of the component to delete does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.addEntity(20)

      expect(_ => ecs.deleteComponent(20, ComponentType)).toThrow()
    })

    it('throw an error if the component to delete does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.addEntity(20)
      ecs.createType(ComponentType)

      expect(_ => ecs.deleteComponent(20, ComponentType)).toThrow()
    })

    it('move the component cursor', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const types : TypeHandler[] = [
        createTypeHandler(),
        createTypeHandler(),
        createTypeHandler()
      ]

      for (const type of types) ecs.createType(type)

      for (let index = 0; index < 30; ++index) {
        if (index % 3 === 0) ecs.addEntity(index / 3)
        ecs.createComponent((index / 3) << 0, types[index % 3])
      }

      const components : Set<number> = new Set<number>(ecs.components)

      ecs.deleteComponent(
        ecs.getEntityOfComponent(ecs.components.get(10)),
        ecs.getHandlerOfType(ecs.getTypeOfComponent(ecs.components.get(10)))
      )

      ecs.addEntity(50)
      ecs.createComponent(50, types[1])

      expect(new Set(ecs.components)).toEqual(components)
    })

    it('inform underlying systems of the action', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      const system : System = createSystem()

      ecs.addSystem(system)
      const componentType : number = ecs.createType(ComponentType)
      ecs.addEntity(15)
      const component : number = ecs.createComponent(15, ComponentType)

      ecs.deleteComponent(15, ComponentType)

      expect(system.managerWillDeleteComponent).toHaveBeenCalledWith(
        component
      )
      expect(system.managerDidDeleteComponent).toHaveBeenCalledWith(
        component, 15, componentType
      )
    })
  })

  describe('#deleteComponentByIdentifier', function () {
    it('allows to delete existing components', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      ecs.createType(ComponentType)
      ecs.addEntity(25)

      const component : number = ecs.createComponent(25, ComponentType)

      expect(new Set(ecs.components)).toEqual(new Set([component]))

      ecs.deleteComponentByIdentifier(component)

      expect(new Set(ecs.components)).toEqual(new Set())
    })

    it('throw an error if the component to delete does not exists', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()

      expect(_ => ecs.deleteComponentByIdentifier(25)).toThrow()
    })

    it('move the component cursor', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const types : TypeHandler[] = [
        createTypeHandler(),
        createTypeHandler(),
        createTypeHandler()
      ]

      for (const type of types) ecs.createType(type)

      for (let index = 0; index < 30; ++index) {
        if (index % 3 === 0) ecs.addEntity(index / 3)
        ecs.createComponent((index / 3) << 0, types[index % 3])
      }

      const components : Set<number> = new Set<number>(ecs.components)

      ecs.deleteComponentByIdentifier(ecs.components.get(10))

      ecs.addEntity(50)
      ecs.createComponent(50, types[1])

      expect(new Set(ecs.components)).toEqual(components)
    })

    it('inform underlying systems of the action', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      const system : System = createSystem()

      ecs.addSystem(system)
      const componentType : number = ecs.createType(ComponentType)
      ecs.addEntity(15)
      const component : number = ecs.createComponent(15, ComponentType)

      ecs.deleteComponentByIdentifier(component)

      expect(system.managerWillDeleteComponent).toHaveBeenCalledWith(
        component
      )
      expect(system.managerDidDeleteComponent).toHaveBeenCalledWith(
        component, 15, componentType
      )
    })
  })

  describe('#clearComponents', function () {
    it('delete all components of the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const ComponentType : TypeHandler = createTypeHandler()
      ecs.deleteComponentByIdentifier = (
        jest.fn(ecs.deleteComponentByIdentifier.bind(ecs))
      )

      ecs.createType(ComponentType)
      ecs.addEntity(20)
      ecs.addEntity(12)
      ecs.addEntity(9)

      const components : number[] = [
        ecs.createComponent(20, ComponentType),
        ecs.createComponent(12, ComponentType),
        ecs.createComponent(9, ComponentType)
      ]

      ecs.clearComponents()

      for (const component of components) {
        expect(ecs.deleteComponentByIdentifier).toHaveBeenCalledWith(component)
      }
    })
  })

  describe('#addSystem', function () {
    it('add a system to the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      expect(new Set(ecs.systems)).toEqual(new Set())

      ecs.addSystem(system)

      expect(new Set(ecs.systems)).toEqual(new Set([system]))
    })

    it('throw an error if you try to add the same system twice', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const system : System = createSystem()

      ecs.addSystem(system)

      expect(_ => ecs.addSystem(system)).toThrow()
    })
  })

  describe('#deleteSystem', function () {
    it('remove a system to the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const systems : System[] = [
        createSystem(), createSystem(), createSystem()
      ]

      for (const system of systems) ecs.addSystem(system)

      expect(new Set(ecs.systems)).toEqual(new Set(systems))

      ecs.deleteSystem(systems[1])

      expect(new Set(ecs.systems)).toEqual(new Set([
        systems[0], systems[2]
      ]))
    })

    it('throw an error if you try to delete the same system twice', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const systems : System[] = [
        createSystem(), createSystem(), createSystem()
      ]

      for (const system of systems) ecs.addSystem(system)

      ecs.deleteSystem(systems[1])

      expect(_ => ecs.deleteSystem(systems[1])).toThrow()
    })
  })

  describe('#hasSystem', function () {
    it('return true if the given systems was added to the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const systems : System[] = [
        createSystem(), createSystem(), createSystem()
      ]

      for (const system of systems) ecs.addSystem(system)

      for (const system of systems) {
        expect(ecs.hasSystem(system)).toBeTruthy()
      }

      expect(ecs.hasSystem(createSystem())).toBeFalsy()
    })
  })

  describe('#update', function () {
    it('update all systems', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const systems : System[] = [
        createSystem(), createSystem(), createSystem()
      ]

      for (const system of systems) ecs.addSystem(system)

      ecs.update(15)

      for (const system of systems) {
        expect(system.managerWillUpdate).toHaveBeenCalledWith(15)
        expect(system.update).toHaveBeenCalledWith(15)
        expect(system.managerDidUpdate).toHaveBeenCalledWith(15)
      }
    })
  })

  describe('#clearSystems', function () {
    it('delete all systems', function () {
      const ecs : EntityComponentSystem = BUILDER.build()
      const systems : System[] = [
        createSystem(), createSystem(), createSystem()
      ]

      for (const system of systems) ecs.addSystem(system)

      ecs.clearSystems()

      expect(new Set(ecs.systems)).toEqual(new Set([]))
    })
  })

  describe('#clear', function () {
    it('it empty the entity-component-system', function () {
      const ecs : EntityComponentSystem = BUILDER.build()

      ecs.clearEntities = jest.fn(ecs.clearEntities.bind(ecs))
      ecs.clearTags = jest.fn(ecs.clearTags.bind(ecs))
      ecs.clearTypes = jest.fn(ecs.clearTypes.bind(ecs))
      ecs.clearComponents = jest.fn(ecs.clearComponents.bind(ecs))
      ecs.clearEntities = jest.fn(ecs.clearEntities.bind(ecs))
      ecs.clearSystems = jest.fn(ecs.clearSystems.bind(ecs))

      ecs.clear()

      expect(ecs.clearEntities).toHaveBeenCalled()
      expect(ecs.clearTags).toHaveBeenCalled()
      expect(ecs.clearTypes).toHaveBeenCalled()
      expect(ecs.clearComponents).toHaveBeenCalled()
      expect(ecs.clearEntities).toHaveBeenCalled()
      expect(ecs.clearSystems).toHaveBeenCalled()
    })
  })
})
