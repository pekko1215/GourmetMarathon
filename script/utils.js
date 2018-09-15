function rand(a) {
    return ~~(Math.random() * a);
}

function Lottery(arr) {
    var r = rand(100);
    return arr.findIndex(val => {
        r -= val;
        if (r < 0) return true;
    })
}

Array.prototype.smartFilter = function(arr, key) {
    if (!Array.isArray(arr)) arr = [arr];
    return this.filter(data => {
        return arr.find(v => {
            return data[key] == v;
        })
    })
}

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    included(x, y) {
        return x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
    }
    separate() {
        var direction = ['縦', '横'][~~(Math.random() * 2)];
        if (MinWidth * 2 > this.width && direction == '縦') {
            direction = '横';
        }
        if (MinHeight * 2 > this.height && direction == '横') {
            direction = '縦'
        }
        if (MinHeight * 2 > this.height &&
            MinWidth * 2 > this.width) {
            return false;
        }
        this.direction = direction;
        switch (direction) {
            case '縦':
                while (true) {
                    var idx = MinWidth + ~~(Math.random() * (this.width - MinWidth * 2));
                    if (idx < MaxWidth) break
                }
                var tmp = this.width;
                this.width = idx;
                return new Rect(
                    this.x + idx,
                    this.y,
                    tmp - idx,
                    this.height
                );
                break
            case '横':
                while (true) {
                    var idx = MinHeight + ~~(Math.random() * (this.height - MinHeight * 2));
                    if (idx < MaxWidth) break
                }
                var tmp = this.height;
                this.height = idx;
                return new Rect(
                    this.x,
                    this.y + idx,
                    this.width,
                    tmp - idx
                );
        }
    }
}

var getDevice = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'tab';
    }else{
        return 'other';
    }
})();