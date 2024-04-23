import{A as u,C as M,D as b,E as f,F as g,G as _,M as $,N as L,O as V,P as q,Q as z,R,S as G,T as H,c as a,d as W,e as O,f as T,g as F,h as m,i as B,j as I,k as P,l as D,m as A,p as j,s as E,t as N,v as h,z as l}from"./chunk-TUHVPYZI.js";function J(e){if(typeof e=="string")return+e;if(Number.isSafeInteger(e)&&e>=0&&e<256)return e;throw new Error("Cannot parse byte")}var k=class{constructor(t,c,o){this.controlId=t,this.input$=c,this._controlOptions=o,this._controlId=J(this.controlId)}createOutput(){let t=this.input$.pipe(m(this._controlOptions.mapFn));if(this._controlOptions.throttle){let c=this._controlOptions.throttle,o,n;t=t.pipe(I(i=>{let r=c(i,o);if(r===void 0)return n&&window.clearTimeout(n.timerId),n=void 0,Promise.resolve();if(n!=null)return n.promise;let s=0,v=new Promise(U=>{s=window.setTimeout(()=>{n=void 0,U()},r)});return n={promise:v,timerId:s},v}),A(i=>o=i))}if(this._controlOptions.repeat){let c=this._controlOptions.repeat;t=t.pipe(D(o=>{let n=c(o);return n===void 0?F(o):B(n).pipe(P(o),m(()=>o))}))}return t.pipe(m(c=>{let o=this._controlOptions.mapOutputFn(c);return Array.isArray(o)?[this._controlId,...o]:[this._controlId,o]}))}},x=class extends k{get value(){return this._value$.value}set value(t){this._value$.next(t)}constructor(t,c,o){let n=new T(c);super(t,n,o),this._value$=n}},d=class extends x{constructor(t,c=0,o=!0,n=void 0){let i={mapFn:o?r=>Math.floor(r*127+127):r=>Math.floor(r*255),mapOutputFn:r=>r,throttle:(r,s)=>{if(!(s===void 0||Math.abs(r-s)>50))return 200}};n!==void 0&&(i.repeat=o?r=>r===127?void 0:n:r=>r===0?void 0:n),super(t,c,i)}};var y=class{get connection(){return this._connection}constructor(t){this._connectionBuilder=t,this.controls={velocity:new d("0x01",0,!0,1e3),stearingWheels:new d("0x02",0,!0)}}startConnection(){return a(this,null,function*(){this._subscription?.unsubscribe(),this._connection&&(yield this._connection.disconnect()),this._connection=this._connectionBuilder(),yield this._connection.connect(),this._subscription=new W;let t=Object.keys(this.controls);for(let c of t){let n=this.controls[c].createOutput().subscribe(i=>this.connection?.send([0,...i]));this._subscription.add(n)}})}};var p=function(e){return e[e.Disconnected=0]="Disconnected",e[e.Connecting=1]="Connecting",e[e.Connected=2]="Connected",e}(p||{}),S=class{constructor(t,c){this.prevStatus=t,this.newStatus=c}};var w=class{constructor(){this._status=p.Disconnected,this._output$=new O,this.output$=this._output$.asObservable()}get status(){return this._status}_changeStatus(t){this._status!==t&&this._output$.next(new S(this._status,this._status=t))}};var C=class extends w{constructor(t){super(),this.options=t}connect(){return a(this,null,function*(){console.log("FakeConnection->connecting"),this._changeStatus(p.Connecting),yield new Promise(t=>setTimeout(t,this.options?.connectionTime??2e3)),console.log("FakeConnection->connected"),this._changeStatus(p.Connected)})}disconnect(){return a(this,null,function*(){console.log("FakeConnection->disconnect"),this._changeStatus(p.Disconnected)})}send(t){return a(this,null,function*(){console.log("FakeConnection->send",t.slice()),yield Promise.resolve()})}};var K=(()=>{let t=class t{constructor(){this.control=new y(()=>new C)}connect(){return a(this,null,function*(){yield this.control.startConnection()})}connectBluetooth(){return a(this,null,function*(){let o=Array.from("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").map(i=>({namePrefix:i})).concat({name:""}),n=yield navigator.bluetooth.requestDevice({filters:o,optionalServices:["generic_access"]})})}};t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=E({type:t,selectors:[["app-c-control"]],decls:8,vars:3,consts:[[3,"click"],["type","range","min","-1","max","1","step","0.01",3,"ngModelChange","ngModel"],["vertical","","positive-key","w","negative-key","s",3,"ngModelChange","ngModel"],["horizontal","","positive-key","d","negative-key","a",3,"ngModelChange","ngModel"]],template:function(n,i){n&1&&(l(0,"button",0),M("click",function(){return i.connect()}),b(1,"Connect"),u(),l(2,"button",0),M("click",function(){return i.connectBluetooth()}),b(3,"Connect (bluetooth)"),u(),l(4,"input",1),_("ngModelChange",function(s){return g(i.control.controls.stearingWheels.value,s)||(i.control.controls.stearingWheels.value=s),s}),u(),l(5,"app-stick")(6,"app-stick-axis",2),_("ngModelChange",function(s){return g(i.control.controls.velocity.value,s)||(i.control.controls.velocity.value=s),s}),u(),l(7,"app-stick-axis",3),_("ngModelChange",function(s){return g(i.control.controls.stearingWheels.value,s)||(i.control.controls.stearingWheels.value=s),s}),u()()),n&2&&(h(4),f("ngModel",i.control.controls.stearingWheels.value),h(2),f("ngModel",i.control.controls.velocity.value),h(),f("ngModel",i.control.controls.stearingWheels.value))},dependencies:[L,z,V,q,G,R],styles:["app-stick[_ngcontent-%COMP%]{width:300px}"]});let e=t;return e})();var Q=[{path:"",component:K}];var kt=(()=>{let t=class t{};t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=N({type:t}),t.\u0275inj=j({imports:[H,$.forChild(Q)]});let e=t;return e})();export{kt as ControlModule};
