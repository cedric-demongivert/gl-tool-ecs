import { CollectionIterator } from '@cedric-demongivert/gl-tool-collection';
import { BidirectionalIterator } from '@cedric-demongivert/gl-tool-collection';
import { ComponentType } from './ComponentType';
import { EntityTypeSequence } from './EntityTypeSequence';
export declare class EntityTypeSequenceIterator implements BidirectionalIterator<ComponentType<any>> {
    /**
    *
    */
    sequence: EntityTypeSequence;
    /**
    * The location of the element described by this iterator in the parent pack.
    */
    index: number;
    /**
    * Instantiate a new random access iterator instance.
    */
    constructor();
    /**
    * @see Iterator.collection
    */
    collection(): EntityTypeSequence;
    /**
    * @see ForwardIterator.hasNext
    */
    hasNext(): boolean;
    /**
    * @see ForwardIterator.next
    */
    next(): void;
    /**
    * @see ForwardIterator.forward
    */
    forward(count: number): void;
    /**
    * @see ForwardIterator.end
    */
    end(): void;
    /**
    * @see BackwardIterator.hasPrevious
    */
    hasPrevious(): boolean;
    /**
    * @see BackwardIterator.previous
    */
    previous(): void;
    /**
    * @see BackwardIterator.backward
    */
    backward(count: number): void;
    /**
    * @see BackwardIterator.start
    */
    start(): void;
    /**
    * @see Iterator.get
    */
    get(): ComponentType<any>;
    /**
    * @see Iterator.move
    */
    move(iterator: CollectionIterator<ComponentType<any>>): void;
    /**
    * @see BidirectionalIterator.go
    */
    go(index: number): void;
    /**
    * Shallow-copy the given instance.
    *
    * @param toCopy
    */
    copy(toCopy: EntityTypeSequenceIterator): void;
    /**
    * @see Iterator.clone
    */
    clone(): EntityTypeSequenceIterator;
    /**
    * @see Iterator.equals
    */
    equals(other: any): boolean;
}
export declare namespace ComponentRepositorySequenceIterator {
    /**
    * Return a shallow copy of the given iterator.
    *
    * A shallow-copy *b* of an iterator *a* is an instance that follow both
    * properties :
    *  - b !== a
    *  - b.equals(a)
    *
    * @param toCopy - An iterator to copy.
    *
    * @return A shallow copy of the given iterator.
    */
    function copy(toCopy: EntityTypeSequenceIterator): EntityTypeSequenceIterator;
}
