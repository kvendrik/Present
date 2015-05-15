Present
=======
## A very minimalistic HTML presentation framework.

### How to use
1. Clone this repo, move into the folder and install the dependencies `git clone https://github.com/kvendrik/Present.git && cd Present && sudo npm install`
2. Run `grunt` to start a server on `*:9000`
3. Start customizing the slides' markup in `dev/ejs/index.ejs` and modifing the styling of the theme and slides in `dev/ejs/scss/theme.scss` and `dev/ejs/scss/slides.scss`

#### Dev Dependencies
Present uses [grunt](http://gruntjs.com/) for its development server, compiling SASS and concatting and uglifying JavaScript. In order to be able to use grunt you need to have the grunt-cli installed: `npm install -g grunt-cli`.

#### Grunt Tasks
Present uses [grunt](http://gruntjs.com/) for its development server, compiling SASS and concatting and uglifying JavaScript. In order to be able to use grunt you need to have the grunt-cli installed: `npm install -g grunt-cli`.

* `default` starts a server at `127.0.0.1:9000` and watches for changes.
    * When a JS file is changed the concat task will run and output `js/app.js`
    * When a SCSS file is changed the SASS will be compiled to `css/main.css`
    * When a EJS file is changed the `index.ejs` will be compiled to `public/index.html`
* `build` compiles the SCSS files to `public/css/main.css` and uglifies the JS to `public/js/main.min.js`

### Creating slides

#### Markup
* HTML elements with the class `slide` are considered slides
* Within these slides you can use HTML elements with the class `step` to create steps

#### Styling
* `main.scss` contains all the import rules
* `theme.scss` contains styling for the theme
* `slides.scss` contains styling for specific slides

#### Hotlinking
You can link to a specific slide and step by specifing them in the URL.
```
#slide-4&step-2
```

### Mirroring
Present can mirror your presentation on multiple clients. To use this feature start the Node server using `node server.js --port=3000`. This will start a server that serves your presentation on the given port number.
