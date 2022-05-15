import {COLORS} from "./SHAPES.js";
import {createMatrix} from "./assets.js";
export default class Trail{

	constructor(ctx,board,currentPieceMatrix,currentPieceIndex){

		this.ctx = ctx;
		this.board = board;
		this.factor = board.pixelH;
		this.innerTrail = this.copyArray(currentPieceMatrix);
		this.indexTrail = currentPieceIndex;
		this.pos = Object.assign({},board.player.pos);
		this.canDrop = true;

	}

	copyArray(matrix){

		let newMatrix = createMatrix(matrix.length, matrix[0].length);

		newMatrix.forEach((row,y)=>{

			row.forEach((value,x)=>{

				newMatrix[y][x] = matrix[y][x];

			});

		});

		return newMatrix;

	}


	collideTrail(){

		const [playerMatrix, playerPos] = [this.innerTrail, this.pos];

		for(let y = 0; y < playerMatrix.length; y++){

			for(let x = 0; x < playerMatrix[y].length; x++){

				if(playerMatrix[y][x] !== 0 && (this.board.innerGrid[y + playerPos.y] && this.board.innerGrid[y + playerPos.y][x + playerPos.x]) !== 0){

					return true;

				}

			}

		}
		return false;
	}

	update(currShape,currIndex){

		this.indexTrail = currIndex;
		this.innerTrail = this.copyArray(currShape);
		this.resetTrail();
		this.dropTrail();
		this.drawTrail();

	}

	resetTrail(){

		this.pos = Object.assign({},this.board.player.pos);

	}

	dropTrail(){

		while(!this.collideTrail()){

			this.pos.y++;

			if(this.collideTrail()){
				this.pos.y--;
				break;
			}

		}

	}

	drawTrail(){

		this.innerTrail.forEach((row,y)=>{

			row.forEach((value,x)=>{

				if(value !== 0){

					this.ctx.save();
					this.ctx.fillStyle = COLORS[this.indexTrail];
					this.ctx.strokeStyle = "#fff";
					this.ctx.lineWidth = (2 / this.factor);
					this.ctx.globalAlpha = 0.4;
					this.ctx.fillRect(this.pos.x + x,this.pos.y + y,1,1);
					this.ctx.strokeRect(this.pos.x + x, this.pos.y + y, 1, 1);
					this.ctx.stroke();
					this.ctx.restore();

				}

			});

		});

	}

}