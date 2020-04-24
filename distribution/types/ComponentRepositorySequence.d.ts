import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { ComponentRepository } from './ComponentRepository';
import { Component } from './Component';
import { ComponentRepositorySequenceIterator } from './ComponentRepositorySequenceIterator';
export declare class ComponentRepositorySequence implements Sequence<Component<any>> {
    private repository;
    constructor(repository: ComponentRepository);
    readonly size: number;
    get(index: number): Component<any>;
    readonly last: Component<any>;
    readonly lastIndex: number;
    readonly first: Component<any>;
    readonly firstIndex: number;
    has(element: Component<any>): boolean;
    indexOf(element: Component<any>): number;
    iterator(): ComponentRepositorySequenceIterator;
    view(): Sequence<Component<any>>;
    clone(): ComponentRepositorySequence;
    [Symbol.iterator](): Iterator<Component<any>>;
    equals(other: any): boolean;
}
