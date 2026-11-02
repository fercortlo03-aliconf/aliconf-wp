
(function(){
  var b=document.getElementById("menuBtn"),n=document.getElementById("nav");
  function set(o){n.classList.toggle("open",o);b.setAttribute("aria-expanded",o);b.textContent=o?"Cerrar":"Menú"}
  b.addEventListener("click",function(){set(!n.classList.contains("open"))});
  n.addEventListener("click",function(e){if(e.target.closest("a"))set(false)});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false)});
  var top=document.getElementById("top");
  function sc(){top.classList.toggle("scrolled",window.scrollY>8)}
  window.addEventListener("scroll",sc,{passive:true});sc();
})();
(function(){
  var PHONE="528148886103";
  var f=document.getElementById("contactForm"); if(!f) return;
  var EMAIL="",mail=document.getElementById("sendMail"),wa=document.getElementById("sendWa"); if(mail&&!EMAIL) mail.hidden=true;
  function msg(){
    var d=new FormData(f), t=["Hola, soy "+d.get("nombre").trim()+" ("+d.get("tipo")+").",d.get("mensaje").trim()];
    if(d.get("telefono").trim()) t.push("Mi teléfono: "+d.get("telefono").trim());
    return t.join("\n\n");
  }
  f.addEventListener("submit",function(e){e.preventDefault();
    window.open("https://wa.me/"+PHONE+"?text="+encodeURIComponent(msg()),"_blank","noopener");
    var t=wa.textContent;wa.textContent="Abriendo WhatsApp…";setTimeout(function(){wa.textContent=t},2200);});
  if(mail) mail.addEventListener("click",function(){ if(!f.reportValidity()) return;
    location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Mensaje desde la página web")+"&body="+encodeURIComponent(msg());});
})();

(function(){
  var track=document.getElementById("track"),dotsEl=document.getElementById("dots"),car=document.getElementById("car");
  if(!track) return;
  var real=track.children.length;
  track.appendChild(track.children[0].cloneNode(true)); // clon para el loop continuo
  var i=0,timer=null,reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dots=[];
  for(var d=0;d<real;d++){(function(d){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label","Ir al grupo "+(d+1));b.onclick=function(){go(d);restart()};dotsEl.appendChild(b);dots.push(b)})(d)}
  function mark(){dots.forEach(function(b,n){b.setAttribute("aria-current",n===i%real)})}
  function go(n){track.style.transition="";i=n;track.style.transform="translateX(-"+(i*100)+"%)";mark()}
  function next(){
    i++;track.style.transform="translateX(-"+(i*100)+"%)";mark();
    if(i===real){setTimeout(function(){track.style.transition="none";i=0;track.style.transform="translateX(0)";void track.offsetWidth;track.style.transition=""},550)}
  }
  function start(){if(!reduce&&!timer)timer=setInterval(next,3500)}
  function stop(){clearInterval(timer);timer=null}
  function restart(){stop();start()}
  car.addEventListener("mouseenter",stop);car.addEventListener("mouseleave",start);
  car.addEventListener("focusin",stop);car.addEventListener("focusout",start);
  document.addEventListener("visibilitychange",function(){document.hidden?stop():start()});
  mark();start();
})();

(function(){
  var W=[360,1020], S=[360,840], P=[420,1080];
  var B=[
    {h:[S,W,W,W,W,W,W]},            /* Alimentos Confiables Cortés */
    {h:[null,P,P,P,P,P,P]},         /* La Principal */
    {h:[S,W,W,W,W,W,W]}             /* El Calvario */
  ];
  var DAYS={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  var NAMES=["el domingo","el lunes","el martes","el miércoles","el jueves","el viernes","el sábado"];
  function now(){
    var p=new Intl.DateTimeFormat("en-US",{timeZone:"America/Mexico_City",weekday:"short",hour:"numeric",minute:"numeric",hourCycle:"h23"}).formatToParts(new Date()),o={};
    p.forEach(function(x){o[x.type]=x.value});
    return {d:DAYS[o.weekday],m:parseInt(o.hour,10)*60+parseInt(o.minute,10)};
  }
  function fmt(m){var h=Math.floor(m/60),mm=m%60;return (h%12||12)+":"+(mm<10?"0":"")+mm+" "+(h<12?"am":"pm")}
  function status(b,t){
    var r=b.h[t.d];
    if(r&&t.m>=r[0]&&t.m<r[1]) return {on:true,detail:"Hasta las "+fmt(r[1])};
    if(r&&t.m<r[0]) return {on:false,detail:"Abre hoy a las "+fmt(r[0])};
    for(var k=1;k<=7;k++){var d=(t.d+k)%7,r2=b.h[d]; if(r2) return {on:false,detail:"Abre "+(k===1?"mañana":NAMES[d])+" a las "+fmt(r2[0])};}
    return {on:false,detail:""};
  }
  var t=now(),S_=B.map(function(b){return status(b,t)});
  document.querySelectorAll(".board .row").forEach(function(a){
    var s=S_[+a.getAttribute("data-b")]; if(!s) return;
    a.querySelector(".hr").textContent=s.detail;
    a.querySelector(".st").innerHTML='<i class="dot '+(s.on?"on":"off")+'"></i>'+(s.on?"Abierto":"Cerrado");
  });
  document.querySelectorAll(".branch h3").forEach(function(h,n){
    var s=S_[n]; if(!s) return;
    h.insertAdjacentHTML("afterend",'<p class="open-now '+(s.on?"on":"off")+'"><i class="dot '+(s.on?"on":"off")+'"></i>'+(s.on?"Abierto ahora":"Cerrado ahora")+(s.detail?" · "+s.detail.charAt(0).toLowerCase()+s.detail.slice(1):"")+"</p>");
  });
})();
