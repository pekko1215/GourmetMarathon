<game>
    <map></map>
    <div id="character" class="player">
        <img src="./image/chip/player.png">
    </div>
    <div class="enemmy" each="{e,i in Mapdata.enemmys}" id="enemmy{i}">
        <img src="{e.chip}">
    </div>
    <div id="messageWindow" class="window">
    </div>
    <div id="statusWindow" class="window">
        第<span id="floor">{floor}</span>階 HP:
        <span id="hp" class="{player.hp/player.maxhp<=0.2?player.hp/player.maxhp<=0.1?'danger':'pinch':''}">{~~player.hp}/{~~player.maxhp}</span>
        <span id="info">{player.debuff||''}</span>
    </div>
    <div id="menuWindow" if="{menu}" class="window">
        <div each="{m in menu}" class="menu {m.checked?'checked':''}">{m.text}</div>
    </div>
    <div id="infoWindow" if="{infoText}" class="window">
        <div id="infoText">{infoText}</div>
    </div>
    <div id="titleWindow" if="{displayTitle}">
        <div id="obi">
            <div id="title">第{this.floor}階 危険度 {("★".repeat(Mapdata.level - this.floor + 3)+"☆☆☆☆").slice(0,5)}</div>
        </div>
    </div>
    <div if="{getDevice !== 'other'}" id="smartKey">
		<div class="key-wrap">
			<div id="topButton" data-action="ArrowUp">
				<img src="./image/ui_arrow.png">
			</div>
		</div>
		<div class="key-wrap">
			<div id="leftButton" data-action="ArrowLeft">
				<img src="./image/ui_arrow.png">
			</div>
			<div id="atackButton" data-action="Space">
				<img src="./image/ui_action.png">
			</div>
			<div id="rightButton" data-action="ArrowRight">
				<img src="./image/ui_arrow.png">
			</div>
		</div>
		<div class="key-wrap">
			<div id="dummyButton">
				<img src="./image/ui_arrow.png">
			</div>
			<div id="bottomButton" ontouchstart="{smartButton}" data-action="ArrowDown">
				<img src="./image/ui_arrow.png">
			</div>
			<div id="menuButton" data-action="KeyV">
				<img src="./image/ui_menu.png">
			</div>
		</div>
    </div>
    <script>
    window.MetaInfo = {};
    const frameTime = 50;
    window.newGame = (floor = 1, oldPlayer) => {
        this.floor = floor;
        window.scrollTo(0, 0);
        window.Mapdata = new GameMap(AutoGenerator(), floor);
		this.displayTitle = true;
        window.eventCenter = new EventCenter;
        var pos = Mapdata.selectBlankChip()
        window.player = new Player(pos.x, pos.y, eventCenter, oldPlayer);
        var delayd = false;
        if (window.keyEvent) {
            window.removeEventListener('keydown', window.keyEvent)
        }
        window.addEventListener('keydown', window.keyEvent = (e) => {
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
                    if (this.menu) { this.menu.find(m => m.checked).fn(); return }
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
                                    Mapdata.messageLog(`${target.name} をたおした (Exp ${target.exp})`);
                                }
                            }
                            eventCenter.fire();
                            delayd = true;
                            setTimeout(() => {
                                $e.parentNode.removeChild($e)
                            }, 500)
                            setTimeout(() => {
                                delayd = false;
                            }, frameTime)
                            break
                    }
                    break
                case '↑':
                case '↓':
                case '→':
                case '←':
                    if (this.menu) {
                        var diff = {
                            '←': 0,
                            '↑': -1,
                            '↓': 1,
                            '→': 0
                        }[command]
                        if (!diff) return;
                        var idx = this.menu.findIndex(d => d.checked);
                        this.menu[idx].checked = false;
                        idx += diff;
                        idx = idx >= this.menu.length ? 0 : idx;
                        idx = idx < 0 ? this.menu.length - 1 : idx;
                        this.menu[idx].checked = true;
                        if (this.menu[idx].check) {
                            this.menu[idx].check();
                        }
                        this.update();
                    } else {
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
                            }, frameTime)
                        }
                    }
                    break
                case 'menu':
                    if (this.menu) {
                        this.menu = null;
                        this.infoText = null
                        this.update();
                        return;
                    }
                    var itemMenu;
                    var defaultMenu;
                    Mapdata.createMenu(defaultMenu = [{
                        text: 'アイテム',
                        fn: itemMenu = () => {
                            player.items.sort((a, b) => {
                                return a.name < b.name ? -1 : 1;
                            });
                            var arr = player.items.map(item => {
                                return {
                                    text: item.name + (item.isEquipment ? ' E' : ''),
                                    check: () => {
                                        this.infoText = item.text
                                    },
                                    fn: () => {
                                        var useMenu = [{
                                            text: 'つかう',
                                            fn: () => {
                                                var mes = item.use();
                                                itemMenu();
                                                Mapdata.messageLog(mes)
                                            }
                                        }, {
                                            text: 'すてる',
                                            fn: () => {}
                                        }];
                                        if (item.canEquipment && !item.isEquipment) {
                                            useMenu.push({
                                                text: 'そうび',
                                                fn: () => {
                                                    Mapdata.createMenu([...Array(player.equipmentSlot).keys()].map(idx => {
                                                        var eq = player.equipments[idx]
                                                        console.log(eq, idx, player);
                                                        return {
                                                            text: `スロット${idx+1}:${eq?eq.name:'空'}`,
                                                            fn: () => {
                                                                var mes = item.equipment(idx);
                                                                itemMenu();
                                                                Mapdata.messageLog(mes)
                                                            },
                                                            check: () => {
                                                                this.infoText = eq ? eq.text : '';
                                                            }
                                                        }
                                                    }))
                                                }
                                            })
                                        }
                                        Mapdata.createMenu(useMenu)
                                    }
                                }
                            })
                            if (arr.length == 0) {
                                this.infoText = 'アイテムがありません';
                                Mapdata.createMenu(defaultMenu)
                                this.update();
                            } else {
                                Mapdata.createMenu(arr)
                            }
                        }
                    }, {
                        text: 'ステータス',
                        fn: () => {}
                    }])
                    break
            }
        })
        eventCenter.on(() => {
			window.scrollTo(0,0)
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
				delayd = false;
                $e.parentNode.removeChild($e)
            }, 500)
        }
        var idx = 0;
        var playerAnimationTimer =
            setInterval(() => {
                var $p = this.root.querySelector('.player > img');
                $p.style.left = `${-Math.abs(2-idx)*32}px`;
                idx++;
                idx = idx < 4 ? idx : 0;
            }, 200);
        Mapdata.createMenu = (menu) => {
            menu[0].checked = true;
            this.menu = menu;
            if (this.menu[0].check) {
                this.menu[0].check();
            }
            this.update();
        }
        Mapdata.nextFloor = () => {
            delete player.x;
            delete player.y;
            clearInterval(playerAnimationTimer);
            newGame(floor + 1, player);
        }
        Mapdata.gameOver = ()=>{
			Mapdata.gameOver = ()=>{};
			window.removeEventListener('keydown', window.keyEvent);
			this.root.style.opacity = 0;
			setTimeout(()=>{
				alert(`ゲームオーバー！\n最終階層:${floor}階 Lv:${player.level}`);
				location.reload();
			},3000)
        }
        this.one("updated", () => {
			setTimeout(()=>{
				setTimeout(()=>{
					this.root.querySelector('#titleWindow').style.opacity = 0;
				})
	            eventCenter.fire();
				setTimeout(()=>{
					this.displayTitle = false;
					this.update()
				},1000)
			},2000)
        });
        this.update();
    }
    this.one("mount", () => {
        newGame();
        [...this.root.querySelectorAll('#smartKey > div')].forEach(e=>{
			e.addEventListener('touchstart',(e)=>{
		        var src = e.target;
		        if(src.nodeName === 'IMG') src = src.parentNode;
		        var action = src.dataset.action;
		        if (action) {
		            window.keyEvent({ code: action });
			    }
			    e.preventDefault();
			})
		})
    })
    </script>
    <style scoped>
    @font-face {
        font-family: PixelMplus;
        src: url(./font/PixelMplus10-Regular.ttf);
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
        font-size: 3vw;
        border: solid 2px;
        padding: 4px;
        border-radius: 3%;
    }

    .message {
        transition: max-height 0.1s linear;
        margin-top: 2%;
        max-height: 20px;
        /*overflow: hidden;*/
    }

     :scope {
        position: absolute;
        left: -2.5vw;
        top: -7.5vw;
        opacity:1;
        transition: top 0.1s linear, left 0.1s linear,opacity 2s;
        font-family: PixelMplus;
        overflow:hidden;
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

    #infoWindow {
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

    .window {
        z-index: 5;
    }

    #titleWindow {
        background: black;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10;
        opacity:1;
        transition: opacity 1s ease-in;
    }

    #obi {
        width: 100%;
        height: 30%;
        top: 0;
        bottom: 0;
        position: absolute;
        margin: auto;
        background: #009688;
    }

    #title {
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        height: fit-content;
        width: 100%;
        font-size: 5vh;
        color: white;
    }
    #smartKey {
		width:40vw;
		height:40vw;
		position:fixed;
		top:10vh;
		right:1%;
		opacity:0.2;
		cursor:pointer;
    }
    .key-wrap {
		height:33%;
		text-align:center;
		display:flex;
		justify-content: space-between;
    }

    .key-wrap > div {
		flex-grow:1;
    }

    #topButton ,#bottomButton{
    }
    #leftButton ,#menuButton,#rightButton{
    }

    .key-wrap > div > img {
		height:100%;
    }

    #dummyButton > img{
		opacity:0;
    }

    #topButton > img {
    }
    #leftButton > img{
		transform:rotate(-90deg);
    }
    #rightButton > img {
		transform:rotate(90deg);
    }
    #bottomButton > img {
		transform:rotate(180deg);
    }
    </style>
</game>