import {COLORS,SHAPES} from "./SHAPES.js";
import Vector from "./assets.js";
import {createMatrix} from "./assets.js"
export default class NextShape{

	constructor(ctx, scaleFactor){

		this.ctx = ctx;
		this.scaleFactor = scaleFactor;
		this.canvas = this.ctx.canvas;
		this.width = this.canvas.width;
		this.height = this.canvas.height;

	}

	clearNS(){

		this.ctx.clearRect(0,0,this.width, this.height);

	}

	drawNS(index,shape){

		SHAPES[index].forEach((row,y)=>{

			const offset = new Vector(0,0);
			if(index !== 1 && index !== 2 && index !== 3 && index !== 6){

				offset.x = (this.width / 2) - ((shape.length / 2) * this.scaleFactor);
				offset.y = (this.height / 2) - ((shape.length / 2) * this.scaleFactor);

			}else if(index === 1){

				offset.x = (this.width / 2) - ((shape.length / 2) * this.scaleFactor) + (this.scaleFactor / 2);
				offset.y = (this.height / 2) - ((shape.length / 2) * this.scaleFactor);

			}else{

				offset.x = (this.width / 2) - ((shape.length / 2) * this.scaleFactor);
				offset.y = (this.height / 2) - ((shape.length / 2) * this.scaleFactor) + (this.scaleFactor / 2);

			}

			row.forEach((value,x)=>{

				if(value !== 0){

					this.ctx.save();
					this.ctx.fillStyle = COLORS[value];
					this.ctx.strokeStyle = "#fff";
					this.ctx.lineWidth = 2;
					this.ctx.fillRect((x * this.scaleFactor) + offset.x, (y * this.scaleFactor) + offset.y, this.scaleFactor,this.scaleFactor);
					this.ctx.strokeRect((x * this.scaleFactor) + offset.x, (y * this.scaleFactor) + offset.y, this.scaleFactor, this.scaleFactor);
					this.ctx.stroke();
					this.ctx.restore();

				}

			});

		});

	}

}

export class SavedShape extends NextShape{

	constructor(ctx, scaleFactor){

		super(ctx, scaleFactor);

	}

}