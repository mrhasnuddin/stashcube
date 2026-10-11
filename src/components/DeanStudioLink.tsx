export const STUDIO_URL = "https://dean-fi.my";

/** Credit link to the studio site. Opens in a new tab. */
export function DeanStudioLink({ children = "DeanStudio" }: { children?: React.ReactNode }) {
  return (
    <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
