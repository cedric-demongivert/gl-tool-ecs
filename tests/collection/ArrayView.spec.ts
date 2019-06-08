/** eslint-env jest */

import { Collection } from '../../src/ts/collection/Collection'
import { ArrayView } from '../../src/ts/collection/ArrayView'


describe('ArrayView', function () {
  describe('#wrap', function () {
    it('wrap an array', function () {
      const tags : ArrayView<number> = ArrayView.wrap([1, 2, 5, 9, 8])

      expect([...tags]).toEqual([1, 2, 5, 9, 8])
    })
  })

  describe('#has', function () {
    it('return true if the underlying array contains the given value', function () {
      const tags : ArrayView<number> = ArrayView.wrap([1, 2, 5, 9, 8])

      expect(tags.has(2)).toBeTruthy()
      expect(tags.has(9)).toBeTruthy()
      expect(tags.has(10)).toBeFalsy()
    })
  })

  describe('#get', function () {
    it('return the element at the given index of the underlying array', function () {
      const array : Array<number> = [1, 2, 5, 9, 8]
      const tags : ArrayView<number> = ArrayView.wrap(array)

      for (let index = 0, size = tags.size; index < size; ++index) {
        expect(tags.get(index)).toBe(array[index])
      }
    })
  })

  describe('#size', function () {
    it('it return the length of the underlying array', function () {
      const array : Array<number> = [1, 2, 5, 9, 8]
      const tags : ArrayView<number> = ArrayView.wrap(array)

      expect(tags.size).toBe(array.length)
    })
  })

  describe('#iterator', function () {
    it('iterate over the underlying array', function () {
      const array : Array<number> = [1, 2, 5, 9, 8]
      const tags : ArrayView<number> = ArrayView.wrap(array)

      expect([...tags]).toEqual(array)
    })
  })

  describe('#isCollection', function () {
    it('return true', function () {
      const array : Array<number> = [1, 2, 5, 9, 8]
      const tags : ArrayView<number> = ArrayView.wrap(array)

      expect(tags.isCollection).toBeTruthy()
    })
  })

  describe('#equals', function () {
    it('return true if both arrays are equals', function () {
      const array : Array<number> = [1, 2, 5, 9, 8]
      const tags : ArrayView<number> = ArrayView.wrap(array)
      const copy : ArrayView<number> = ArrayView.wrap([...array])
      const bigger : ArrayView<number> = ArrayView.wrap([1, 2, 5, 9, 8, 10])
      const different : ArrayView<number> = ArrayView.wrap([1, 2, 8, 9, 5])

      expect(tags.equals(true)).toBeFalsy()
      expect(tags.equals(128)).toBeFalsy()
      expect(tags.equals(null)).toBeFalsy()
      expect(tags.equals(tags)).toBeTruthy()
      expect(tags.equals(copy)).toBeTruthy()
      expect(tags.equals(bigger)).toBeFalsy()
      expect(tags.equals(different)).toBeFalsy()
    })
  })
})
