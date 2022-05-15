import {SHAPES,COLORS} from "./SHAPES.js";
import Vector from "./assets.js";
import {createMatrix} from "./assets.js";
export default class Player{

	constructor(ctx,rows,cols){

		this.ctx = ctx;
		this.boardCols = cols;
		this.boardRows = rows;
		this.shapeIndex = this.newPiece;
		this.nextShapeIndex = this.newPiece;
		this.savedSpotIndex;
		this.currentShape = this.copiedArray(this.shapeIndex);
		this.nextShape = this.copiedArray(this.nextShapeIndex);
		this.savedShape;
		this.canChangePiece = true;
		this.pos = new Vector(((this.boardCols / 2) | 0) - ((this.currentShape.length / 2) | 0),0);
		this.points = 0;

	}

	copiedArray(index){

		let rows = SHAPES[index].length;
		let cols = SHAPES[index][0].length;

		const newMatrix = createMatrix(rows,cols);

		for(let i = 0; i < SHAPES[index].length; i++){

			for(let j = 0; j < SHAPES[index][0].length; j++){

				newMatrix[i][j] = SHAPES[index][i][j];

			}

		}

		return newMatrix;

	}

	get newPiece(){

		return ((Math.random() * SHAPES.length) | 0);

	}

	set saveIndex(index){

		this.savedSpotIndex = index;

	}

	set saveShape(shape){

		this.savedShape = shape;

	}

	set currIndex(index){

		this.shapeIndex = index;

	}

	set currShape(shape){

		this.currentShape = shape;

	}

	replaceShape(auto = false){

		this.shapeIndex = this.nextShapeIndex;
		this.currentShape = this.copiedArray(this.nextShapeIndex);
		if(!auto){
			this.pos.x = ((this.boardCols / 2) | 0) - ((this.currentShape.length / 2) | 0);
		}
		this.nextShapeIndex = this.newPiece;
		this.nextShape = this.copiedArray(this.nextShapeIndex);

	}

	drop(){

		this.pos.y++;

	}

	rotate(dir = 1){

		for(let y = 0; y < this.currentShape.length; y++){

			for(let x = 0; x < y; x++){

				[
					this.currentShape[y][x],
					this.currentShape[x][y]
				] = [
					this.currentShape[x][y],
					this.currentShape[y][x]
				] 

			}

		}

		if(dir > 0){

			this.currentShape.forEach(row =>{row.reverse()});

		}else{

			this.currentShape.reverse();

		}

	}

	collectRows(innerGrid){

		let lines = 0;

		pass: for(let i = innerGrid.length - 1; i > 0; i--){

			for(let j = 0; j < innerGrid[i].length; j++){

				if(innerGrid[i][j] === 0){

					continue pass;

				}

			}

			const newRow = innerGrid.splice(i, 1)[0].fill(0);
			innerGrid.unshift(newRow);
			if(lines == 0){
				lines++;
				lines*=20;
			}else{
				lines *= 2;
			}
			i++;
		}

		this.points += lines;

	}

	saveNewSpot(ev,board,trail){

		if(ev.keyCode === 32 && this.canChangePiece){

			this.saveIndex = this.shapeIndex;
			this.saveShape = this.copiedArray(this.savedSpotIndex);
			this.replaceShape(true);
			this.canChangePiece = false;

			const position = this.pos.x;
			let offset = 1;
			while(board.collision()){

				this.pos.x += offset;
				trail.pos.x += offset;
				offset = -(offset + (offset > 0 ? 1 : -1));
				if(offset > this.currentShape[0].length){

					this.rotate(1);
					this.pos.x = position;
					trail.pos.x = position;
					trail.update(this.currentShape,this.shapeIndex);
					return;

				}

			}
			trail.update(this.currentShape,this.shapeIndex);

		}

	}

