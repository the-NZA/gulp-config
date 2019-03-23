# Gulp Config

## Usage
----

 1. Clone this repo or download `gulpfile.js`, `.babelrc`, `package.json` and `.gitignore`
 2. Use `npm i` for install Gulp and other modules
 3. Customize `gulpfile.js` and `package.json` for yours project

 ## Project Structure (Default)
 ----

 After you clone repo and install all modules you'll create `src` folder with `js`, `less` and `images` subfolders.
 You should get the following structure:
 ```
  - src
    - less
    - js
    - images
 ```

 `Build` folder and subfolders will create automatically after task run.

 ## Includes
 ----

 Let's start with styles: 
   - I'll recommend you use `main.less` only for importing other styles in the correct order
   - First `@import` add `Normalize.css` — one of the best reset css projects
   - When you run **build** or **watch** all `LESS` and `CSS` files will concat, get prefixes and minify(inculing media group queries)

 Now let's talk about scripts:
   - For better scripts combane and use module system we use `WebPack-Stream`
   - Entry point is `index.js` that can get all exports from other `*.js` files
   - After you run **build** or **watch** `index.js` doing his job, `babel` will use `env-preset` and `uglify js` will minify all sctipts to the final `main.js` in `build` folder

 Also, you can optimize images:
   - Put your images into `src/images` and run `gulp imgMin'
   - Your images will optimized and move to `build/images`

## Terminal Commands
----
**Development Mode**
 - Use `gulp dev` for start **browser-sync**, build your project *with sourcemaps*. 
 - `ctrl + c` or ` control + c` to stop **browser-sync**

**Production Mode** 
 - Use `gulp build` for build final version of your project *(without sourcemaps)*


If you want update styles and scripts without full rebuild use this commands:
 - `gulp styles` for **Production Mode** 
 - `gulp devStyles` for **Development Mode**
 - `gulp scripts` for **Production Mode** 
 - `gulp devScripts` for **Development Mode**