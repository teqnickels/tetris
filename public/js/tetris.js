$(function() {
	var canvas = document.getElementsByClassName('board')[0];
	var ctx = canvas.getContext("2d");
	var linecount = document.getElementsByClassName('lines')[0];
	var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');
	var width = 12;
	var height = 28;
	var tilesz = 30;

	canvas.width = width * tilesz;
	canvas.height = height * tilesz; //achieves getting extra canvas, except that extra canvas is on bottom

	console.log(ctx)

	var board = [];
	for (var r = 0; r < height; r++) {
		board[r] = [];
		for (var c = 0; c < width; c++) {
			board[r][c] = "";
		}
	}

	function drawSquare(ctx, x, y) {
		console.log("Y is ", y, "when we draw the squares")
		console.log("tilesz is ", tilesz, "when we draw the squares")

		ctx.fillRect(x * tilesz, y * tilesz, tilesz, tilesz);
		var ss = ctx.strokeStyle;
		ctx.strokeStyle = "#ED0E7D";
		ctx.strokeRect(x * tilesz, y * tilesz, tilesz, tilesz);
		ctx.strokeStyle = "#888";
		// ctx.strokeRect(x * tilesz + 3*tilesz/8, y * tilesz + 3*tilesz/8, tilesz/4, tilesz/4);
		ctx.strokeStyle = ss;
	}

	var pieces = [
		[I, "cyan"],
		[J, "blue"],
		[L, "orange"],
		[O, "yellow"],
		[S, "green"],
		[T, "purple"],
		[Z, "red"]
	];

	//Which piece to draw
	function randomPiece() {
		var p = pieces[parseInt(Math.random() * pieces.length, 10)];
		//shape and color
		return new Piece(p[0], p[1]);
	}

	var pieceOnDeck = null;
	// piece is either going to equal the piece on deck, if no piece on deck, then 
	// piece is randomPiece()
	function newPiece() {
		var piece = pieceOnDeck || randomPiece();
		pieceOnDeck = randomPiece();
		drawOnDeck();
		return piece;
	}
	
	//Clearing the piece on deck before adding the next piece on deck
	function clearDeck() {
		var onDeckCanvas = document.getElementsByClassName("tetron-next-piece")[0]
		var ctx = onDeckCanvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	//Add the next incoming piece to the piece on deck
	function drawOnDeck() {
		clearDeck()
		var onDeckCanvas = document.getElementsByClassName("tetron-next-piece")[0]
		var ctx = onDeckCanvas.getContext("2d");
		pieceOnDeck.draw(ctx, 2)

	}

	function Piece(patterns, color) {
		this.pattern = patterns[0];
		this.patterns = patterns;
		this.patterni = 0;
		this.color = color;
		this.x = width/2-parseInt(Math.ceil(this.pattern.length/2), 10);
		this.y = -2;
	}

	Piece.prototype.rotate = function() {
		var nudge = 0;
		var nextpat = this.patterns[(this.patterni + 1) % this.patterns.length];

		if(this._collides(0, 0, nextpat)) {
			nudge = this.x > width / 2 ? -1 : 1;
		}

		if (!this._collides(nudge, 0, nextpat)) {
			this.undraw(ctx);
			this.x += nudge;
			this.patterni = (this.patterni + 1) % this.patterns.length;
			this.pattern = this.patterns[this.patterni];
			this.draw(ctx);
		}
	};

	var WALL = 1;
	var BLOCK = 2;

	Piece.prototype._collides = function(dx, dy, pat) {
		for (var ix = 0; ix < pat.length; ix++) {
			for (var iy = 0; iy < pat.length; iy++) {
				if (!pat[ix][iy]) {
					continue;
				}
				var x = this.x + ix + dx;
				var y = this.y + iy + dy;
				if (y >= height || x < 0 || x >= width) {
					return WALL;
				}
				if (y < 0) {
					continue;
				}
				if (board[y][x] !== "") {
					return BLOCK;
				}
			}
		}
		return 0;
	};

	Piece.prototype.down = function() {
		if (this._collides(0, 1, this.pattern)) {
			this.lock();
			piece = newPiece();
		} else {
			this.undraw(ctx);
			this.y++;
			this.draw(ctx);
		}
	};

	Piece.prototype.moveRight = function() {
		if (!this._collides(1, 0, this.pattern)) {
			this.undraw(ctx);
			this.x++;
			this.draw(ctx);
		}
	};

	Piece.prototype.moveLeft = function() {
		if (!this._collides(-1, 0, this.pattern)) {
			this.undraw(ctx);
			this.x--;
			this.draw(ctx);
		}
	};

	var lines = 0;
	var done = false;

	//Read to understand this portion, this feature doesn't work
	Piece.prototype.lock = function() {
		for (var ix = 0; ix < this.pattern.length; ix++) {
			for (var iy = 0; iy < this.pattern.length; iy++) {
				if (!this.pattern[ix][iy]) {
					console.log('this.pattern[ix][iy]', this.pattern[ix][iy])
					continue;
				}
				console.log('this.y', this.y, 'iy', iy)
				console.log('this.y + iy', this.y + iy ," <---- This number has to be less than or equal to 0 to lose game")
				if (this.y + iy <= 0) {
					// Game ends!
					alert("You're done!");
					done = true;
					return;
				}
				board[this.y + iy][this.x + ix] = this.color;
			}
		}
		var nlines = 0;
		for (var y = 0; y < height; y++) {
			var line = true;
			for (var x = 0; x < width; x++) {
				line = line && board[y][x] !== "";
			}
			if (line) {
				for (var y2 = y; y2 > 1; y2--) {
					for (var x = 0; x < width; x++) {
						board[y2][x] = board[y2-1][x];
					}
				}
				for (var x = 0; x < width; x++) {
					board[0][x] = "";
				}
				nlines++;
			}
		}
		if (nlines > 0) {
			lines += nlines;
			drawBoard();
			linecount.textContent = "Lines: " + lines;
		}
	};

	Piece.prototype._fill = function(ctx, color, yOffset = 0 ) {
		var fs = ctx.fillStyle;
		ctx.fillStyle = color;
		var x = this.x;
		var y = this.y + yOffset;

		console.log('X is: ', x, 'Y is: ', y);

		for (var ix = 0; ix < this.pattern.length; ix++) {
			for (var iy = 0; iy < this.pattern.length; iy++) {
				if (this.pattern[ix][iy]) {
					drawSquare(ctx, x + ix, y + iy);
				}
			}
		}
		ctx.fillStyle = fs;
	};

	Piece.prototype.undraw = function(ctx) {
		this._fill(ctx, clear);
	};

	Piece.prototype.draw = function(ctx, yOffset) {
		this._fill(ctx, this.color, yOffset);
	};

	var piece = null;
	var dropStart = Date.now();
	var downI = {};

	$('body').keydown(function(event) {
	    if(event.which == 38){
	      piece.rotate()
	      dropStart = Date.now()
	    }
	    if(event.which == 40){
	      piece.down()
	    }
	    if(event.which == 37){
	      piece.moveLeft()
	      dropStart = Date.now()
	    }
	    if(event.which == 39){
	      piece.moveRight()
	      dropStart = Date.now()
	    }
		})

	function drawBoard() {
		var fs = ctx.fillStyle;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				ctx.fillStyle = board[y][x] || clear;
				drawSquare(ctx, x, y);
			}
		}
		ctx.fillStyle = fs;
	}

//This handles the timing of the drop
	function main() {
		var now = Date.now();
		var delta = now - dropStart; //elapsed time since the game last updated (previous frame)

		if (delta > 1000) { //if delta timing is greater than 1 second
			piece.down();
			dropStart = now;
		}

		if (!done) {
			requestAnimationFrame(main);
		}
	}

	piece = newPiece();
	drawBoard();
	linecount.textContent = "Lines: 0";
	main();

	$('.start').click(function() {
		location.reload();
	});

	
	const pauseButton = document.getElementsByClassName('pause')[0]
	pauseButton.addEventListener('click', pauseGame)

	// Get the modal
	var modal = document.getElementById('myModal');
	
	// Get the button that opens the modal
	// var btn = document.getElementById("myBtn");
	
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	
	// When the user clicks the button, open the modal
	// btn.onclick = function () {
		// 		modal.style.display = "block";
		// }
		
		function pauseGame() {
			console.log('OPENING THE MODAL!')
			// let gameState = ctx.save()
			modal.style.display = "block";
			console.log('THIS IS THE GAME STATE', gameState)
		}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
			modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
			if (event.target == modal) {
					modal.style.display = "none";
			}
	} 

});
