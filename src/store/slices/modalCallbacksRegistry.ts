type ModalCallbacks = {
  onClick?: () => void;
  onClick2?: () => void;
};

const registry = new Map<string, ModalCallbacks>();

export function setModalCallbacks(key: string, callbacks: ModalCallbacks) {
  registry.set(key, callbacks);
}

export function getModalCallbacks(key: string): ModalCallbacks | undefined {
  return registry.get(key);
}

export function deleteModalCallbacks(key: string) {
  registry.delete(key);
}
