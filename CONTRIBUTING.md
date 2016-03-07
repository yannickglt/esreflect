# Contributing

## Reporting bugs

If you've found an issue, please submit it in the issues.

## Pull requests

We love pull requests from everyone. If it's your first Pull Request, you can learn how from this free series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

If you would like to add functionality, please submit an issue first to make sure it's a direction we want to take.

Please do the following:

- Follow the existing styles (we have an .editorconfig file)
- Document your changes in the README (try to follow the convention you see in the rest of the file)
- Unit test your changes and keep the code coverage to 100%


### Development
Fork, then clone the repo:

    git clone git@github.com:yannickglt/reflectionjs.git

Set up your machine:

    npm install

Make sure the tests pass:

    npm run build
    npm run test

Make your change:

    npm run watch

Add tests for your change. Make the tests pass:

    npm run test

Push to your fork and [submit a pull request][pr].

[pr]: https://github.com/yannickglt/reflectionjs/compare/

At this point you're waiting on us. We like to at least comment on pull requests
within three business days (and, typically, one business day). We may suggest
some changes or improvements or alternatives.

Some things that will increase the chance that your pull request is accepted:

* Write tests.
* Follow our [style guide][style].
* Write a [good commit message][commit].

[style]: https://github.com/thoughtbot/guides/tree/master/style
[commit]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y
