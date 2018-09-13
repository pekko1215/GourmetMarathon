var EnemmyData = {};
EnemmyData.豚 = class extends Enemmy {
	constructor(x,y,ev){
		super(x,y,ev);
		this.hp = player.level * 2;
		this.exp = player.level;
		this.money = player.level;
		this.frame = 0;
		this.chip = 'image/chip/pig.png';
		this.width = 12;
		this.height = 8;
	}
	ai(){
		this.move(['↓','↑','→','←'][rand(4)]);
	}
	animation(){
		var idx = [0,1,2,1][this.frame];
		var d = {
			'↓':0,
			'←':1,
			'→':2,
			'↑':3
		}[this.direction]
		var ret = {
			width:32,
			height:32,
			left:-32*idx,
			top:-d*32
		}
		this.frame ++;
		if(this.frame >= 4) this.frame = 0;
		return ret;
	}
}
