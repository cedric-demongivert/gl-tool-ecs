/** eslint-env jest */

import { Cursor } from '../../src/ts/collection/Cursor'
import { Collection } from '../../src/ts/collection/Collection'
import { createCollection } from '../mocks/createCollection'

function on (value : any) : any {
  return value
}

describe('Cursor', function () {
  describe('#constructor', function () {
    it('create a cursor over a given collection', function () {
      const collection : Collection<number> = createCollection()
      const cursor : Cursor = new Cursor(collection)

      expect(cursor.collection).toBe(collection)
    })
  })

  describe('#next', function () {
    it('return the next available number in the given collection', function () {
      const collection : Collection<number> = createCollection()
      const cursor : Cursor = new Cursor(collection)

      on(collection.has).mockReturnValue(false)
      expect(cursor.next()).toBe(0)
      expect(collection.has).toHaveBeenCalledWith(0)
    })

    it('search for the next available number in the given collection', function () {
      const collection : Collection<number> = createCollection()
      const cursor : Cursor = new Cursor(collection)

      on(collection.has).mockImplementation(value => value < 5)
      expect(cursor.next()).toBe(5)
      expect(collection.has).toHaveBeenNthCalledWith(1, 0)
      expect(collection.has).toHaveBeenNthCalledWith(2, 1)
      expect(collection.has).toHaveBeenNthCalledWith(3, 2)
      expect(collection.has).toHaveBeenNthCalledWith(4, 3)
      expect(collection.has).toHaveBeenNthCalledWith(5, 4)
      expect(collection.has).toHaveBeenNthCalledWith(6, 5)
    })

    it('continue the research from the last element that worked', function () {
      const collection : Collection<number> = createCollection()
      const cursor : Cursor = new Cursor(collection)

      on(collection.has).mockImplementation(value => value < 5)
      expect(cursor.next()).toBe(5)

      on(collection.has).mockImplementation(value => value < 7)
      expect(cursor.next()).toBe(7)
      expect(collection.has).toHaveBeenNthCalledWith(7, 5)
      expect(collection.has).toHaveBeenNthCalledWith(8, 6)
      expect(collection.has).toHaveBeenNthCalledWith(9, 7)
    })
  })

  describe('#move', function () {
    it('set the cursor to a given element', function () {
      const collection : Collection<number> = createCollection()
      const cursor : Cursor = new Cursor(collection)

      on(collection.has).mockReturnValue(false)
      expect(cursor.next()).toBe(0)
      cursor.move(5)
      expect(cursor.next()).toBe(5)
      cursor.move(2)
      expect(cursor.next()).toBe(2)
    })
  })

  describe('#equals', function () {
    it('return true if the cursor instance is the same', function () {
      const collection : Collection<number> = createCollection()
      const cursor : Cursor = new Cursor(collection)
      const copy : Cursor = new Cursor(collection)

      expect(cursor.equals(true)).toBeFalsy()
      expect(cursor.equals(null)).toBeFalsy()
      expect(cursor.equals(copy)).toBeFalsy()
      expect(cursor.equals(cursor)).toBeTruthy()
    })
  })
})
