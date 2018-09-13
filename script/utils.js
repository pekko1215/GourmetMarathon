function rand(a){
	return ~~(Math.random()*a);
}

function Lottery(arr){
	var r = rand(100);
	return arr.findIndex(val=>{
		r -= val;
		if(r<0)return true;
	})
}