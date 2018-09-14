<game>
    <map></map>
    <div id="character" class="player">
        <img src="/image/chip/player.png">
    </div>
    <div class="enemmy" each="{e,i in Mapdata.enemmys}" id="enemmy{i}">
        <img src="{e.chip}">
    </div>
    <div id="messageWindow">
    </div>
    <div id="statusWindow">
        第<span id="floor">{floor}</span>階 HP:
        <span id="hp" class="{player.hp/player.maxhp<=0.2?player.hp/player.maxhp<=0.1?'danger':'pinch':''}">{player.hp}/{player.maxhp}</span>
        <span id="info">{player.debuff||''}</span>
    </div>
    <div id="menuWindow" if="{menu}">
		<div each="{m in menu}" class="menu {m.checked?'checked':''}">{m.text}</div>
	</div>
	<div id="infoWindow" if="{infoText}">
		<div id="infoText">{infoText}</div>
	</div>
    <script>
    window.scrollTo(0, 0);
    window.floor = 1;
    window.Mapdata = new GameMap(AutoGenerator());
    window.eventCenter = new EventCenter;
    var pos = Mapdata.selectBlankChip()
    window.player = new Player(pos.x, pos.y, eventCenter, Mapdata);
    var delayd = false;
    window.addEventListener('keydown', (e) => {
        if (delayd) return;
        var command = {
            ArrowUp: '↑',
            ArrowRight: '→',
            ArrowLeft: '←',
            ArrowDown: '↓',
            Space: 'action',
            KeyV: 'menu'
        }[e.code];
        switch (command) {
            case 'action':
				if(this.menu){this.menu.find(m=>m.checked).fn();}
                var ret = player.action();
                if (!ret) return;
                switch (true) {
                    case ret.type === 'catch':
                        //入手
                        Mapdata.messageLog(`${ret.name} を手に入れた`)
                        break
                    case ret.type === 'atack':
                        //攻撃
                        var { damage, target } = ret;
                        var $e = document.createElement('div');
                        $e.innerText = damage;
                        $e.classList.add('damage')
                        $e.style.left = `${32 * target.x}px`;
                        $e.style.top = `${32 * target.y}px`;
                        this.root.appendChild($e);
                        setTimeout(() => {
                            $e.style.opacity = 0;
                            $e.style.top = `${32 * target.y -32}px`;
                        })
                        if (target instanceof Chest) {

                        } else {
                            Mapdata.messageLog(`${target.name} に ${damage} ダメージ`);
                            if (target.died) {
                                Mapdata.messageLog(`${target.name} をたおした`);
                            }
                        }
                        eventCenter.fire();
                        delayd = true;
                        setTimeout(() => {
                            $e.parentNode.removeChild($e)
                        }, 500)
                        setTimeout(() => {
                            delayd = false;
                        }, 100)
                        break
                }
                break
            case '↑':
            case '↓':
            case '→':
            case '←':
				if(this.menu){
	                var diff = {
						'←':0,
						'↑':-1,
						'↓':1,
						'→':0
	                }[command]
	                if(!diff)return;
	                var idx = this.menu.findIndex(d=>d.checked);
	                // console.og(this.menu,idx)
	                this.menu[idx].checked = false;
	                idx += diff;
	                idx = idx >= this.menu.length ? 0 : idx;
	                idx = idx < 0 ? this.menu.length - 1 : idx;
	                this.menu[idx].checked = true;
					if(this.menu[idx].check){
						this.menu[idx].check();
					}
	                this.update();
				}else{
					var $p = this.root.querySelector('.player > img');
	                $p.classList.remove('right');
	                $p.classList.remove('top');
	                $p.classList.remove('left');
	                $p.classList.remove('bottom');
	                $p.classList.add({
	                    ArrowUp: 'top',
	                    ArrowRight: 'right',
	                    ArrowLeft: 'left',
	                    ArrowDown: 'bottom',
	                }[e.code])
	                if (player.move(command)) {
	                    eventCenter.fire();
	                    delayd = true;
	                    setTimeout(() => {
	                        delayd = false;
	                    }, 100)
	                }
				}
                break
            case 'menu':
				if(this.menu){
					this.menu = null;
					this.infoText = null
					this.update();
					return;
				}
				var itemMenu;
				var defaultMenu;
				Mapdata.createMenu(defaultMenu = [{
					text:'アイテム',
					fn:itemMenu = ()=>{
						player.items.sort((a,b)=>{
							return a.name<b.name?-1:1;
						});
						var arr = player.items.map(item=>{
							return {
								text:item.name,
								check:()=>{
									this.infoText = item.text
								},
								fn:()=>{
									Mapdata.createMenu([{
										text:'つかう',
										fn:()=>{
											var mes = item.use();
											console.log(item)
											itemMenu();
											Mapdata.messageLog(mes)
										}
									},{
										text:'すてる',
										fn:()=>{}
									}])
								}
							}
						})
						if(arr.length == 0){
							this.infoText = 'アイテムがありません';
							Mapdata.createMenu(defaultMenu)
							this.update();
						}else{
							Mapdata.createMenu(arr)
						}
					}
				},{
					text:'ステータス',
					fn:()=>{}
				}])
            break
        }
    })
    eventCenter.on(() => {
        this.root.style.left = `calc(${-16 - 32 * player.x}px + 50vw)`
        this.root.style.top = `calc(${-16 - 32 * player.y}px + 50vh)`
        Mapdata.enemmys.forEach((enemmy, i) => {
            if (enemmy.died) {
                return
            }
            enemmy.turn();
            var left = enemmy.x * 32
            var top = enemmy.y * 32;
            enemmy.$.style.left = left + 'px';
            enemmy.$.style.top = top + 'px';
            var a = enemmy.animation();
            enemmy.$img.style.width = enemmy.width * 100 + '%'
            enemmy.$img.style.height = enemmy.height * 100 + '%';
            enemmy.$img.style.left = a.left + 'px';
            enemmy.$img.style.top = a.top + 'px';
            enemmy.$.style.width = a.width + 'px';
            enemmy.$.style.height = a.height + 'px';
        })
        this.update();
    })
    Mapdata.bornEnemmy();
    eventCenter.once(() => {
        Mapdata.enemmys.forEach((d, i) => {
            d.$ = this.root.querySelector('#enemmy' + i);
            d.$img = this.root.querySelector("#enemmy" + i + ' > img');
        })
    })
    Mapdata.messageLog = (message) => {
        var $window = this.root.querySelector('#messageWindow')
        var $e = document.createElement('div');
        $e.classList.add('message')
        $e.innerHTML = message;
        $window.insertBefore($e, $window.firstChild);
        setTimeout(() => {
            $e.style.maxHeight = '0px';
            setTimeout(() => {
                $window.removeChild($e)
            }, 100)
        }, 3000)
    }
    player.onDamage = (point) => {
        var $e = document.createElement('div');
        $e.innerText = point;
        $e.classList.add('damage')
        $e.classList.add('me')
        $e.style.left = `50%`;
        $e.style.top = `50%`;
        this.root.appendChild($e);
        setTimeout(() => {
            $e.style.opacity = 0;
            $e.style.top = `calc(50% - 32px)`;
        })
        Mapdata.messageLog(`${point} ダメージを受けた`);
        delayd = true;
        setTimeout(() => {
            $e.parentNode.removeChild($e)
        }, 500)
    }
    var idx = 0;
    setInterval(() => {
        var $p = this.root.querySelector('.player > img');
        $p.style.left = `${-Math.abs(2-idx)*32}px`;
        idx++;
        idx = idx < 4 ? idx : 0;
    }, 200);
    setTimeout(() => {
        eventCenter.fire();
    })
    Mapdata.createMenu = (menu)=>{
		menu[0].checked = true;
		this.menu = menu;
		if(this.menu[0].check){
			this.menu[0].check();
		}
		this.update();
    }
    </script>
    <style scoped>
    @font-face {
        font-family: PixelMplus;
        src: url(/font/PixelMplus10-Regular.ttf);
    }

    .player {
        position: fixed;
        width: 32px;
        height: 32px;
        overflow: hidden;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto auto;
    }

    .enemmy {
        position: absolute;
        overflow: hidden;
        transition: top 0.1s linear, left 0.1s linear, opacity 0.1s linear;
    }

    .enemmy.died {
        display: none;
    }

    .enemmy>img {
        position: relative;
    }

    .damage {
        position: absolute;
        color: lightgreen;
        font-size: 28px;
        opacity: 1;
        text-shadow: 2px 2px 0 #000;
        transition: top 0.5s linear, left 0.5s linear, opacity 0.5s linear;
    }

    .damage.me {
        color: red;
        position: fixed;
    }

    .player>img {
        width: 300%;
        height: 400%;
        position: absolute;
    }

    .player>img.bottom {
        position: relative;
        top: 0px;
    }

    .player>img.left {
        position: relative;
        top: -32px;
    }

    .player>img.right {
        position: relative;
        top: -64px;
    }

    .player>img.top {
        position: relative;
        top: -96px;
    }

    #messageWindow {
        position: fixed;
        bottom: 0;
        left: 1%;
        height: 30%;
        width: 40%;
        background: rgba(209, 255, 210, 0.7);
        font-size: 25px;
        border: solid 2px;
        padding: 4px;
        border-radius: 3%;
    }

    .message {
        transition: max-height 0.1s linear;
        margin-top: 2%;
        max-height: 25px;
        overflow: hidden;
    }

     :scope {
        position: absolute;
        left: -2.5vw;
        top: -7.5vw;
        transition: top 0.1s linear, left 0.1s linear;
        font-family: PixelMplus;
    }

    #statusWindow {
        position: fixed;
        top: 1%;
        color: white;
        left: 1%;
        width: 100%;
        font-size: 32px;
    }

    #hp.pinch {
        color: yellow;
    }

    #hp.danger {
        color: red;
    }

    #menuWindow {
        position: fixed;
		width: auto;
		min-height: auto;
		top: 7%;
		left: 1%;
		background: rgba(255, 255, 255, 0.8);
		border: solid 2px black;
		border-radius: 4%;
		padding-top: 1%;
		padding-bottom: 1%;
		padding-left: 12px;
		padding-right: 7px;
		font-size: 23px;
		transition: min-height 0.5s linear;
    }

    .menu.checked:before {
        content: '▶';
        position: absolute;
        font-size: 14px;
        margin-left: -10px;
        margin-top: 4px;
    }

    #infoWindow{
		position: fixed;
		bottom: 0;
		left: 42%;
		height: 30%;
		width: 57%;
		background: rgba(255, 255, 255, 0.7);
		font-size: 25px;
		border: solid 2px;
		padding: 4px;
	}
    </style>
</game>