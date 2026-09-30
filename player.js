/* Attaches sources to <video class="md-player" data-src="..."> (mp4 directly, HLS via hls.js when needed). */
(function(){
  var hlsLoading=null;
  function loadHls(){ if(window.Hls) return Promise.resolve(); if(hlsLoading) return hlsLoading;
    hlsLoading=new Promise(function(res,rej){ var s=document.createElement('script'); s.src='/vendor/hls.light.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); return hlsLoading; }
  function attach(v){
    var ps=v.getAttribute('data-poster'); if(ps&&ps.indexOf('{{')<0&&v.getAttribute('poster')!==ps) v.setAttribute('poster',ps);
    var src=v.getAttribute('data-src')||''; if(!src||src.indexOf('{{')>-1||v.__mdSrc===src) return;
    if(v.__hls){ try{v.__hls.destroy();}catch(e){} v.__hls=null; }
    v.__mdSrc=src;
    if(/\.m3u8($|\?)/.test(src)){
      if(v.canPlayType('application/vnd.apple.mpegurl')){ v.src=src; return; }
      loadHls().then(function(){ if(v.__mdSrc!==src) return; if(window.Hls&&window.Hls.isSupported()){ var h=new window.Hls({maxBufferLength:30}); h.loadSource(src); h.attachMedia(v); v.__hls=h; } else { v.src=src; } });
    } else { v.src=src; }
  }
  function scan(root){ (root.querySelectorAll?root:document).querySelectorAll('video.md-player').forEach(attach); }
  var mo=new MutationObserver(function(){ scan(document); });
  function start(){ scan(document); mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-src','data-poster']}); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
