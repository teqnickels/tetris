$(function() {
	var canvas = document.getElementsByClassName('board')[0];
	var ctx = canvas.getContext("2d");
	var linecount = document.getElementsByClassName('lines')[0];
	var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');
	var width = 12;
	var height = 20;
	var tilesz = 26;
	canvas.width = width * tilesz;
	canvas.height = height * tilesz;

	var board = [];
	for (var r = 0; r < height; r++) {
		board[r] = [];
		for (var c = 0; c < width; c++) {
			board[r][c] = "";
		}
	}

	function drawSquare(ctx, x, y) {
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

	function randomPiece(){
		var p = pieces[parseInt(Math.random() * pieces.length, 10)];
		return new Piece(p[0], p[1]);
	}

	var pieceOnDeck = null;

	function newPiece() {
		var piece = pieceOnDeck || randomPiece();
		pieceOnDeck = randomPiece();
		drawOnDeck();
		return piece;
	}

	function drawOnDeck(){
		var onDeckCanvas = document.getElementsByClassName("tetron-next-piece")[0]
		var ctx = onDeckCanvas.getContext("2d");
		pieceOnDeck.draw(ctx)
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

	Piece.prototype.lock = function() {
		for (var ix = 0; ix < this.pattern.length; ix++) {
			for (var iy = 0; iy < this.pattern.length; iy++) {
				if (!this.pattern[ix][iy]) {
					continue;
				}

				if (this.y + iy < 0) {
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

	Piece.prototype._fill = function(ctx, color) {
		var fs = ctx.fillStyle;
		ctx.fillStyle = color;
		var x = this.x;
		var y = this.y;
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

	Piece.prototype.draw = function(ctx) {
		this._fill(ctx, this.color);
	};

	var piece = null;

	var dropStart = Date.now();
	var downI = {};

	$('body').keydown(function(event) {
		console.log(event.which);
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


	function main() {
		var now = Date.now();
		var delta = now - dropStart;

		if (delta > 1000) {
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


});
