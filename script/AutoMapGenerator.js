const Width = 50;
const Height = 50;
const MinWidth = 10;
const MinHeight = 10;
const MaxWidth = 20;
const MaxHeight = 20;
const WrapSize = 10;

function AutoGenerator(){
	var map = Array(Height).fill(0).map(d=>{
		return Array(Width).fill(0).map(()=>{
			return 'wall';
		})
	})
	var list = [new Rect(0,0,Width,Height)];
	var last = list[0];
	// list.push(list[0].separate())
	while(true){
		var r = last.separate();
		if(!r) break;
		last = r;
		list.push(last);
	}
	// list.unshift(list[0].separate());
	var sublist = list.map(rect=>{
		var ret = new Rect();
		Object.assign(ret,rect);
		var minimize = ~~(Math.random()*3) + 3;

		ret.x += minimize;
		ret.y += minimize;
		ret.width -= minimize * 2;
		ret.height -= minimize * 2;
		return ret;
	})
	list.forEach((rect,i)=>{
		rect.subrect = sublist[i];
	})

	sublist.forEach(card=>{
		for(var y = card.y;y <= card.y + card.height;y ++){
			for(var x = card.x;x <= card.x + card.width;x ++){
				map[y][x] = 'floor'
			}
		}
	})
	list.forEach((a,i)=>{
		var b = list[i+1];
		if(!b)return;
		var idxs = [];
		switch(a.direction){
			case '横':
				var idx = a.subrect.x + ~~(a.subrect.width * Math.random());
				idxs.push(idx);
				for(var y = a.subrect.y + a.subrect.height;y <= a.height + a.y; y++){
					map[y][idx] = 'floor'
				}
				idx = b.subrect.x + ~~(b.subrect.width * Math.random());
				idxs.push(idx);
				for(var y = b.subrect.y;y >= b.y; y--){
					map[y][idx] = 'floor'
				}
				idxs = idxs.sort((a,b)=>a-b);
				for(var x=idxs[0];x <= idxs[1];x++){
					map[b.y][x] = 'floor'
				}
				break
			case '縦':
				var idx = a.subrect.y + ~~(a.subrect.height * Math.random());
				idxs.push(idx);
				for(var x = a.subrect.x + a.subrect.width;x <= a.width + a.x; x++){
					map[idx][x] = 'floor'
				}
				idx = b.subrect.y + ~~(b.subrect.height * Math.random());
				idxs.push(idx);
				for(var x = b.subrect.x;x >= b.x; x--){
					map[idx][x] = 'floor'
				}
				idxs = idxs.sort((a,b)=>a-b);
				for(var y=idxs[0];y <= idxs[1];y++){
					map[y][b.x] = 'floor'
				}
		}
	});
	map.forEach(arr=>{
		arr.unshift(...Array(WrapSize).fill('wall'));
		arr.push(...Array(WrapSize).fill('wall'));
	})
	map.unshift(...Array(WrapSize).fill(Array(WrapSize*2+Width).fill('wall')));
	map.push(...Array(WrapSize).fill(Array(WrapSize*2+Width).fill('wall')))

	return map
}