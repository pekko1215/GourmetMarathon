class MapChip {
    constructor(d) {
        this.type = d;
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
        this.events = this.events.filter(obj => {
            obj.fn(arg);
            return !obj.once
        })
    }
}

class Actor {
    constructor(x, y, ev) {
        this.x = x;
        this.y = y;
        this.ev = ev;
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
        if (Mapdata.getChip(this.x + d.x, this.y + d.y).type === 'floor') {
            this.ev.once(() => {
                this.x += d.x;
                this.y += d.y;
            })
            return true;
        } else {
            return false;
        }
    }
}

class Player extends Actor {
    constructor(x, y, ev) {
        super(x, y, ev);
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
            if (this.getChip(pos.x, pos.y).type === 'floor')
                return pos;
             // break
			continue;
        }
    }
}