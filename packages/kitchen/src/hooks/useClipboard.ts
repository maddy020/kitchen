import React from "react";
import usePortal from "./usePortal";
import useWarning from "./useWarning";

export type UseClipboardOptions = {
  onError: () => unknown;
};

export type UseClipboardResult = {
  copy: (text: string) => void;
};

const defaultOptions: UseClipboardOptions = {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  onError: () => useWarning("Failed to copy.", "useClipboard"),
};

const useClipboard = (options: UseClipboardOptions = defaultOptions) => {
  const el = usePortal("clipboard");

  const copyText = (el: HTMLElement | null, text: string) => {
    if (!el || !text) return;
    const selection = window.getSelection();
    if (!selection) return;

    el.style.whiteSpace = "pre";
    el.textContent = text;

    const range = window.document.createRange();
    selection.removeAllRanges();
    range.selectNode(el);
    selection.addRange(range);
    try {
      window.document.execCommand("copy");
    } catch (e) {
      options.onError && options.onError();
    }

    selection.removeAllRanges();
    if (el) {
      el.textContent = "";
    }
  };

  const copy = React.useCallback(
    (text: string) => {
      copyText(el, text);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [el]
  );

  return { copy };
};

export default useClipboard;
