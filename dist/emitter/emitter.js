export class CategoryEventEmitter {
    #listeners = new Map();
    #getCategoryListeners(category) {
        return this.#listeners.get(category) ?? (() => {
            const newCategoryListeners = {};
            this.#listeners.set(category, newCategoryListeners);
            return newCategoryListeners;
        })();
    }
    on(category, eventName, listener) {
        const categoryListeners = this.#getCategoryListeners(category);
        const listeners = categoryListeners[eventName] ?? (categoryListeners[eventName] = []);
        listeners.push(listener);
        return this;
    }
    emit(eventName, data) {
        this.#listeners.values().forEach(categoryListeners => {
            const listeners = categoryListeners[eventName];
            if (listeners)
                listeners.forEach(listener => listener(data));
        });
        return this;
    }
    off(category, eventName, listener) {
        const categoryListeners = this.#listeners.get(category);
        if (!categoryListeners)
            return;
        const listeners = categoryListeners[eventName];
        if (!listeners)
            return;
        const index = listeners.indexOf(listener);
        if (index !== -1)
            listeners.splice(index, 1);
        return this;
    }
    offCategory(category) {
        this.#listeners.delete(category);
        return this;
    }
    offEvent(eventName) {
        this.#listeners.forEach(categoryListeners => {
            delete categoryListeners[eventName];
        });
        return this;
    }
    offCategoryEvent(category, eventName) {
        const categoryListeners = this.#listeners.get(category);
        if (categoryListeners)
            delete categoryListeners[eventName];
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
    watch(category, eventNames, callback) {
        const categoryListeners = this.#getCategoryListeners(category);
        eventNames.forEach(eventName => {
            const listeners = categoryListeners[eventName] ?? (categoryListeners[eventName] = []);
            listeners.push(() => callback(eventName));
        });
        return this;
    }
}
