/** eslint-env jest */

import {
  TagRelationshipRepository
} from '../src/ts/tags/TagRelationshipRepository'

describe('TagRelationshipRepository', function () {
  describe('#constructor', function () {
    it('create a new empty tag relationships manager', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository()
      )

      expect(relationships.entities).toBe(1024)
      expect(relationships.tags).toBe(256)

      for (let tag = 0, length = relationships.tags; tag < length; ++tag) {
        expect(relationships.getEntitiesWithTag(tag).size).toBe(0)
      }
    })

    it('allows to specify the initial capacity of the manager', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(2048, 512)
      )

      expect(relationships.entities).toBe(2048)
      expect(relationships.tags).toBe(512)

      for (let tag = 0, length = relationships.tags; tag < length; ++tag) {
        expect(relationships.getEntitiesWithTag(tag).size).toBe(0)
      }
    })
  })

  describe('#copy', function () {
    it('create a copy of a given relationship manager', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let tag = 0; tag < 5; ++tag) {
        for (let entity = 10; entity < 25; ++entity) {
          relationships.attachTagToEntity(tag, entity)
        }
      }

      const copy : TagRelationshipRepository = (
        TagRelationshipRepository.copy(relationships)
      )

      expect(relationships.equals(copy)).toBeTruthy()
      expect(relationships === copy).toBeFalsy()
    })
  })

  describe('#create', function () {
    it('return a relationship manager', function () {
      const relationships : TagRelationshipRepository = (
        TagRelationshipRepository.create(2048, 512)
      )

      expect(relationships.entities).toBe(2048)
      expect(relationships.tags).toBe(512)

      for (let tag = 0, length = relationships.tags; tag < length; ++tag) {
        expect(relationships.getEntitiesWithTag(tag).size).toBe(0)
      }
    })

    it('return a relationship manager', function () {
      const relationships : TagRelationshipRepository = (
        TagRelationshipRepository.create()
      )

      expect(relationships.entities).toBe(1024)
      expect(relationships.tags).toBe(256)

      for (let tag = 0, length = relationships.tags; tag < length; ++tag) {
        expect(relationships.getEntitiesWithTag(tag).size).toBe(0)
      }
    })
  })

  describe('#reallocate', function () {
    it('change the capacity of the manager', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(10, 10)
      )

      for (let tag = 0; tag < 10; ++tag) {
        for (let entity = 0; entity < 10; ++entity) {
          relationships.attachTagToEntity(tag, entity)
        }

        expect(new Set(relationships.getEntitiesWithTag(tag))).toEqual(
          new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        )
      }

      expect(relationships.entities).toBe(10)
      expect(relationships.tags).toBe(10)

      relationships.reallocate(5, 5)

      expect(relationships.entities).toBe(5)
      expect(relationships.tags).toBe(5)

      for (let tag = 0; tag < 5; ++tag) {
        expect(new Set(relationships.getEntitiesWithTag(tag))).toEqual(
          new Set([0, 1, 2, 3, 4])
        )
      }

      for (let tag = 5; tag < 10; ++tag) {
        expect(relationships.getEntitiesWithTag(tag)).toBeUndefined()
      }
    })

    it('change the capacity of the manager', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(10, 10)
      )

      for (let tag = 0; tag < 10; ++tag) {
        for (let entity = 0; entity < 10; ++entity) {
          relationships.attachTagToEntity(tag, entity)
        }

        expect(new Set(relationships.getEntitiesWithTag(tag))).toEqual(
          new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        )
      }

      expect(relationships.entities).toBe(10)
      expect(relationships.tags).toBe(10)

      relationships.reallocate(20, 20)

      expect(relationships.entities).toBe(20)
      expect(relationships.tags).toBe(20)

      for (let tag = 0; tag < 10; ++tag) {
        expect(new Set(relationships.getEntitiesWithTag(tag))).toEqual(
          new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        )
      }

      for (let tag = 10; tag < 20; ++tag) {
        expect(relationships.getEntitiesWithTag(tag)).not.toBeUndefined()
        expect(new Set(relationships.getEntitiesWithTag(tag))).toEqual(
          new Set()
        )
      }
    })
  })

  describe('#getEntitiesWithTag', function () {
    it('return a collection that contains each entities with a given tag', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let tag = 0; tag < 4; ++tag) {
        for (let entity = 0; entity < 5; ++entity) {
          relationships.attachTagToEntity(tag, tag * 5 + entity)
        }
      }

      expect(new Set(relationships.getEntitiesWithTag(0))).toEqual(
        new Set([0, 1, 2, 3, 4])
      )

      expect(new Set(relationships.getEntitiesWithTag(1))).toEqual(
        new Set([5, 6, 7, 8, 9])
      )

      expect(new Set(relationships.getEntitiesWithTag(2))).toEqual(
        new Set([10, 11, 12, 13, 14])
      )

      expect(new Set(relationships.getEntitiesWithTag(3))).toEqual(
        new Set([15, 16, 17, 18, 19])
      )
    })
  })

  describe('#detachTagFromEntity', function () {
    it('remove a tag from an entity', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let entity = 0; entity < 10; ++entity) {
        relationships.attachTagToEntity(5, entity)
      }

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      )

      relationships.detachTagFromEntity(5, 2)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 3, 4, 5, 6, 7, 8, 9])
      )

      relationships.detachTagFromEntity(5, 8)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 3, 4, 5, 6, 7, 9])
      )
    })

    it('does nothing if you remove a tag twice', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let entity = 0; entity < 10; ++entity) {
        relationships.attachTagToEntity(5, entity)
      }

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      )

      relationships.detachTagFromEntity(5, 4)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 2, 3, 5, 6, 7, 8, 9])
      )

      relationships.detachTagFromEntity(5, 4)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 2, 3, 5, 6, 7, 8, 9])
      )
    })
  })

  describe('#detachTagFromItsEntities', function () {
    it('remove a tag from each entities that is attached to', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let entity = 0; entity < 10; ++entity) {
        relationships.attachTagToEntity(5, entity)
      }

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
      )

      relationships.detachTagFromItsEntities(5)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set()
      )
    })
  })

  describe('#attachTagToEntity', function () {
    it('add a tag to an entity', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(new Set())

      relationships.attachTagToEntity(5, 23)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([23])
      )

      for (let index = 0; index < 10; ++index) {
        relationships.attachTagToEntity(5, index)
      }

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 23])
      )
    })

    it('does nothing if you add a given tag twice to an entity', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(new Set())

      relationships.attachTagToEntity(5, 23)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([23])
      )

      relationships.attachTagToEntity(5, 23)

      expect(new Set(relationships.getEntitiesWithTag(5))).toEqual(
        new Set([23])
      )
    })
  })

  describe('#detachAllTagsFromEntity', function () {
    it('remove all tags attached to a given entity', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let index = 0; index < 10; ++index) {
        relationships.attachTagToEntity(index, 20)
      }

      for (let index = 0; index < 10; ++index) {
        expect(relationships.getEntitiesWithTag(index).has(20)).toBeTruthy()
      }

      relationships.detachAllTagsFromEntity(20)

      for (let index = 0; index < 10; ++index) {
        expect(relationships.getEntitiesWithTag(index).has(20)).toBeFalsy()
      }
    })

    it('does nothing if you try to do it twice', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let index = 0; index < 10; ++index) {
        relationships.attachTagToEntity(index, 20)
      }

      for (let index = 0; index < 10; ++index) {
        expect(relationships.getEntitiesWithTag(index).has(20)).toBeTruthy()
      }

      relationships.detachAllTagsFromEntity(20)
      relationships.detachAllTagsFromEntity(20)

      for (let index = 0; index < 10; ++index) {
        expect(relationships.getEntitiesWithTag(index).has(20)).toBeFalsy()
      }
    })
  })

  describe('#clear', function () {
    it('allows to empty the relationship manager', function () {
      const relationships : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      for (let tag = 0; tag < 4; ++tag) {
        for (let entity = 0; entity < 5; ++entity) {
          relationships.attachTagToEntity(tag, tag * 5 + entity)
        }
      }

      for (let tag = 0; tag < 4; ++tag) {
        const offset : number = tag * 5
        expect(new Set(relationships.getEntitiesWithTag(tag))).toEqual(
          new Set([offset + 0, offset + 1, offset + 2, offset + 3, offset + 4])
        )
      }

      relationships.clear()

      for (let tag = 0; tag < relationships.tags; ++tag) {
        expect(new Set(relationships.getEntitiesWithTag(tag))).toEqual(
          new Set()
        )
      }
    })
  })

  describe('#equals', function () {
    const relationships : TagRelationshipRepository = (
      new TagRelationshipRepository(100, 20)
    )

    relationships.attachTagToEntity(5, 12)
    relationships.attachTagToEntity(8, 11)
    relationships.attachTagToEntity(12, 11)

    it('can be compared to any object type', function () {
      expect(relationships.equals(5)).toBeFalsy()
      expect(relationships.equals(false)).toBeFalsy()
      expect(relationships.equals({})).toBeFalsy()
    })

    it('can be compared to null', function () {
      expect(relationships.equals(null)).toBeFalsy()
    })

    it('can be compared to itself', function () {
      expect(relationships.equals(relationships)).toBeTruthy()
    })

    it('return true if it is compared to a copy', function () {
      const copy : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      copy.attachTagToEntity(5, 12)
      copy.attachTagToEntity(8, 11)
      copy.attachTagToEntity(12, 11)

      expect(relationships.equals(copy)).toBeTruthy()
    })

    it('return false if it is compared to a manager with more relationships', function () {
      const bigger : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      bigger.attachTagToEntity(5, 12)
      bigger.attachTagToEntity(8, 11)
      bigger.attachTagToEntity(12, 11)
      bigger.attachTagToEntity(3, 22)

      expect(relationships.equals(bigger)).toBeFalsy()
    })

    it('return false if it is compared to a manager with different relationships', function () {
      const different : TagRelationshipRepository = (
        new TagRelationshipRepository(100, 20)
      )

      different.attachTagToEntity(5, 12)
      different.attachTagToEntity(8, 11)
      different.attachTagToEntity(11, 12)

      expect(relationships.equals(different)).toBeFalsy()
    })

    it('return false if it is compared to a manager with a different capacity', function () {
      const moreTags : TagRelationshipRepository = (
        new TagRelationshipRepository(25, 100)
      )

      moreTags.attachTagToEntity(5, 12)
      moreTags.attachTagToEntity(8, 11)
      moreTags.attachTagToEntity(12, 11)

      expect(relationships.equals(moreTags)).toBeFalsy()

      const moreEntities : TagRelationshipRepository = (
        new TagRelationshipRepository(20, 150)
      )

      moreEntities.attachTagToEntity(5, 12)
      moreEntities.attachTagToEntity(8, 11)
      moreEntities.attachTagToEntity(12, 11)

      expect(relationships.equals(moreEntities)).toBeFalsy()
    })
  })
})
