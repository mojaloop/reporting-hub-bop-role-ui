/** The app's routes, below wherever the shell mounts it. */
export const Path = {
  subjects: 'subjects',
  roles: 'roles',
  newRole: 'new',
} as const;

export const RouteParam = { subject: 'subject', role: 'role' } as const;

export const subjectsPath = (base: string): string => `${base}/${Path.subjects}`;
export const subjectPath = (base: string, subject: string): string =>
  `${subjectsPath(base)}/${encodeURIComponent(subject)}`;
export const rolesPath = (base: string): string => `${base}/${Path.roles}`;
export const rolePath = (base: string, role: string): string =>
  `${rolesPath(base)}/${encodeURIComponent(role)}`;
export const newRolePath = (base: string): string => `${rolesPath(base)}/${Path.newRole}`;
