class MapChip {
    constructor(d) {
        this.type = d;
    }
}

class Item {
	constructor(obj){
		this.name = obj.name;
		this.chip = obj.chip;
		this.text = obj.text;
	}
}

class Food extends Item {
	constructor(obj){
		super(obj);
		this.type = 'food';
		this.hp = obj.hp;
	}
	eat(){

	}
}

class Equipment extends Item{
	constructor(obj){

	}
}

class EventCenter {
    constructor() {
        this.events = [];
    }
    on(fn) {
        this.events.unshift({
            once: false,
            fn
        })
    }
    once(fn) {
        this.events.unshift({
            once: true,
            fn
        })
    }
    fire(arg) {
		var ret = [];
		while(true){
			var ev = this.events.shift();
			ev.fn(arg);
			if(!ev.once){
				ret.unshift(ev);
			}
			if(!this.events.length) break
		}
		this.events = ret;
	}
}

class Actor {
    constructor(x, y, ev) {
        this.x = x;
        this.y = y;
        this.ev = ev;
        this.direction = '↓'
    }
    move(direction) {
        var d = {
            x: 0,
            y: 0
        }
        switch (direction) {
            case '↑':
                d.y--;
                break
            case '↖':
                d.x--;
                d.y--;
                break
            case '←':
                d.x--;
                break
            case '↙':
                d.x--;
                d.y++;
                break
            case '↓':
                d.y++;
                break
            case '↘':
                d.x++;
                d.y++;
                break
            case '→':
                d.x++;
                break
            case '↗':
                d.y--;
                d.x++;
        }
        this.direction = direction;
        var target = Mapdata.getChip(this.x + d.x, this.y + d.y)
        if (Mapdata.canMove(this.x + d.x,this.y + d.y)) {
            // this.ev.once(() => {
				this.moved(this.x,this.y,this.x+d.x,this.y+d.y);
                this.x += d.x;
                this.y += d.y;
            // })
            return true;
        } else {
            return false;
        }
    }
    moved(){}
}

class Enemmy extends Actor {
	constructor(x,y,ev){
		super(x,y,ev);
	}
	turn(){
		this.ai();

	}
	damage(point){
		this.hp -= getDamagePoint(point);
		if(this.hp <= 0){
			this.die();
		}
	}
	die(){
		onDie()
		Mapdata.getChip(this.x,this.y).enemmy = null;
	}
	onDie(){}
	getDamagePoint(point){
		return point;
	}
	moved(x,y,x2,y2){
		var chip1 = Mapdata.getChip(x,y);
		var chip2 = Mapdata.getChip(x2,y2);
		chip1.enemmy = null;
		chip2.enemmy = this;
	}
}

class Dropped extends Actor {
	constructor(x,y,ev,item){
		super(x,y,ev);
		this.item = item;
		var chip = Mapdata.getChip(x,y);
		chip.drop = this;
	}
	catch(){
		if(this.item.onCatch){
			this.item.onCatch();
		}
		player.addItem(this.item);
	}
}

class Chest extends Actor {
	constructor(x,y,item,rank){
		super(x,y,eventCenter);
		this.item = item;
		this.rank = rank;
		this.width = 12;
		this.height = 8;
		this.chip = '/image/chip/chest.png';
	}
	open(){
		if(!this.item) return;
		item.catch();
		this.item = null;
	}
	animation(){
		var left,top;
		switch(this.rank){
			case 0:
				left = 0;
				top = 32 * 2;
			break
			case 1:
				left = 32 * 3;
				top = 32 * 6
			break
			case 2:
				left = 32 * 6;
				top = 32 * 6;
			break
		}
		if(this.item){
			return {
				left,
				top,
				height:32,
				width:32
			}
		}else{
			return {
				left,
				top:top + 32,
				height:32,
				width:32
			}
		}

	}

}

class Player extends Actor {
    constructor(x, y, ev) {
        super(x, y, ev);
        this.hp = 30;
        this.level = 1;
        this.items = [];
		this.equipment = null;
    }
    action(){
		if(Mapdata.getChip(this.x,this.y).drop){
			this.catch();
		}else{
			this.atack();
		}
    }
    catch(){
		var item = Mapdata.getChip(this.x,this.y).drop;
		if(!item) return false;
		item.catch();
    }
    atack(){
		var enemmy = Mapdata.getChip(this.x,this,y).enemmy;
		if(!enemmy) return false;
		enemmy.damage(this.getAttackPoint());
    }
    addItem(item){
		this.items.push(item);
    }
	getAttackPoint(){
		return 1;
    }
}

class GameMap {
    constructor(map) {
        this.map = map.map(arr => {
            return arr.map(d => {
                return new MapChip(d);
            })
        })
        this.width = this.map[0].length;
        this.height = this.map.length;
        this.type = ['通常','モンスターハウス','ボーナス','偏り'][Lottery([7,80,8,5])];
        this.enemmys = [];
    }
    getChip(x, y) {
        return this.map[y][x];
    }
    selectBlankChip() {
        while (true) {
            var pos = {
                x: ~~(Math.random() * this.width),
                y: ~~(Math.random() * this.height)
            }
            if (this.canMove(pos.x,pos.y))
                return pos;
             // break
			continue;
        }
    }
    canMove(x,y){
		var target = this.getChip(x,y);
		return target.type === 'floor' &&
			!target.enemmy && ( !window.player ||
				x !== window.player.x ||
				y !== window.player.y
			)
    }
    bornEnemmy(){
		var count = 0;
		switch(this.type){
			case '通常':
			case '偏り':
				count = 15 + rand(6);
				break
			case 'モンスターハウス':
				count = 80;
				break
			case 'ボーナス':
				count = 0;
		}
		var name;
		for(var i = 0;i < count; i++){
			name = this.type === '偏り' && name ? name :
			['豚','牛','鶏','ミミック','虫','蛇','うさぎ','馬','鹿','猪','熊']
			[Lottery([15,15,15,0.05,2.8,10,12,10,10,10,0.15])];
			if(true === true){
				name = '豚';
			}
			var pos = this.selectBlankChip();
			var enemmy = new EnemmyData[name](pos.x,pos.y,eventCenter);
			this.getChip(pos.x,pos.y).enemmy = enemmy;
			this.enemmys.push(enemmy);
		}
    }
}