import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { ComponentRepository } from './ComponentRepository';
import { Component } from './Component';
import { ComponentRepositorySequenceIterator } from './ComponentRepositorySequenceIterator';
export declare class ComponentRepositorySequence implements Sequence<Component> {
    private repository;
    constructor(repository: ComponentRepository);
    readonly size: number;
    get(index: number): Component;
    readonly last: Component;
    readonly lastIndex: number;
    readonly first: Component;
    readonly firstIndex: number;
    has(element: Component): boolean;
    indexOf(element: Component): number;
    iterator(): ComponentRepositorySequenceIterator;
    view(): Sequence<Component>;
    clone(): ComponentRepositorySequence;
    [Symbol.iterator](): Iterator<Component>;
    equals(other: any): boolean;
}
