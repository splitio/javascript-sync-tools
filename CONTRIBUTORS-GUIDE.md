# Contributing to the Split Javascript Sync Tools

Split Javascript Sync Tools is an open source project and we welcome feedback and contribution. The information below describes how to build the project with your changes, run the tests, and send the Pull Request(PR).

## Development

### Development process

1. Fork the repository and create a topic branch from `development` branch. Please use a descriptive name for your branch.
2. While developing, use descriptive messages in your commits. Avoid short or meaningless sentences like: "fix bug".
3. Make sure to add tests for both positive and negative cases.
4. Run the linter script of the project and fix any issues you find.
5. Run the build script and make sure it runs with no errors.
6. Run all tests and make sure there are no failures.
7. `git push` your changes to GitHub within your topic branch.
8. Open a Pull Request(PR) from your forked repo and into the `development` branch of the original repository.
9. When creating your PR, please fill out all the fields of the PR template, as applicable, for the project.
10. Check for conflicts once the pull request is created to make sure your PR can be merged cleanly into `development`.
11. Keep an eye out for any feedback or comments from Split's SDK team.

### Building the tools

For widespread use of the tools with different environments and module formats, we have two different builds:
* A **ES2015** modules compatible build.
* A **CommonJS** modules compatible build.

The different builds can be generated all at once with the command `npm run build`. Refer to [package.json](package.json) for more insight on the build scripts.

_Note:_ In order to run build/tests commands, Node 10 or higher is required.

### Running tests

The project includes unit as well as integration tests.

- To execute unit tests, run `npm run test:unit`
- To execute e2e tests, you need a Redis service up and running with the default configurations, and run `npm run test:e2e`.

All tests can be run at once with the command `npm run test`.

For additional testing scripts, refer to our [package.json](package.json) file.

### Linting and other useful checks

Consider running the linter script (`npm run check`) and fixing any issues before pushing your changes.

# Contact

If you have any other questions or need to contact us directly in a private manner send us a note at sdks@split.io
