import Player from "./Player.js";
import Vector from "./assets.js";
import {SHAPES,COLORS} from "./SHAPES.js";
import {createMatrix} from "./assets.js";

export default class Board{

	constructor(ctx,pixelH){

		this.ctx = ctx;
		this.pixelH = pixelH;
		this.width = this.ctx.canvas.width;
		this.height = this.ctx.canvas.height;
		this.grid = new Vector(((this.height / this.pixelH) | 0), ((this.width / this.pixelH) | 0));
		this.innerGrid = createMatrix(this.grid.x,this.grid.y);
		this.player = new Player(this.ctx,this.grid.x, this.grid.y);
		this.paused = false;
		this.initialized = false;
		this.limit200 = 200;
		this.limit500 = 500;
		this.thousandP = false;
		this.twoThousandP = false;
		this.keysB = {};

	}

	initialize(initializerImage){

		this.ctx.imageSmoothingQuality = "high";
		this.ctx.drawImage(initializerImage, (this.grid.y / 2) - 2, (this.grid.x / 2) - 2, 4,4);

	}

	keyboardEvents(document,mainCallback){

		agregarEvento(document,"keydown",ev =>{
			this.keysB[ev.keyCode] = true;
		});

		agregarEvento(document,"keyup",ev =>{
			this.keysB[ev.keyCode] = false;
		});

		function agregarEvento(element,eventName,callback){

			element.addEventListener ? element.addEventListener(eventName,callback,false) : element.attachEvent 
									? element.attachEvent(eventName,callback) : 0;

		}

	}

	collision(){

		const [playerMatrix, playerPos] = [this.player.currentShape, this.player.pos];

		for(let y = 0; y < playerMatrix.length; y++){

			for(let x = 0; x < playerMatrix[y].length; x++){

				if(playerMatrix[y][x] !== 0 && (this.innerGrid[y + playerPos.y] && this.innerGrid[y + playerPos.y][x + playerPos.x]) !== 0){

					return true;

				}

			}

		}
		return false;
	}

	displayPausedText(){

		this.ctx.font = "1.2px Lucida Console";
		const gradient = this.ctx.createLinearGradient(0, 0, this.grid.x, 0);
		gradient.addColorStop("0.1"," magenta");
		gradient.addColorStop("0.4", "blue");
		gradient.addColorStop("1.0", "red");

		this.ctx.fillStyle = gradient;
		this.ctx.textAlign = "center";
		this.ctx.fontWeight = "bold";
		this.ctx.fillText("¡Paused!", (this.grid.y / 2), (this.grid.x / 2) - 1);

	}

	pointSpecialCounter(dropInterval,soundManager,mainAudio){

		if(!this.thousandP && this.player.points >= 1000 && this.player.points < 2000){

			this.thousandP = true;
			soundManager.playSound("before_thousand_points");
			soundManager.playSound("thousand_points");

			if(dropInterval - 100 >= 30){
				dropInterval -= 100;
			}

			return dropInterval;

		}else if(!this.twoThousandP && this.player.points >= 2000){

			this.twoThousandP = true;
			soundManager.playSound("two_thousand_points");
			mainAudio.pause();
			soundManager.sounds.two_thousand_points.onended = ()=>{mainAudio.src = "sounds/mario star theme.wav"; mainAudio.play()};

			if(dropInterval - 100 >= 30){
				dropInterval -= 100;
			}

			return dropInterval;

		}else{

			if(this.player.points >= 200){

				if((this.player.points - (this.player.points % 200)) % 200 === 0 && this.limit200 == this.player.points - (this.player.points % 200)){

					soundManager.playSound("each200P");
					this.limit200 += 200;

					if(dropInterval - 20 >= 30){
						dropInterval -= 20;
					}

					return dropInterval;

				}else if((this.player.points - (this.player.points % 500)) % 500 === 0 && this.limit500 == this.player.points - (this.player.points % 500)){

					soundManager.playSound("each500P");
					this.limit500 += 500;

					if(dropInterval - 50 >= 30){
						dropInterval -= 50;
					}

					return dropInterval;

				}

			}

		}

		return dropInterval;

	}

	pause(ev,soundManager){

		if(ev.keyCode === 13){

			this.paused = this.paused ? false : true;
			soundManager.playSound("pause_sound");

		}

	}

	clearBackground(){

		this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);

	}

	drawBackground(img,rows,cols){

		this.ctx.imageSmoothingQuality = "high";
		this.ctx.drawImage(img,0,0,rows,cols);

	}

	drawGrid(factor){

		this.innerGrid.forEach((row,y)=>{

			row.forEach((value,x) =>{

				if(value !== 0){

					this.ctx.save();
					this.ctx.fillStyle = COLORS[value];
					this.ctx.strokeStyle = "#fff";
					this.ctx.lineWidth = (2 / factor);
					this.ctx.lineCap = "square";
					this.ctx.fillRect(x,y,1,1);
					this.ctx.strokeRect(x,y,1,1);
					this.ctx.stroke();
					this.ctx.restore();

				}

			});

		});

	}

	endGame(soundManager,mainAudio,audioName,dropInterval){

		let i = 0;
		do{

			for(let j = 0; j < this.innerGrid[i].length; j++){

				if(this.innerGrid[i][j] !== 0 && this.collision()){

					this.paused = true;
					soundManager.sounds[audioName].play();
					alert(`¡Haz hecho un total de: ${this.player.points} puntos!`);
					dropInterval = this.reset(mainAudio,dropInterval);
					this.paused = false;
					break;

				}

			}

		i++;
		}while(i != 1);

		return dropInterval;

	}

	reset(mainAudio,dropInterval){

		this.innerGrid.forEach(row =>{

			row.fill(0);

		});

		this.player.points = 0;
		this.thousandP = false;
		this.twoThousandP = false;
		this.limit200 = 200;
		this.limit500 = 500;
		this.player.canChangePiece = true;
		this.player.savedSpotIndex = undefined;
		this.player.savedSpot = undefined;
		mainAudio.src = "sounds/tetris_song.wav";
		mainAudio.play();
		dropInterval = 1000;
		for(let keysC in this.keysB){
			this.keysB[keysC] = false;
		}
		return dropInterval;

	}

	copyToGrid(){

		this.player.currentShape.forEach((row,y) =>{

			row.forEach((value,x)=>{

				if(value !== 0){

					this.innerGrid[y + this.player.pos.y][x + this.player.pos.x] = value;

				}

			});

		});

	}

	scaleBoard(){

		this.ctx.scale(this.pixelH,this.pixelH);

	}

}