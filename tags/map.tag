<map>
	<div class="line" each="{arr,y in Mapdata.map}">
		<span each="{chip,x in arr}" class="chip {chip.type}">
			<img if="{chip.isStairs}" src="/image/chip/stairs.png">
		</span>
	</div>
	<script>
	</script>
	<style scoped>
		.line {
			width:max-content;
			height:32px;
		}
		.chip{
			display:inline-block;
			width:32px;
			height:32px;
		}
		.wall {
			background:gray;
		}
		.floor{
			background:#222222;
		}
		.chip>img {
			width:100%;
			height:100%;
		}
	</style>
</map>