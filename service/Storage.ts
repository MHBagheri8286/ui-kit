export enum StorageType { Local = 1, Session }

export interface IStorage {
    storage: Storage;
    set<T>(key: string, value: T, type?: StorageType): void;
    get<T>(key: string, type?: StorageType): T;
    remove(key: string, type?: StorageType): boolean;
    setStorage(type: StorageType): void;
}

const Storage: IStorage = () => { };

Storage.set = <T>(key: string, value: T, type: StorageType = StorageType.Local) => {
    Storage.storage = type === StorageType.Session ? sessionStorage : localStorage;
    try {
        Storage.storage.setItem(key, JSON.stringify(value));
    } catch (e) {
        // QUOTA_EXCEEDED_ERR
        // localStorage is full
    }
}

Storage.get = <T>(key: string, type: StorageType = StorageType.Local): T => {
    Storage.storage = type === StorageType.Session ? sessionStorage : localStorage;
    let value: any;
    let object: T;
    try {
        value = Storage.storage.getItem(key);
        object = JSON.parse(value);
    } catch (e) {
        object = value as T;
    }
    return object;
}

Storage.remove = (key: string, type: StorageType = StorageType.Local): boolean => {
    Storage.storage = type === StorageType.Session ? sessionStorage : localStorage;
    Storage.storage.removeItem(key);
    return true;
}

Storage.setStorage = (type: StorageType) => {
    Storage.storage = type === StorageType.Session ? sessionStorage : localStorage;
}

Storage.storage = localStorage;

export default Storage;