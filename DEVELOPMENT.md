# Running ForrestJS

ForrestJS uses [Lerna](https://lerna.js.org/) to facilitate the management of
a monorepo of NPM modules.

The first step is to install the dependencies for the main project (Lerna)
and for all the packages that you are going to work with:

    yarn boot

Now you can bootstrap your local installation with:

    yarn test

This will go and install the NPM dependencies and fix the cross linking package
by package. It's quite cool.

## Testing it on a project

Say you did create a ForrestJS project using the CLI utility:

    cd /dev
    npm forrest run p1

Now you have a ForrestJS running project in `/dev/p1`. It contains all the latest
versions of the available packages.

But now you want to change stuff in the original folders and somehow rebuild the
artifacts so that your test project could run your code.

Long story short _npm link_ has some troubles so we created an NPM script in each
package that will Bable out to a `${TARGET}` folder.

Thanks to Lerna it's a breeze to build all the sources into a target project:

    TARGET=/dev/p1 lerna run watch:to
    TARGET=/dev/p1 lerna run build:to

Now you can change ForrestJS code as you want and it will build directly into your
project folder :-)

