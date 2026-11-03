## Development Steps

- [Adding changes](#adding-changes)
- [Commit and push]('#commit-and-push)

### Adding Changes

Generally, when adding a new feature to the app, the steps to do perform the tasks can be summarized as follow:

1. Understand the requirements, and which of the IAM's operations they need
2. Try to split the problem in smaller problems. The smaller the problem, the easier to solve. Keep a reasonable size for a problem to be solved
3. Take the data's types from `@mojaloop/authz-ui`, which generates them from the IAM's API document
4. Show the IAM's screens through its elements (`src/App/elements.tsx`), handing them the options `usePermissions` says the caller holds, and map their navigation events to the app's routes
5. Build what the elements do not cover, the page around them, from the component library
6. Write tests against fixed answers of the IAM's public API and the session

At this point you should iterate over the last steps and do the following:

1. Refine the behaviour each time
2. Understand what logic is reusable and goes in a helper
3. Refine the types: it's not trivial to figure out exactly what are the exact types your module will need at the beginning

**Note**: it is strongly suggested to commit and push frequently.

### Commit and push

It's a good practice to commit and push your changes frequently. 

Pre-commit and pre-push git hooks have been setup to help identify and catch issues **locally** ahead of time; changes breaking tests won't be allowed to be pushed to the remote git repo.

Additionally, a proper CI is setup using github actions.



