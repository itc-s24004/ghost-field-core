import { GF_SystemEventDataMap } from "../game/index";

type EventDataMapType = Record<string, any>;

type ListenerMap<EventDataMap extends EventDataMapType> = {
    [K in keyof EventDataMap]?: Array<(data: EventDataMap[K]) => void>;
}

type CategoryListenerMap<EventDataMap extends EventDataMapType, Category extends string> = Map<Category, ListenerMap<EventDataMap>>;



export class CategoryEventEmitter<EventDataMap extends EventDataMapType, Category extends string = string> {
    #listeners: CategoryListenerMap<EventDataMap, Category> = new Map();

    #getCategoryListeners(category: Category) {
        return this.#listeners.get(category) ??  (() => {
            const newCategoryListeners: ListenerMap<EventDataMap> = {};
            this.#listeners.set(category, newCategoryListeners);
            return newCategoryListeners;
        })();
    }
    
    
    
    on<K extends keyof EventDataMap>(category: Category, eventName: K, listener: (data: EventDataMap[K]) => void) {
        const categoryListeners = this.#getCategoryListeners(category);

        const listeners = categoryListeners[eventName] ?? (categoryListeners[eventName] = []);

        listeners.push(listener);
        return this;
    }


    emit<K extends keyof EventDataMap>(eventName: K, data: EventDataMap[K]) {
        this.#listeners.values().forEach(categoryListeners => {
            const listeners = categoryListeners[eventName];
            if (listeners) listeners.forEach(listener => listener(data));
        });
        return this;
    }


    off<K extends keyof EventDataMap>(category: Category, eventName: K, listener: (data: EventDataMap[K]) => void) {
        const categoryListeners = this.#listeners.get(category);
        if (!categoryListeners) return;

        const listeners = categoryListeners[eventName];
        if (!listeners) return;

        const index = listeners.indexOf(listener);
        if (index !== -1) listeners.splice(index, 1);
        return this;
    }


    offCategory(category: Category) {
        this.#listeners.delete(category);
        return this;
    }


    offEvent<K extends keyof EventDataMap>(eventName: K) {
        this.#listeners.forEach(categoryListeners => {
            delete categoryListeners[eventName];
        });
        return this;
    }

    offCategoryEvent<K extends keyof EventDataMap>(category: Category, eventName: K) {
        const categoryListeners = this.#listeners.get(category);
        if (categoryListeners) delete categoryListeners[eventName];
        return this;
    }


    offAll() {
        this.#listeners.clear();
        return this;
    }


    /**
     * 複数のイベントを監視します。
     * コールバックはラッピングされるため、offで個別にリスナーを削除することはできません。
     * @param category 
     * @param eventNames 
     * @param callback 
     */
    watch<K extends keyof EventDataMap>(category: Category, eventNames: K[], callback: (eventName: K) => void) {
        const categoryListeners = this.#getCategoryListeners(category);
        eventNames.forEach(eventName => {
            const listeners = categoryListeners[eventName] ?? (categoryListeners[eventName] = []);
            listeners.push(() => callback(eventName));
        })
        return this;
    }
}