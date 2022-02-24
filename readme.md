# Nunjucks TailwindCSS Starter Kit

# What it does:

This is a starter-kit that lets you quickly build websites with Nunjucks and gulp, using TailwindCSS.

## Requirements

- Node: [https://nodejs.org/en/download](https://nodejs.org/en/download)
- Yarn : [https://yarnpkg.com/](https://yarnpkg.com/) or NPM: [https://www.npmjs.com/](https://www.npmjs.com/)

## Credits

- This is a fork from [https://github.com/wzulfikar/nunjucks-starter-kit](https://github.com/wzulfikar/nunjucks-starter-kit)
- Tailwind Free Landing page template from [https://github.com/tailwindtoolbox/Landing-Page/](https://github.com/tailwindtoolbox/Landing-Page/)

## Reference

- TailwindCSS https://tailwindcss.com/
- Nunjucks official docs: [https://mozilla.github.io/nunjucks]([https://mozilla.github.io/nunjucks)

### How to use

1. download & unzip: [https://github.com/benninkcorien/nunjucks-gulp-tailwindcss/archive/master.zip](https://github.com/benninkcorien/nunjucks-gulp-tailwindcss/archive/master.zip)
   or
   git clone https://github.com/benninkcorien/nunjucks-gulp-tailwindcss.git

- install dependencies: run `yarn install` or `npm install` to install everything listed in package.json
- run `gulp auto` . this will launch browsersync and watch for changes etc.
- try changing one of the pages inside `src/pages` & your browser will auto-reload, displaying the change you just made.

![](screenshot.jpg)

> _Run `gulp minify` if you want to minify your html files inside `dist` folder_

### How to change

Change the .njk files in src/templates/partials or add your own.
Add them to the {% maincontent %} block where you want them

    {% block maincontent %}
        {% include 'partials/section1.njk' %}
        {% include 'partials/3blocks.njk' %}
        {% include 'partials/pricing-table.njk' %}
        {% include 'partials/call-to-action.njk' %}
    {% endblock maincontent %}

---

# Why?

- works out of the box!
- example included (using tailwind css):
  - `src/pages` for page content
  - `src/templates` for page layout
- output is plain html (stored in `dist` directory)
- serverless
- can use free service like surge.sh, github pages for hosting
- minimum knowledge needed: html, css, js – no need for php, ruby, etc.
- minifier included! use `gulp minify`

## Directory Layout

Here is the project structure:

- `dist` : this directory contains real files that will be hosted
- `dist/assets` : all css, js, images, fonts and whatever assets related to app are located here
- `src` : raw files used to develop the app
- `src/pages` : pages for the app, everything here will be rendered to `dist` directory
- `src/templates` : layout files
- `src/templates/partials` : partial files like nav, user-tabs, menu, etc

## Sample workflow

A. without auto-render

1. edit pages in src

- run `gulp`
- publish `dist` to hosting provider

B. with auto-render

1. run `gulp watch`

- as you edit src, dist gulp watch will do the rendering behind the scene n updates dist directory: you need to reload your browser to see the changes
- publish dist to hosting provider

C. with auto-render & auto-reload (via browsersync)

1. run `gulp auto`

- This will open `http://localhost:3000` in your browser
- using this workflow, when you edit any files in `src` the `dist` files will be updated (just like workflow B) and your browser (`http://localhost:3000`) will be reloaded automatically.

## Page variables

### Set page title

You can set the title (browser tab title) in your src/pages \*.njk files

    {% set title = 'Home' %}

### Set page name

Page names are used by the nav menu to mark the current menu item

Add the pages you want to appear in the nav menu to the navitems in src/templates/partials/nav.njk

    {% set navitems = [
        { title: 'Home', url: 'index.html', pagename: 'home' },
        { title: 'About', url: 'about.html', pagename: 'about' },
        { title: 'Contact us', url: 'contact-us.html', pagename: 'contact' },
        { title: 'in-page JS', url: 'in-page-js.html', pagename: 'inpagejs' }
    ] %}

---

## Changelog

24-2-2022 : Fixed the src path for the css in the header, everything is working now.
