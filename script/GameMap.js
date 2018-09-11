class MapChip {
	constructor(d){
		this.type = d;
	}
}

class GameMap {
	constructor(map){
		this.map = map.map(arr=>{
			return arr.map(d=>{
				return new MapChip(d);
			})
		})
	}
}