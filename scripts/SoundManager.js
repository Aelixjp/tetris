import {ROUTES,SOUNDS} from "./SOUNDS.js";
export default class SoundManager{

	constructor(){

		this.routes = Object.assign({},ROUTES);
		this.sounds = Object.assign({},SOUNDS);
		this.soundError = false;

	}

	loadSounds(){

		const promise = new Promise((resolve,reject)=>{

			for(let j in this.sounds){

				this.sounds[j].load();
				this.sounds[j].onerror = ()=>{

					reject();

				}

			}

			resolve();


		});

		promise.catch(()=>{

			this.soundError = true;
			console.error(`¡Ha habido un error al cargar el audio!`);

		});

	}

	decreaseVolume(...audioNames){

		if(!this.soundError){

			for(let i = 0; i < audioNames.length; i++){

				if(this.sounds[audioNames[i]]){

					this.sounds[audioNames[i]].volume = 0.05;

				}else{

					return console.error(`¡ERROR: El audio ${audioNames[i]} no existe!`);

				}

			}

		}

	}

	playSound(soundName){

		this.sounds[soundName].play();

	};

	pauseSound(soundName){

		this.sounds[soundName].pause();

	}

	muteSound(board,mainSound){

		if(!board.initialized){

			mainSound.play();
			mainSound.loop = true;
			board.initialized = true;

		}else{

			mainSound.muted = mainSound.muted ? false : true;

		}

	}

	loadSrc(){

		for(let i in this.sounds){

			for(let j in this.routes){

				if(i === j){

					this.sounds[i].preload = "none";
					this.sounds[i].src = this.routes[j];

				}

			}

		}

		this.loadSounds();

	}

	changeSrc(mainSound, newName){

		mainSound.src = newName;

	}

}