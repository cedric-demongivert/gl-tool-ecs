import { CollectionIterator } from '@cedric-demongivert/gl-tool-collection';
import { BidirectionalIterator } from '@cedric-demongivert/gl-tool-collection';
import { Component } from './Component';
import { ComponentRepositorySequence } from './ComponentRepositorySequence';
export declare class ComponentRepositorySequenceIterator implements BidirectionalIterator<Component> {
    /**
    *
    */
    sequence: ComponentRepositorySequence;
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
    collection(): ComponentRepositorySequence;
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
    get(): Component;
    /**
    * @see Iterator.move
    */
    move(iterator: CollectionIterator<Component>): void;
    /**
    * @see BidirectionalIterator.go
    */
    go(index: number): void;
    /**
    * Shallow-copy the given instance.
    *
    * @param toCopy
    */
    copy(toCopy: ComponentRepositorySequenceIterator): void;
    /**
    * @see Iterator.clone
    */
    clone(): ComponentRepositorySequenceIterator;
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
    function copy(toCopy: ComponentRepositorySequenceIterator): ComponentRepositorySequenceIterator;
}
