export const useReferral = (): string | null => {
  return new URLSearchParams(window.location.search).get("refId");
};
