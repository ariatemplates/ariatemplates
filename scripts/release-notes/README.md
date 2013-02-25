This folder includes to templates to be used with [git-release-notes](https://github.com/ariatemplates/git-release-notes).

    npm install -g git-release-notes

From this project folder

    git-release-notes v1.3.6..v1.3.7 wiki.ejs -t "^([a-z]+) #(\d+) (.*)$" -m type -m issue -m title > wiki.txt
