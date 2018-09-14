var EnemmyData = {};
EnemmyData.豚 = class extends Enemmy {
	constructor(x,y,ev){
		super(x,y,ev);
		this.hp = player.level + 4;
		this.exp = player.level;
		this.money = player.level;
		this.frame = 0;
		this.chip = 'image/chip/pig.png';
		this.width = 12;
		this.height = 8;
		this.name = "あばれブタ"
		this.mode = null;
	}
	ai(){
		if(this.mode){
			var diff;
			if(diff = this.isContactPlayer() && rand(2)){
				this.direction = this.getDirectionByTarget(player.x,player.y)
				this.attack(1)
			}else{
				this.move(this.getDirectionByTarget(player.x,player.y))
			}
		}else{
			this.move(['↓','↑','→','←'][rand(4)]);
		}
	}
	onDamage(){
		this.mode = true;
		this.$.style.filter = "hue-rotate(40deg)";
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
		this.frame++;
		if(this.frame >= 4) this.frame = 0;
		return ret;
	}
}
