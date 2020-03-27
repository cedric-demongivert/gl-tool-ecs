import { Sequence } from '@cedric-demongivert/gl-tool-collection';
import { ComponentType } from './ComponentType';
export declare class TypeMapping {
    readonly types: Sequence<ComponentType<any>>;
    private _identifiers;
    private _typeByIdentifier;
    private _identifierByType;
    constructor(capacity: number);
    readonly capacity: number;
    readonly size: number;
    add(type: ComponentType<any>): number;
    delete(type: ComponentType<any>): void;
    delete(type: number): void;
    has(type: ComponentType<any>): boolean;
    has(type: number): boolean;
    getNth(index: number): ComponentType<any>;
    indexOf(type: ComponentType<any>): number;
    get(type: ComponentType<any>): number;
    get(type: number): ComponentType<any>;
    clear(): void;
}
