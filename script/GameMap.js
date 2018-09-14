class MapChip {
    constructor(d) {
        this.type = d;
    }
}

class Item {
	constructor(obj){
		Object.assign(this,obj);
		this.name = obj.name;
		this.chip = obj.chip;
		this.text = obj.text;
	}
	catch(){
		Mapdata.messageLog(`${this.name} を手に入れた`);
		player.items.push(this);
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
        this.died = false;
    }
    getDirectionByTarget(px,py){
		var x = px - this.x;
		var y = py - this.y;
		var up = y < 0 ? -y : 0;
		var down = y > 0 ? y : 0;
		var right = x > 0 ? x : 0;
		var left = x < 0 ? -x : 0;
		return ['↑','↓','→','←'][[up,down,right,left].findIndex(d=>d)];
    }
    getTarget(direction = this.direction){
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
        return d;
    }
    move(direction) {
        var d = this.getTarget(direction);
        this.direction = direction;
        var target = Mapdata.getChip(this.x + d.x, this.y + d.y)
        if (Mapdata.canMove(this.x + d.x,this.y + d.y)) {
			this.moved(this.x,this.y,this.x+d.x,this.y+d.y);
            this.x += d.x;
            this.y += d.y;
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
	ai(){}
	damage(point){
		var damage = this.getDamagePoint(point);
		this.hp -= damage
		if(this.hp <= 0){
			this.die();
		}
		this.onDamage(damage)
		return damage;
	}
	onDamage(){}
	die(){
		this.onDie()
		Mapdata.getChip(this.x,this.y).enemmy = null;
		this.died = true;
		if(this.$) {
			this.$.style.opacity = 0;
			var $ = this.$;
			setTimeout(()=>{
				$.parentNode.removeChild($)
				this.$ = null;
			},500)
		}
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
	isContactPlayer(){
		var x = player.x - this.x;
		var y = player.y - this.y
		if((x == 0 && y*y == 1) || (y == 0 && x*x == 1)){
			return {x,y};
		}
		return false;
	}
	attack(point){
		player.damage(point)
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

class Chest extends Enemmy {
	constructor(x,y,item,rank){
		super(x,y,eventCenter);
		this.item = item;
		this.rank = rank;
		this.width = 12;
		this.height = 8;
		this.hp = 1;
		this.chip = '/image/chip/chest.png';
	}
	onDamage(){
		this.item.catch();
	}
	animation(){
		var left,top;
		switch(this.rank){
			case '木':
				left = 0;
				top = -32 * 2;
			break
			case '赤':
				left = -32 * 3;
				top = -32 * 6
			break
			case '金':
				left = -32 * 6;
				top = -32 * 6;
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
			return this.catch();
		}else{
			return this.atack();
		}
    }
    catch(){
		var item = Mapdata.getChip(this.x,this.y).drop;
		if(!item) return false;
		item.catch();
    }
    atack(){
		var d = this.getTarget();
		var enemmy = Mapdata.getChip(this.x+d.x,this.y+d.y).enemmy;
		if(!enemmy) return null;
		return {
			damage:enemmy.damage(this.getAttackPoint()),
			target:enemmy,
			type:'atack'
		}
    }
    damage(point){
		this.hp -= this.getDamagePoint(point);
		this.onDamage(point);
		if(this.hp <= 0){
			this.die();
		}
    }

    getDamagePoint(point){
		return point;
    }

    onDamage(){

    }

    die(){
		Mapdata.gameOver();
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
        this.type = ['通常','モンスターハウス','ボーナス','偏り'][Lottery([80,7,8,5])];
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
		this.bornChest();
    }
    bornChest(){
		var count = 0;
		var chestTypeTable;
		switch(this.type){
			case '通常':
				count = 12 + rand(5);
				chestTypeTable = [94,5,1];
			case '偏り':
				count = 12 + rand(5);
				chestTypeTable = [70,25,5];
				break
			case 'モンスターハウス':
				count = 15 + rand(6);
				chestTypeTable = [90,8,2];
				break
			case 'ボーナス':
				count = 24 + rand(7);
				chestTypeTable = [94,5,1];
		}
		var name;
		for(var i = 0;i < count; i++){
			var chestType = ['木','赤','金'][Lottery(chestTypeTable)];
			var chestLevel = Lottery({
				'木':[70,30, 0, 0, 0],
				'赤':[10,20,50,20, 0],
				'金':[ 0, 0,35,60, 5]
			}[chestType])+1;
			var list = ItemData.filter(item=>item.rarity == chestLevel);
			var item = list[~~(Math.random()*list.length)];
			var pos = this.selectBlankChip();
			var chest = new Chest(pos.x,pos.y,new Item(item),chestType);
			this.getChip(pos.x,pos.y).enemmy = chest;
			this.enemmys.push(chest);
		}
    }

    messageLog(message){
		//メッセージ
		
    }
}