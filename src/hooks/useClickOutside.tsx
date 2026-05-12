import { useEffect } from 'react';

export default function useClickOutside(
  ref: React.RefObject<
    HTMLInputElement | HTMLTextAreaElement | HTMLDivElement | null
  >,
  callback: () => void,
) {
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        !!callback &&
        ref.current !== null &&
        !ref.current.contains(e.target as Node)
      ) {
        callback();
      }
    }

    document.addEventListener('click', onClickOutside, true);

    return () => {
      document.removeEventListener('click', onClickOutside, true);
    };
  }, [callback, ref]);
}
