/** eslint-env jest */

import { Collection } from '../../src/ts/collection/Collection'
import { createCollection } from '../mocks/createCollection'
import { View } from '../../src/ts/collection/View'

function on (value : any) : any {
  return value
}

describe('View', function () {
  describe('#wrap', function () {
    it('wrap a collection that is not already a view', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = View.wrap(mock)

      expect(tags).toBeInstanceOf(View)
    })

    it('return collection view as is', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = View.wrap(mock)

      expect(View.wrap(tags)).toBe(tags)
    })
  })

  describe('#has', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      on(mock.has).mockReturnValue(false)
      expect(tags.has(6)).toBeFalsy()
      expect(mock.has).toHaveBeenCalledWith(6)

      on(mock.has).mockReturnValue(true)
      expect(tags.has(3)).toBeTruthy()
      expect(mock.has).toHaveBeenCalledWith(3)
    })
  })

  describe('#get', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      on(mock.get).mockReturnValue(1)
      expect(tags.get(0)).toBe(1)
      expect(mock.get).toHaveBeenCalledWith(0)

      on(mock.get).mockReturnValue(3)
      expect(tags.get(2)).toBe(3)
      expect(mock.get).toHaveBeenCalledWith(2)
    })
  })

  describe('#size', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      createCollection.size(mock).mockReturnValue(3)
      expect(tags.size).toBe(3)
      expect(createCollection.size(mock)).toHaveBeenCalled()
    })
  })

  describe('#iterator', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      on(mock[Symbol.iterator]).mockImplementation(
        function * () { yield * [1, 2, 3] }
      )
      expect([...tags]).toEqual([1, 2, 3])
      expect(mock[Symbol.iterator]).toHaveBeenCalled()
    })
  })

  describe('#isCollection', function () {
    it('return true', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      createCollection.isCollection(mock).mockReturnValue(true)
      expect(tags.isCollection).toBeTruthy()
      expect(createCollection.isCollection(mock)).toHaveBeenCalled()

      createCollection.isCollection(mock).mockReturnValue(false)
      expect(tags.isCollection).toBeFalsy()
      expect(createCollection.isCollection(mock)).toHaveBeenCalledTimes(2)
    })
  })

  describe('#equals', function () {
    it('call the wrapped collection method and return the result', function () {
      const mock : Collection<number> = createCollection()
      const tags : View<number> = new View<number>(mock)

      on(mock.equals).mockReturnValue(false)
      expect(tags.equals(6)).toBeFalsy()
      expect(mock.equals).toHaveBeenCalledWith(6)

      on(mock.equals).mockReturnValue(true)
      expect(tags.equals(8)).toBeTruthy()
      expect(mock.equals).toHaveBeenCalledWith(8)
    })
  })
})
