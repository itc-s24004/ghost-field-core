type EventDataMapType = Record<string, any>;
export declare class CategoryEventEmitter<EventDataMap extends EventDataMapType, Category extends string = string> {
    #private;
    on<K extends keyof EventDataMap>(category: Category, eventName: K, listener: (data: EventDataMap[K]) => void): this;
    emit<K extends keyof EventDataMap>(eventName: K, data: EventDataMap[K]): this;
    off<K extends keyof EventDataMap>(category: Category, eventName: K, listener: (data: EventDataMap[K]) => void): this | undefined;
    offCategory(category: Category): this;
    offEvent<K extends keyof EventDataMap>(eventName: K): this;
    offCategoryEvent<K extends keyof EventDataMap>(category: Category, eventName: K): this;
    offAll(): this;
    /**
     * 複数のイベントを監視します。
     * コールバックはラッピングされるため、offで個別にリスナーを削除することはできません。
     * @param category
     * @param eventNames
     * @param callback
     */
    watch<K extends keyof EventDataMap>(category: Category, eventNames: K[], callback: (eventName: K) => void): this;
}
export {};
