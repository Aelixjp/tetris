export default class Vector{

	constructor(x,y){

		this.x = x;
		this.y = y;

	}

}

export function createMatrix(rows,cols){

	const newMatrix = [];

	for(let i = 0; i < rows; i++){

		newMatrix.push(new Array(cols));
		newMatrix[i].fill(0);

	}

	return newMatrix;

}
