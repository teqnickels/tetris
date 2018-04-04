# Browser Games - Tetron

## Project Overview

Tetron is a learning project that allows a user to play tetris in their browser. This project was an assignment from the Learner's Guild and the specs are derived from the assignment. 

![Image of game](https://github.com/teqnickels/tetris/blob/master/Screen%20Shot%202018-03-29%20at%203.58.53%20PM.png)

The original specs can be found below in this document. My goal was to learn about: 
  - JavaScript object oriented programming
  - Canvas
 
## Installation Instructions
```
git clone https://github.com/teqnickels/tetris.git
npm install
npm start
```
## How To Play

In your terminal:

    - In your browser go to: http://127.0.0.1:4321/tetris.html
    - Use the <- & -> arrow keys to move pieces from left to right
    - The up arrow rotates the pieces
   
## File List

```
tetris
  ├── package.json
  └── public
      ├── css
      │   └── tetris.css
      ├── images
      │   ├── neon-background.jpg
      │   └── tetron.png
      ├── js
      │   ├── tetris.js
      │   └── tetrominoes.js
      └── tetris.html
```

## Licensing

MIT License

## Known Bugs

- Currently, users are not able to pause a game
- There are no levels.
- Pieces do not speed up with the user's success.

## Changelog

_Coming Soon_

## News
_Coming Soon_ 

## Original Specs from Assignment: 
__General__

 - [x] Artifact produced is a fork of the browser-games repo.
 - [x] Variables, functions, files, etc. have appropriate and meaningful names.
 - [x] HTML, CSS, and JS files are well formatted with proper spacing and indentation.
 - [x]  There is a clear separation of game logic code from view/rendering code.
 - [x] All major features are added via pull requests with a clear description and concise commit messages.
 - [x] The artifact produced is properly licensed, preferably with the MIT license.

__Tetris__

 - [ ] User stories and features for the game are added as issues to your repo with the label feature or user-story 
 - [ ] You’ll have to define these yourself by looking at the rules of the game and coming up with the right user stories & features
 - [x] jQuery is used for DOM manipulation code
 - [x] Tetris game can be found at public/tetris.html
 - [x] Tetris game is playable
 - [x] Players have a score
 - [x] Game page is linked from public/index.html

__Stretch__

  - [ ] Players can configure the key mapping (e.g. change the “drop” key to the space bar)
  - [ ] Game follows object-oriented patterns using ES6 classes

__Resources__

jQuery Learning Center #jquery
Code School: Try jQuery #jquery #js #dom
CSS Tricks: Learn jQuery from Scratch #jquery #js #dom
Tetris Tutorial https://github.com/jonhoo/tetris-tutorial/
Video series on building tetris: part 1, part 2, part 3, and part 4

