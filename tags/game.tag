<game>
	<map></map>
	<div id="character" class="player">
		<img src="/image/chip/player.png">
	</div>
	<div class="enemmy" each="{e,i in Mapdata.enemmys}" id="enemmy{i}">
		<img src="{e.chip}">
	</div>
	<script>
		window.scrollTo(0,0)
		window.Mapdata = new GameMap(AutoGenerator());
		window.eventCenter = new EventCenter;
		var pos = Mapdata.selectBlankChip()
		window.player = new Player(pos.x,pos.y,eventCenter,Mapdata);
		var delayd = false;
		window.addEventListener('keydown',(e)=>{
			if(delayd) return;
			var direction = {
				ArrowUp:'↑',
				ArrowRight:'→',
				ArrowLeft:'←',
				ArrowDown:'↓',
				Space:'action'
			}[e.code];
			if(!direction)return;
			if(direction === 'action'){
				player.action()
				return
			}
			var $p = this.root.querySelector('.player > img');
			$p.classList.remove('right');
			$p.classList.remove('top');
			$p.classList.remove('left');
			$p.classList.remove('bottom');
			$p.classList.add({
				ArrowUp:'top',
				ArrowRight:'right',
				ArrowLeft:'left',
				ArrowDown:'bottom',
			}[e.code])
			if(player.move(direction)){
				eventCenter.fire();
				delayd = true;
				setTimeout(()=>{
					delayd = false;
				},100)
			}
		})
		eventCenter.on(()=>{
			this.root.style.left = `calc(${-16 - 32 * player.x}px + 50vw)`
			this.root.style.top = `calc(${-16 - 32 * player.y}px + 50vh)`
			Mapdata.enemmys.forEach((enemmy,i)=>{
				enemmy.turn();
				var left = enemmy.x*32
				var top = enemmy.y*32;
				var $enemmy = this.root.querySelector('#enemmy'+i);
				$enemmy.style.left = left + 'px';
				$enemmy.style.top = top + 'px';
				var $img = this.root.querySelector("#enemmy"+i+' > img');
				var a = enemmy.animation();
				$img.style.width = enemmy.width*100+'%'
				$img.style.height = enemmy.height*100+'%';
				$img.style.left = a.left + 'px';
				$img.style.top = a.top + 'px';
				$enemmy.style.width = a.width + 'px';
				$enemmy.style.height = a.height + 'px';
			})
			// this.update();
		})
		Mapdata.bornEnemmy();
		var idx = 0;
		setInterval(()=>{
			var $p = this.root.querySelector('.player > img');
			$p.style.left = `${-Math.abs(2-idx)*32}px`;
			idx++;
			idx = idx < 4 ? idx :0;
		},200);
	</script>
	<style scoped>
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
			position:absolute;
			overflow:hidden;
			transition:top 0.1s linear,left 0.1s linear;
		}

		.enemmy > img{
			position:relative;
		}

		.player > img{
			width:300%;
			height:400%;
			position:absolute;
		}

		.player > img.bottom{
			position:relative;
			top:0px;
		}
		.player > img.left{
			position:relative;
			top:-32px;
		}
		.player > img.right{
			position:relative;
			top:-64px;
		}
		.player > img.top{
			position:relative;
			top:-96px;
		}
		:scope{
			position: absolute;
			left: -2.5vw;
			top: -7.5vw;
			transition:top 0.1s linear,left 0.1s linear;
		}
	</style>
</game>