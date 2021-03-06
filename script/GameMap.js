class MapChip {
    constructor(d) {
        this.type = d;
    }
}

class Item {
	constructor(obj){
		Object.assign(this,obj);
		this.canEquipment = false;
		switch(obj.type){
			case 'use':
				this.__proto__ = Food.prototype;
				break
			case 'eq':
				this.__proto__ = Equipment.prototype;
				this.canEquipment = true;
			break
		}
	}
	catch(){
		setTimeout(()=>{
			Mapdata.messageLog(`${this.name} を手に入れた`);
		})
		player.items.push(this);
	}
	use(){
		return 'このアイテムは使用することはできない'
	}
	remove(){
        var idx = player.items.findIndex(item=>item.name == this.name);
        player.items.splice(idx,1);
        eventCenter.fire();
	}
}

class Food extends Item {
	constructor(obj){
		obj.type = 'food';
		super(obj);
	}
	use(){
		var point = ~~(player.maxhp * this.hp * 0.01);
		if(player.hp + point >= player.maxhp){
			point = player.maxhp - player.hp;
		}
		player.hp += point;
		this.remove();
		if(point >= 0){
			return `HPが ${point} 回復した`;
		}else{
			return `HPが ${-point} 減少した`;
		}
	}
}

class Equipment extends Item{
	constructor(obj){
		this.canEquipment = true;
		obj.type = 'equipment';
		this.slot = -1;
		super(obj);
	}
	equipment(slot){
		if(player.equipments[slot]){
			var old = player.equipments[slot];
			old.slot = -1;
			old.isEquipment = false;
		}
		player.equipments[slot] = this;
		this.slot = slot;
		this.isEquipment = true;
		return `${this.name} をそうびした`
	}
	catch(){
		if(player.items.find(item=>item.name === this.name)){
			setTimeout(()=>{
				Mapdata.messageLog(`${this.name} はこれ以上もてない`);
			})
			return;
		}
		setTimeout(()=>{
			Mapdata.messageLog(`${this.name} を手に入れた`);
		})
		player.items.push(this);
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
		var arr = [up,down,right,left];
		return ['↑','↓','→','←'][arr.indexOf(Math.max(...arr))];
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
		if(this.died)return
		var damage = this.getDamagePoint(point);
		this.hp -= damage
		if(this.hp <= 0){
			this.die();
			player.getExp(this.exp)
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
		var item = this.drop();
		if(item) item.catch();
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
	atack(point){
		player.damage(~~point)
	}
	drop(){
		return null;
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
		this.hp = 0;
		this.chip = './image/chip/chest.png';
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
		top -= 8;
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
    constructor(x, y, ev,old = {}) {
        super(x, y, ev);
        this.hp = 30;
        this.maxhp = 30;
        this.level = 1;
        this.atk = 1;
        this.def = 1;
        this.exp = 0;
        this.nextExp = 10
        this.items = [];
        this.equipmentSlot = 2;
        this.equipments = [];
        this.turnEffects = [];
        Object.assign(this,old)
    }
    action(){
		var ret;
		if(Mapdata.getChip(this.x,this.y).drop){
			return this.catch();
		}else{
			ret = this.atack();
			if(!ret && Mapdata.getChip(this.x,this.y).isStairs){
				Mapdata.nextFloor();
			}
			return ret;
		}
    }
    catch(){
		var item = Mapdata.getChip(this.x,this.y).drop;
		if(!item) return false;
		item.catch();
    }
    getAttackTarget(){
		var atackTable = [[1],[2]];
		var d = this.getTarget();
		var ret = [];
		var m = Mapdata.getChip(this.x+d.x,this.y+d.y);
		if(m.enemmy) ret.push(m.enemmy);
		this.equipments.forEach((eq)=>{
			if(!eq.attackSize) return;
			var {attackSize:table} = eq;
			var iPos = {x:-1,y:-1};
			var posList = [];
			(()=>{
				for(var y = 0;y < table.length;y++){
					for(var x = 0;x < table[y].length;x++){
						if(table[y][x] == 2){
							iPos = {x,y};
							return;
						}
						if(table[y][x] == 1){
							posList.push({x,y});
						}
					}
				}
			})();
			posList.map(p=>{
				p.x-=iPos.x;
				p.y-=iPos.y;
				for(var i=0;i < "↑→↓←".indexOf(this.direction);i++){
					[p.x,p.y] = [p.y,p.x];
					if(i%2 == 0){
						[p.x,p.y] = [-p.x,-p.y]
					}
				}
				return p;
			}).forEach(p=>{
				var {enemmy} = Mapdata.getChip(p.x+this.x,p.y+this.y);
				if(enemmy) ret.push(enemmy);
			})
		});
		return ret.filter((k,i,t)=>{
			return t.indexOf(k) == i
		});
    }
    atack(){
		var targets = this.getAttackTarget();
		var point = this.getAttackPoint();
		return {
			list:targets.map(target=>{
				return {
					damage:target.damage(point),
					target,
				}
			}),
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
		var p = this.equipments.filter(d=>d).reduce((a,b)=>a+(b.def||0),0) + this.def;
		var e = this.turnEffects.reduce((a,b)=>(b.def||0),0);
		return Math.ceil(point*Math.pow(0.99,p+e));
    }

    getExp(exp){
		if(!exp)return;
		this.exp += exp;
		if(this.exp >= this.nextExp){
			var e = this.exp - this.nextExp;
			this.exp = 0;
			this.levelUp();
			this.getExp(e);
		}
    }

    levelUp(){
		var oldatk = ~~this.atk;
		var olddef = ~~this.def;
		var oldmaxhp = ~~this.maxhp;
		this.level ++;
		this.def *= 1+Math.random()*0.5;
		this.atk *= 1+Math.random()*0.5;
		this.maxhp *= 1+Math.random()*0.5;
		this.nextExp *= 1.4;

		setTimeout(()=>{
			if(~~this.atk != oldatk){
				Mapdata.messageLog(`atk ${oldatk}→${~~this.atk} (+${~~this.atk-oldatk})`);
			}
			if(~~this.def != olddef){
				Mapdata.messageLog(`def ${olddef}→${~~this.def} (+${~~this.def-olddef})`);
			}
			if(~~this.maxhp != oldmaxhp){
				Mapdata.messageLog(`MAXHP ${oldmaxhp}→${~~this.maxhp} (+${~~this.maxhp-oldmaxhp})`);
			}
			Mapdata.messageLog(`レベルアップ! Lv ${this.level-1}→${this.level}`);
		})
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
		var p = this.equipments.filter(d=>d).reduce((a,b)=>a+(b.atk||0),0);
		var e = this.turnEffects.reduce((a,b)=>(b.atk||0),0);
		return ~~((this.atk+e) * Math.pow(1.01,p) * (0.8 + Math.random()*0.4));
    }
    turnEffect(turn,effect,item){
		this.turnEffects.push(effect);
		var floor = Mapdata.floor;
		var fn;
		eventCenter.once(fn = ()=>{
			if(!turn){
				var idx = this.turnEffects.findIndex(e=>e == effect);
				this.turnEffects.splice(idx,1);
				Mapdata.messageLog(`${item.name} の効果がきれた`)
				return;
			}
			turn--;
			setTimeout(()=>{
				eventCenter.once(fn)
			})
		})
    }
}

class GameMap {
    constructor(map,floor) {
        this.map = map.map(arr => {
            return arr.map(d => {
                return new MapChip(d);
            })
        })
        this.width = this.map[0].length;
        this.height = this.map.length;
        this.type = ['通常','モンスターハウス','ボーナス','偏り'][Lottery([80,7,8,5])];
        this.enemmys = [];
        this.floor = floor;
        this.level = ~~(Math.random()*5)-2 + floor;
        if(this.level <= 0) this.level = 1;
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
			['豚','軍隊豚','牛','カラス','ミミック','虫','蛇','うさぎ','馬','鹿','猪','熊']
			[Lottery([10,15,7,8,2.8,10,12,10,10,10,0.15])];
			if(!EnemmyData[name]){
				name = '軍隊豚';
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
				count = 4 + rand(5);
				chestTypeTable = [94,5.9,0.1];
			case '偏り':
				count = 4 + rand(5);
				chestTypeTable = [80,19.5,0.5];
				break
			case 'モンスターハウス':
				count = 10 + rand(6);
				chestTypeTable = [90,9,1];
				break
			case 'ボーナス':
				count = 12 + rand(7);
				chestTypeTable = [94,5.5,0.5];
		}
		var name;
		for(var i = 0;i < count; i++){
			var chestType = ['木','赤','金'][Lottery(chestTypeTable)];
			var chestLevel = Lottery({
				'木':[70,30, 0, 0, 0],
				'赤':[10,20,50,20, 0],
				'金':[ 0, 0,35,64, 1]
			}[chestType])+1;
			var list = ItemData.filter(item=>item.rarity == chestLevel).filter(data=>!data.dropOnly);
			var item = list[~~(Math.random()*list.length)];
			var pos = this.selectBlankChip();
			var chest = new Chest(pos.x,pos.y,new Item(item),chestType);
			this.getChip(pos.x,pos.y).enemmy = chest;
			this.enemmys.push(chest);
		}
		this.bornStairs();
    }

    bornStairs(){
		var pos = this.selectBlankChip();
		Mapdata.getChip(pos.x,pos.y).isStairs = true;
    }

    messageLog(message){
		//メッセージ
    }

    createMenu(arr){}
}