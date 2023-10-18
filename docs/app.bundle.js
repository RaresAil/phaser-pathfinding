(()=>{"use strict";var t,e={220:(t,e,i)=>{const{Pathfinding:s,Grid:o,DistanceMethod:a}=i(413),h=i(728);class r extends h.Scene{pathfinding=void 0;source=void 0;grid=void 0;map=void 0;method=a.Octile;simplify=!1;diagonal=!0;methodText=void 0;timeText=void 0;simText=void 0;digText=void 0;init(){this.input.keyboard?.on(`${h.Input.Keyboard.Events.KEY_DOWN}M`,(()=>{this.methodText&&(this.method===a.Octile?(this.method=a.Manhattan,this.methodText.text="| Method: Manhattan (Press M)"):this.method===a.Manhattan?(this.method=a.Chebyshev,this.methodText.text="| Method: Chebyshev (Press M)"):(this.method=a.Octile,this.methodText.text="| Method: Octile (Press M)"))}),this),this.input.keyboard?.on(`${h.Input.Keyboard.Events.KEY_DOWN}S`,(()=>{this.simText&&(this.simplify=!this.simplify,this.simText.text=`| Simplify: ${this.simplify} (Press S)`)}),this),this.input.keyboard?.on(`${h.Input.Keyboard.Events.KEY_DOWN}D`,(()=>{this.digText&&(this.diagonal=!this.diagonal,this.digText.text=`| Diagonal ${this.diagonal} (Press D)`)}),this)}preload(){this.load.image("map","map.png"),this.input.on("pointerup",(t=>{if(!this.map||!this.source)return;const e=this.grid.getTilePositionInWorld(new h.Math.Vector2(t.worldX,t.worldY));e&&this.moveToTile(e)}),this)}create(){this.timeText=this.make.text({x:10,y:448,text:"Time: -",style:{color:"#000000"}}).setDepth(1e3),this.simText=this.make.text({x:128,y:448,text:"| Simplify: false (Press S)",style:{color:"#000000"}}).setDepth(1e3),this.methodText=this.make.text({x:395,y:448,text:"| Method: Octile (Press M)",style:{color:"#000000"}}).setDepth(1e3),this.digText=this.make.text({x:395,y:466,text:"| Diagonal true (Press D)",style:{color:"#000000"}}).setDepth(1e3);const t=[];this.map=this.make.tilemap({data:[[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]].map(((e,i)=>e.map(((e,s)=>0===e?(t.push({x:s,y:i}),-1):e)))),tileWidth:24,tileHeight:24}),this.map.addTilesetImage("map","map",24,24),this.map.createLayer(0,"map",0,0);const e=this.map.createBlankLayer("obs","map");t.forEach((({x:t,y:i})=>{e.putTileAt(0,t,i).setCollision(!0,!0,!0,!0,!0)})),e.setCollisionByProperty({collides:!0}),this.grid=o.createFromMap(this.map,[e]),this.pathfinding=new s(this.grid),this.source=this.add.rectangle(24,24,24,24,15844367)}moveToTile(t){const e=this.grid.getTilePositionInWorld(new h.Math.Vector2(this.source.x,this.source.y));if(!e)return;this.map.replaceByIndex(1,2,void 0,void 0,void 0,void 0,0);const i=Date.now(),s=this.pathfinding.findPathBetweenTl(e,t,{simplify:this.simplify,distanceMethod:this.method,diagonal:this.diagonal}),o=Date.now()-i;this.timeText?.setText(`Time: ${o}ms`),s.forEach((({tileX:t,tileY:e})=>{const i=this.map.getTileAt(t,e,!1,0);i&&(i.index=1)}))}}const n={title:"@raresail/phaser-pathfinding",type:h.AUTO,scale:{width:744,height:490,mode:h.Scale.NONE,zoom:1},render:{antialias:!1,pixelArt:!0},physics:{default:"arcade",arcade:{debug:!1}},parent:"content",backgroundColor:"#F2F1F0",scene:r};new h.Game(n)}},i={};function s(t){var o=i[t];if(void 0!==o)return o.exports;var a=i[t]={id:t,loaded:!1,exports:{}};return e[t].call(a.exports,a,a.exports,s),a.loaded=!0,a.exports}s.m=e,t=[],s.O=(e,i,o,a)=>{if(!i){var h=1/0;for(l=0;l<t.length;l++){for(var[i,o,a]=t[l],r=!0,n=0;n<i.length;n++)(!1&a||h>=a)&&Object.keys(s.O).every((t=>s.O[t](i[n])))?i.splice(n--,1):(r=!1,a<h&&(h=a));if(r){t.splice(l--,1);var d=o();void 0!==d&&(e=d)}}return e}a=a||0;for(var l=t.length;l>0&&t[l-1][2]>a;l--)t[l]=t[l-1];t[l]=[i,o,a]},s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{var t={143:0};s.O.j=e=>0===t[e];var e=(e,i)=>{var o,a,[h,r,n]=i,d=0;if(h.some((e=>0!==t[e]))){for(o in r)s.o(r,o)&&(s.m[o]=r[o]);if(n)var l=n(s)}for(e&&e(i);d<h.length;d++)a=h[d],s.o(t,a)&&t[a]&&t[a][0](),t[a]=0;return s.O(l)},i=self.webpackChunkexample=self.webpackChunkexample||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var o=s.O(void 0,[216],(()=>s(220)));o=s.O(o)})();