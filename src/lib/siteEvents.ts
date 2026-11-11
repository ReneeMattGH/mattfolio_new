export const OPEN_PROJECT_EVENT = 'matt:open-project';
export const FILTER_PROJECTS_EVENT = 'matt:filter-projects';

export function requestProjectOpen(id: string): void {
  window.dispatchEvent(new CustomEvent<string>(OPEN_PROJECT_EVENT, { detail: id }));
}

export function requestProjectFilter(category: string): void {
  window.dispatchEvent(
    new CustomEvent<string>(FILTER_PROJECTS_EVENT, { detail: category }),
  );
}
