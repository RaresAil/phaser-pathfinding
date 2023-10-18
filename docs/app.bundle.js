(()=>{"use strict";var t,e={220:(t,e,i)=>{const{Pathfinding:s,Grid:o,DistanceMethod:h}=i(413),a=i(728);class r extends a.Scene{pathGraphics=void 0;pathfinding=void 0;source=void 0;grid=void 0;map=void 0;method=h.Octile;simplify=!1;diagonal=!0;methodText=void 0;timeText=void 0;simText=void 0;digText=void 0;init(){this.input.keyboard?.on(`${a.Input.Keyboard.Events.KEY_DOWN}M`,(()=>{this.methodText&&(this.method===h.Octile?(this.method=h.Manhattan,this.methodText.text="| Method: Manhattan (Press M)"):this.method===h.Manhattan?(this.method=h.Chebyshev,this.methodText.text="| Method: Chebyshev (Press M)"):(this.method=h.Octile,this.methodText.text="| Method: Octile (Press M)"))}),this),this.input.keyboard?.on(`${a.Input.Keyboard.Events.KEY_DOWN}S`,(()=>{this.simText&&(this.simplify=!this.simplify,this.simText.text=`| Simplify: ${this.simplify} (Press S)`)}),this),this.input.keyboard?.on(`${a.Input.Keyboard.Events.KEY_DOWN}D`,(()=>{this.digText&&(this.diagonal=!this.diagonal,this.digText.text=`| Diagonal ${this.diagonal} (Press D)`)}),this)}preload(){this.load.image("map","map.png"),this.load.image("source","source.png"),this.input.on("pointerup",(t=>{if(!this.map||!this.source)return;const e=this.grid.getTilePositionInWorld(new a.Math.Vector2(t.worldX,t.worldY));e&&this.moveToTile(e)}),this)}create(){this.timeText=this.make.text({x:10,y:448,text:"Time: -",style:{color:"#000000"}}).setDepth(1e3),this.simText=this.make.text({x:128,y:448,text:"| Simplify: false (Press S)",style:{color:"#000000"}}).setDepth(1e3),this.methodText=this.make.text({x:395,y:448,text:"| Method: Octile (Press M)",style:{color:"#000000"}}).setDepth(1e3),this.digText=this.make.text({x:395,y:466,text:"| Diagonal true (Press D)",style:{color:"#000000"}}).setDepth(1e3);const t=[];this.map=this.make.tilemap({data:[[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]].map(((e,i)=>e.map(((e,s)=>0===e?(t.push({x:s,y:i}),-1):e)))),tileWidth:24,tileHeight:24}),this.map.addTilesetImage("map","map",24,24),this.map.createLayer(0,"map",0,0);const e=this.map.createBlankLayer("obs","map");t.forEach((({x:t,y:i})=>{e.putTileAt(0,t,i).setCollision(!0,!0,!0,!0,!0)})),e.setCollisionByProperty({collides:!0}),this.grid=o.createFromMap(this.map,[e]),this.pathfinding=new s(this.grid),this.source=this.add.follower(new a.Curves.Spline,36,36,"source")}moveToTile(t){const e=this.grid.getTilePositionInWorld(new a.Math.Vector2(this.source.x,this.source.y));if(!e)return;this.pathGraphics?.clear();const i=Date.now(),s=this.pathfinding.findPathBetweenTl(e,t,{simplify:this.simplify,distanceMethod:this.method,diagonal:this.diagonal}),o=Date.now()-i;this.timeText?.setText(`Time: ${o}ms`);const h=new a.Curves.Path(this.source.x,this.source.y),r=[new a.Math.Vector2(this.source.x,this.source.y),...s.map((({worldX:t,worldY:e})=>{const i=new a.Math.Vector2(t,e);return h.lineTo(i),i}))];this.pathGraphics=this.add.graphics(),this.pathGraphics.lineStyle(2,0,1),h.draw(this.pathGraphics),this.pathGraphics.fillStyle(65280,1);for(let t=0;t<r.length;t++)this.pathGraphics.fillCircle(r[t].x,r[t].y,4);this.source.setPath(h),this.source.startFollow(100*r.length)}}const n={title:"@raresail/phaser-pathfinding",type:a.AUTO,scale:{width:744,height:490,mode:a.Scale.NONE,zoom:1},render:{antialias:!1,pixelArt:!0},physics:{default:"arcade",arcade:{debug:!1}},parent:"content",backgroundColor:"#F2F1F0",scene:r};new a.Game(n)}},i={};function s(t){var o=i[t];if(void 0!==o)return o.exports;var h=i[t]={id:t,loaded:!1,exports:{}};return e[t].call(h.exports,h,h.exports,s),h.loaded=!0,h.exports}s.m=e,t=[],s.O=(e,i,o,h)=>{if(!i){var a=1/0;for(d=0;d<t.length;d++){for(var[i,o,h]=t[d],r=!0,n=0;n<i.length;n++)(!1&h||a>=h)&&Object.keys(s.O).every((t=>s.O[t](i[n])))?i.splice(n--,1):(r=!1,h<a&&(a=h));if(r){t.splice(d--,1);var l=o();void 0!==l&&(e=l)}}return e}h=h||0;for(var d=t.length;d>0&&t[d-1][2]>h;d--)t[d]=t[d-1];t[d]=[i,o,h]},s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{var t={143:0};s.O.j=e=>0===t[e];var e=(e,i)=>{var o,h,[a,r,n]=i,l=0;if(a.some((e=>0!==t[e]))){for(o in r)s.o(r,o)&&(s.m[o]=r[o]);if(n)var d=n(s)}for(e&&e(i);l<a.length;l++)h=a[l],s.o(t,h)&&t[h]&&t[h][0](),t[h]=0;return s.O(d)},i=self.webpackChunkexample=self.webpackChunkexample||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var o=s.O(void 0,[216],(()=>s(220)));o=s.O(o)})();