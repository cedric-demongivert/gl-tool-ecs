import { Set } from './Set'
import { StaticCollection } from './StaticCollection'

export interface StaticSet<T> extends Set<T>, StaticCollection<T> {

}
