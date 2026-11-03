## Structuring the code

- `src/App/App.tsx` is the router of the screens, relative to where the app is mounted.
- `src/App/Subjects.tsx`, `SubjectPage.tsx`, `Roles.tsx` and `RolePage.tsx` are the screens: one per route, each a page around one of the IAM's elements.
- `src/App/elements.tsx` registers the IAM's elements and binds a page to one: how it reaches the IAM, and its events.
- `src/App/permissions.tsx` answers which of the IAM's operations the caller holds, through `/me/permissions`.
- `src/App/paths.ts` names the routes; `src/App/Page.tsx` is the page frame and the permission gate around an element.
- `src/iam.tsx` holds where the IAM is and the client the app asks it with; `src/config.ts` reads the runtime configuration.
- `src/Injector.tsx` and `src/Menu` are what the shell loads; `src/bootstrap.tsx` runs the app on its own.

The IAM's data lives in its elements, each reading what it shows and changing it; the app keeps no copy of it.
