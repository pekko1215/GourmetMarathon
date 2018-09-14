var EnemmyData = {};
EnemmyData.豚 = class extends Enemmy {
	constructor(x,y,ev){
		super(x,y,ev);
		this.hp = Mapdata.level + 4;
		this.exp = Mapdata.level + 1;
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
				this.atack(1.2*Mapdata.level)
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
	drop(){
		if(!rand(10)){
			return new Item(ItemData.smartFilter('ぶたにく','name')[0]);
		}
	}
}

EnemmyData.軍隊豚 = class extends EnemmyData.豚 {
	constructor(x,y,ev){
		super(x,y,ev);
		this.hp = Mapdata.level;
		this.exp = ~~(Mapdata.level*1.4);
		this.name = "軍隊ブタ"
		this.mode = null;
	}
	ai(){
		if(this.mode){
			var diff;
			var rect = new Rect(this.x-2,this.y-2,5,5);
			Mapdata.enemmys.filter(e=>/ブタ/.test(e.name)&&!e.mode&&rect.included(e.x,e.y)).forEach(e=>e.mode = true);
			if(diff = this.isContactPlayer()){
				this.direction = this.getDirectionByTarget(player.x,player.y)
				this.atack(Mapdata.level*1.4);
			}else{
				this.move(this.getDirectionByTarget(player.x,player.y))
			}
		}else{
			this.move(['↓','↑','→','←'][rand(4)]);
		}
	}
	onDamage(){
		this.mode = true;
		this.$.style.filter = "hue-rotate(70deg)";
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
			top:-d*32 - 32*4
		}
		this.$.style.filter = "hue-rotate(120deg)";
		this.frame++;
		if(this.frame >= 4) this.frame = 0;
		return ret;
	}
	drop(){
		if(!rand(10)){
			return new Item(ItemData.smartFilter('ぶたにく','name')[0]);
		}
	}
}