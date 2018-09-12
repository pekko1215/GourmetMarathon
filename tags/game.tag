<game>
	<map></map>
	<div id="character" class="player">
		<img src="/image/chip/player.png">
	</div>
	<script>
		window.scrollTo(0,0)
		window.Mapdata = new GameMap(AutoGenerator());
		window.eventCenter = new EventCenter;
		var pos = Mapdata.selectBlankChip()
		window.player = new Player(pos.x,pos.y,eventCenter,Mapdata);
		window.addEventListener('keydown',(e)=>{
			var direction = {
				ArrowUp:'↑',
				ArrowRight:'→',
				ArrowLeft:'←',
				ArrowDown:'↓'
			}[e.code];
			player.move(direction);
			eventCenter.fire();
		})
		eventCenter.on(()=>{
			this.root.style.left = `${47.5 - 5 * player.x}vw`
			this.root.style.top = `${48.5 - 5 * player.y}vw`
		})
	</script>
	<style scoped>
		.player {
			position: fixed;
			width: 5vw;
			height: 5vw;
			overflow: hidden;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto auto;
		}

		.player > img{
			width:300%;
			height:400%;
			position:absolute;
		}
		:scope{
			position: absolute;
			left: -2.5vw;
			top: -7.5vw;
		}
	</style>
</game>