	chooseSavedSpot(ev,board,trail){

		if(ev.keyCode === 83){

			if(this.savedShape !== undefined){

				this.currIndex = this.savedSpotIndex;
				this.currShape = this.copiedArray(this.savedSpotIndex);
				this.saveIndex = undefined;
				this.saveShape = undefined;

				const position = this.pos.x;
				let offset = 1;
				while(board.collision()){

					this.pos.x += offset;
					trail.pos.x += offset;
					offset = -(offset + (offset > 0 ? 1 : -1));
					if(offset > this.currentShape[0].length){

						this.rotate(1);
						this.pos.x = position;
						trail.pos.x = position;
						trail.update(this.currentShape,this.shapeIndex);
						return;

					}

				}
				trail.update(this.currentShape,this.shapeIndex);

			}

		}

	}

	move(board,soundManager,mainSound,dropInterval, trail){

		if(board.initialized){

			if(!board.paused){

				if(board.keysB[37]){
					soundManager.playSound("rotation_moving");
					board.pointSpecialCounter(dropInterval,soundManager,mainSound);
					this.pos.x--;
					trail.resetTrail();
					trail.pos.x--;
					if(board.collision()){

						this.pos.x++;
						trail.pos.x++;

					}

				}


				if(board.keysB[38]){
					soundManager.playSound("drop_song");
					board.pointSpecialCounter(dropInterval,soundManager,mainSound);
					while(!board.collision()){

						this.drop();
						if(board.collision()){
							this.pos.y--;
							board.copyToGrid();
							this.replaceShape();
							this.canChangePiece = true;
							this.pos.y = 0;
							break;
						}

					}
					trail.resetTrail();
					board.keysB[38] = false;
				}

				if(board.keysB[39]){

					soundManager.playSound("rotation_moving");
					board.pointSpecialCounter(dropInterval,soundManager,mainSound);
					this.pos.x++;
					trail.pos.x++;
					if(board.collision()){

						this.pos.x--;
						trail.pos.x--;

					}

				}

				if(board.keysB[40]){
					soundManager.playSound("rotation_moving");
					board.pointSpecialCounter(dropInterval,soundManager,mainSound);
					this.drop();
					if(board.collision()){
						this.pos.y--;
						board.copyToGrid();
						this.replaceShape();
						this.canChangePiece = true;
						this.pos.y = 0;
						trail.resetTrail();
					}
					board.keysB[40] = false;
				}

				if(board.keysB[65]){

					soundManager.playSound("rotation_moving");
					board.pointSpecialCounter(dropInterval,soundManager,mainSound);
					const position = this.pos.x;
					let offset = 1;
					this.rotate(-1);
					while(board.collision()){

						this.pos.x += offset;
						trail.pos.x += offset;
						offset = -(offset + (offset > 0 ? 1 : -1));
						if(offset > this.currentShape[0].length){

							this.rotate(1);
							this.pos.x = position;
							trail.pos.x = position;
							trail.update(this.currentShape,this.shapeIndex);
							return;

						}

					}
					trail.update(this.currentShape,this.shapeIndex);
					board.keysB[65] = false;

				}

				if(board.keysB[68]){

					soundManager.playSound("rotation_moving");
					board.pointSpecialCounter(dropInterval,soundManager,mainSound);
					const position2 = this.pos.x;
					let offset2 = 1;
					this.rotate(1);
					while(board.collision()){

						this.pos.x += offset2;
						trail.pos.x += offset2;
						offset2 = -(offset2 + (offset2 > 0 ? 1 : -1));
						if(offset2 > this.currentShape[0].length){

							this.rotate(-1);
							this.pos.x = position2;
							trail.pos.x = position2;
							trail.update(this.currentShape,this.shapeIndex);
							return;

						}

					}
					trail.update(this.currentShape,this.shapeIndex);
					board.keysB[68] = false;

				}

			}

		}

	}

	draw(factor){

		this.currentShape.forEach((row,y)=>{

			row.forEach((value,x)=>{

				if(value !== 0){

					this.ctx.save();
					this.ctx.fillStyle = COLORS[value];
					this.ctx.strokeStyle = "#fff";
					this.ctx.lineWidth = (2 / factor);
					this.ctx.fillRect(this.pos.x + x,this.pos.y + y,1,1);
					this.ctx.strokeRect(this.pos.x + x, this.pos.y + y, 1, 1);
					this.ctx.stroke();
					this.ctx.restore();

				}

			});

		});

	}

}