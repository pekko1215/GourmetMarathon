<map>
	<div class="line" each="{arr,y in Mapdata.map}">
		<span each="{chip,x in arr}" class="chip {chip.type}">
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
	</style>
</map>