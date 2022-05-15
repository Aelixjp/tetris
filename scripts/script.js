import Board from "./Board.js";
import NextShape,{SavedShape} from "./NextShape.js";
import SoundManager from "./SoundManager.js";
import Trail from "./trail.js";

window.onload = ()=>{

	let points = document.querySelector("#points");
	const canvas = document.getElementById("canvas");
	const tetris_song = document.getElementById("tetris_sound");
	const ctx = canvas.getContext("2d");
	const nextShape = document.querySelector("#nextShape");
	const nextCTX = nextShape.getContext("2d");
	const savedShape = document.getElementById("fichaGuardada");
	const savedShapeCTX = savedShape.getContext("2d");

	const scaleFactor = 30;
	const moveInterval = 2;
	let dropCounter = 0;
	let dropInterval = 1000;
	let moveCounter = 0;
	let lastTime = 0;
	let board;
	let player;
	let nextShapeAside;
	let savedSpot;
	let soundManager;
	let trail;

	//TO REFACTOR
	const playButton = new Image();
	playButton.src = "images/play button.png";

	const imageGrid = new Image();
	imageGrid.src = "images/grid.gif";
	//TO REFACTOR

	function setup(){

		board = new Board(ctx,scaleFactor);
		nextShapeAside = new NextShape(nextCTX, scaleFactor);
		savedSpot = new SavedShape(savedShapeCTX, scaleFactor);
		soundManager = new SoundManager();
		trail = new Trail(ctx,board,board.player.currentShape,board.player.shapeIndex);
		board.scaleBoard();
		soundManager.loadSrc();
		soundManager.decreaseVolume("rotation_moving", "drop_song");

	}

	function manageControl(ev){
		if(ev.keyCode === 88){

			board.player.points += 20;

		}

		board.pause(ev,soundManager);
		board.player.saveNewSpot(ev,board,trail);
		board.player.chooseSavedSpot(ev,board,trail);
		dropInterval = board.endGame(soundManager,tetris_song,"gameOver_sound",dropInterval);
		dropCounter = ev.keyCode === 38 || ev.keyCode === 40 && board.initialized && !(board.paused) ? 0 : dropCounter;
	}

	function draw(time = 0){

		const deltaTime = time - lastTime;
		let lastPoints = board.player.points;
		lastTime = time;
		board.clearBackground();
		/*board.drawBackground(imageGrid,board.grid.y,board.grid.x);*/

		if(board.initialized){

			nextShapeAside.clearNS();
			nextShapeAside.drawNS(board.player.nextShapeIndex, board.player.nextShape);

			if(board.player.savedSpotIndex !== undefined){
				savedSpot.clearNS();
				savedSpot.drawNS(board.player.savedSpotIndex, board.player.savedShape);
			}else{
				savedSpot.clearNS();
			}

			dropInterval = board.endGame(soundManager,tetris_song,"gameOver_sound",dropInterval);
			board.drawGrid(scaleFactor);
			trail.update(board.player.currentShape,board.player.shapeIndex);
			board.player.collectRows(board.innerGrid);

			if(lastPoints != board.player.points){soundManager.playSound("collecting_row")};

			points.textContent = board.player.points;
			dropInterval = board.pointSpecialCounter(dropInterval,soundManager,tetris_song);

			dropCounter += deltaTime;
			if(dropCounter > dropInterval && !(board.paused)){

				board.player.drop();
				trail.resetTrail();
				if(board.collision()){

					soundManager.playSound("drop_song");
					board.player.pos.y--;
					trail.pos.y--;
					board.copyToGrid();
					board.player.replaceShape();
					board.player.pos.y = 0;
					trail.resetTrail();

				}

				dropCounter = 0;
			}

			if(moveCounter === moveInterval){
				board.player.move(board,soundManager,tetris_song,dropInterval,trail);
				moveCounter = 0;
			}

			if(moveCounter > moveInterval){
				moveCounter = 0;
			}
			
			board.player.draw(scaleFactor);
			if(board.paused){
				board.displayPausedText();
			}

		}else{

			board.initialize(playButton);

		}

		moveCounter+=0.5;
		requestAnimationFrame(draw);
	}

	setup();
	draw();
	
	board.keyboardEvents(document,manageControl);
	document.addEventListener("keydown", (ev)=>{manageControl(ev)});
	canvas.addEventListener("click", ()=>{soundManager.muteSound(board,tetris_song)});
	
}