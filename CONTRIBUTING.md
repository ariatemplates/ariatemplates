# Contribute to Aria Templates

The Aria Templates team is eager to have your feedback and ready to accept your great ideas. Don't be shy!

We suggest you to fork the project, use it in any way you can and make adjustments according to your tastes.
Let us know of any bug you find and whatever change you make, we'd be glad to review it and possibly include it in our build for anyone to use it.

[Source code](https://github.com/ariatemplates/ariatemplates) and [documentation](https://github.com/ariatemplates/usermanual) are hosted on GitHub.
You should be familiar with git and GitHub, but don't be afraid, you can always rely on [help.github.com](https://help.github.com/) to gain some confidence.

There are many ways in which you can contribute to the project, but, as you can easily imagine, all of them require some knowledge of the project. If you have none, start from our [user manual](http://ariatemplates.com/usermanual) and try out our [guides](http://ariatemplates.com/guides/).

## Report a defect
With every release we fix bugs and introduce new ones. Finding them is fun and challenging, I bet you to do it!

If you feel like something is wrong, please try to:

* Search on github issues / stackoverflow / the web for similar problems, this avoids duplicates submissions of defects
* Try to reproduce the error with the latest version of the code, or even with master. The issue might be already fixed

Having tried that, please create a GitHub issue providing as much details as possible, like the version that is causing the problem, the browser you're using, a description of what you do and if possible a sample of code or template.

Please, try to describe with accuracy the steps to reproduce the error, unfortunately we're not in your mind.

Once we fix an issue we make sure that there's a regression test to guarantee that the bug doesn't occur anymore. When creating an issue, it would be perfect if you could already provide a test case!

## Submit new ideas

You've got a brilliant idea that might save you time when developing Aria Templates applications? Share it.

Submit a feature request as a GitHub issue using label `type:improve/new feature` or [contact us](http://ariatemplates.com/about/contact)


## Contribute code
This is the simplest and fastest way to see your fixes / ideas included inside Aria Templates.

Good code is

- readable
- maintainable
- reusable
- testable
- performant
- documented

We put lot of effort into write good code, so should you!
Be sure to follow our [guidelines](http://ariatemplates.com/usermanual/Code_Standards).

__We won't accept code without a proper test__. You were warned!
If you want to know more about testing Aria Templates code, please have a look at the [README](test/README.md) file in _test_ folder.

Before you start coding, take this advice: [__Test Driven Development (TDD)__](http://en.wikipedia.org/wiki/Test-driven_development) rocks!

At any stage of development, feel free to contact us for suggestions, code review or general support, we're here to help.

Done with testing + coding? Create a __pull request__ from your forked repository.

Here's the process we follow in the team. We believe it'll be good for you as well:

> * Fork the project
> * Clone your fork on your machine
>
> ````
>  git clone https://github.com/<your username>/ariatemplates.git`
> ````
>
> * Copy our [hooks](https://github.com/ariatemplates/ariatemplates/tree/master/hooks) into your `.git/hooks` folder
> * Create a topic branch
>
> ````
>  git checkout -b cool_feature
> ````
>
> * __Enjoy coding__
>
> You can commit as may times you want, push to your fork and handle the history the way you prefer
>
> * Make sure all test cases pass
> * Rebase your commits into logical chunks ( `git rebase` ), or squash everything into one commit
> ````
>  git fetch upstream
>
>  git rebase --merge upstream/master
>
>  git checkout -b cool_feature_clean
>
>  git merge --squash cool_feature
>
>  git commit
>
>  git push origin cool_feature_clean
> ````
> * Open a pull request
>
> Please provide a detailed description of your changes. Your code should be self-explanatory, but a good pull request description is always appreciated.

When you commit make sure to provide a good commit message. Messages should be informative and easy to understand.

__DON'T__:

> Fixes a dialog issue

__BETTER__:

> fix #123 Dialog not centered in IE
>
> When a Dialog is opened with \`center:true\` and \`block:true\`, its position is set to 0:0, should be centered in the viewport.
>
> Close #456.

Remember:

- The first line is a short description. It should start with "fix #123" for a bugfix, "feat #123" for a new feature, or "refactor" (#123 is the GitHub issue ID).
- The next paragraphs provide more explanation if necessary.
- In the last line, add "Close #456" as many times as necessary, to [close the related issues / a pull request once the commits lands in master](https://github.com/blog/1386-closing-issues-via-commit-messages). If the first starts with "feat #123", you should duplicate that ID here.

For brand new features, make sure to write some documentation.
You'll see how in the [next chapter](#improve-documentation).

When new code is submitted, someone from the team will review it and eventually integrate it.



## Advertise

If you like the project, let the world know.

Write a blog post about us, link our pages to your blog or website, talk about Aria Templates on your social networks or while having a coffee with your colleagues, star the project on github, be creative...


