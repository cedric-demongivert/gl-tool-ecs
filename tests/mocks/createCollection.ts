import { Collection } from '../../src/ts/collection/Collection'

export function createCollection <T> () : Collection<T> {
  const result : any = {
    /**
    * @see Collection.get
    */
    get: jest.fn(),

    /**
    * @see Collection.has
    */
    has: jest.fn(),

    /**
    * @see Collection.equals
    */
    equals: jest.fn(),

    /**
    * @see Collection.iterator
    */
    [Symbol.iterator]: jest.fn()
  }

  Object.defineProperty(result, 'size', { get: jest.fn() })
  Object.defineProperty(result, 'isCollection', { get: jest.fn() })

  return result
}

function size <T> (collection : Collection<T>) : any {
  return Object.getOwnPropertyDescriptor(collection, 'size').get
}

function isCollection <T> (collection : Collection<T>) : any {
  return Object.getOwnPropertyDescriptor(collection, 'isCollection').get
}

createCollection.size = size
createCollection.isCollection = isCollection
