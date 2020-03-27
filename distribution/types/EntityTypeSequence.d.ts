import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { ComponentType } from './ComponentType';
import { TypeMapping } from './TypeMapping';
import { EntityTypeSequenceIterator } from './EntityTypeSequenceIterator';
export declare class EntityTypeSequence implements Sequence<ComponentType<any>> {
    private _mapping;
    private _source;
    constructor(source: Sequence<number>, mapping: TypeMapping);
    readonly size: number;
    get(index: number): ComponentType<any>;
    readonly last: ComponentType<any>;
    readonly lastIndex: number;
    readonly first: ComponentType<any>;
    readonly firstIndex: number;
    has(element: ComponentType<any>): boolean;
    indexOf(element: ComponentType<any>): number;
    iterator(): EntityTypeSequenceIterator;
    view(): Sequence<ComponentType<any>>;
    clone(): EntityTypeSequence;
    [Symbol.iterator](): Iterator<ComponentType<any>>;
    equals(other: any): boolean;
}
