## Contribution Rules

There is a precise approach on how to contribute to this project and there are security measures setup specifically to prevent unwanted behaviours.

- [Pushing to the repo](#pushing-to-the-repo)
- [Unit testing the code](#unit-testing-the-code)
- [Versioning strategy](#versioning-strategy)

### Pushing to the repo 

When adding changes to the repo, make sure the following rules are respected:

- Changes need to be test covered. Read how to [unit testing the code](#unit-testing-the-code)
- Changes are prettified. Not doing it will cause the linting test to fail
- Changes are merged only via Pull Requests, pushing to master is disabled
- Pull Request names need to include the JIRA ticket for automatic linking purposes
- Pull Requests need to pass status checks (tests, lints, and build steps need to be successful)
- Pull Requests need to be reviewed
- Pull Requests need to be change the project version accordingly to the type of change they apply. Please follow the [versioning strategy reference](.#versioning-strategy)

### Unit testing the code

Code should always be tested; unit tests can save a lot of time debugging and prevent unwanted bugs to appear ahead of time.

The screens are tested with [Vitest](https://vitest.dev) and the [react-testing-library](https://testing-library.com/docs/react-testing-library/intro/), against fixed answers of the IAM's public API and of the person's session. A test mounts the app at the path the shell would, with the permissions the session holds, drives the IAM's elements inside their shadow roots, and checks the route the app takes, what it offers, and what the app sends the IAM.

### Versioning Strategy

Versioning is done via `yarn version`. 

> :warning: Changing the version should be done in the last commit of a branch/PR.

Since `yarn version` automatically creates tags when the version is changed, the command can be suppressed with `--no-git-tag-version`.

Usually a _patch_ version change is enough; if a new page/module is added, instead, a _minor_ should be used.
