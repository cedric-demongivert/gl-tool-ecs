import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { TypeMapping } from './TypeMapping';
import { ComponentType } from './ComponentType';
import { TypeMappingSequenceIterator } from './TypeMappingSequenceIterator';
export declare class TypeMappingSequence implements Sequence<ComponentType<any>> {
    private mapping;
    constructor(mapping: TypeMapping);
    readonly size: number;
    get(index: number): ComponentType<any>;
    readonly last: ComponentType<any>;
    readonly lastIndex: number;
    readonly first: ComponentType<any>;
    readonly firstIndex: number;
    has(element: ComponentType<any>): boolean;
    indexOf(element: ComponentType<any>): number;
    iterator(): TypeMappingSequenceIterator;
    view(): Sequence<ComponentType<any>>;
    clone(): TypeMappingSequence;
    [Symbol.iterator](): Iterator<ComponentType<any>>;
    equals(other: any): boolean;
}
