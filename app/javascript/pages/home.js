  // ── CURSOR
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx=0,my=0,rx=0,ry=0;
    const isMobile = window.matchMedia('(hover:none)').matches;
    if(isMobile){ cur.style.display='none'; ring.style.display='none'; document.body.style.cursor='auto'; }
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cur.style.transform=`translate(${mx-4}px,${my-4}px)`;
    },{passive:true});
    (function animRing(){
      rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
      ring.style.transform=`translate(${rx-18}px,${ry-18}px)`;
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a,button,.service-card,.testi-card').forEach(el=>{
      el.addEventListener('mouseenter',()=>ring.classList.add('hov'));
      el.addEventListener('mouseleave',()=>ring.classList.remove('hov'));
    });

    // ── NAVBAR
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll',()=>{
      nav.classList.toggle('scrolled', scrollY>60);
    },{passive:true});

    // ── VIDEO CAROUSEL
    const videos = document.querySelectorAll('.hero-video');
    const dots = document.querySelectorAll('.hero-dot');
    let vidIdx = 0;
    function switchVideo(idx){
      videos[vidIdx].classList.remove('active');
      dots[vidIdx].classList.remove('active');
      vidIdx = idx;
      videos[vidIdx].classList.add('active');
      dots[vidIdx].classList.add('active');
      // Preload & play next video
      const v = videos[vidIdx];
      if(v.readyState === 0) v.load();
      v.play().catch(()=>{});
    }
    // Auto advance every 6s
    let vidTimer = setInterval(()=> switchVideo((vidIdx+1) % videos.length), 6000);
    // Manual dots
    dots.forEach(dot=>{
      dot.addEventListener('click',()=>{
        clearInterval(vidTimer);
        switchVideo(parseInt(dot.dataset.idx));
        vidTimer = setInterval(()=> switchVideo((vidIdx+1) % videos.length), 6000);
      });
    });

    // ── SCROLL REVEAL
    const ro = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

    // ── COUNTERS
    const counterData = [
      {id:'c1', target:20},
      {id:'c2', target:2},
      {id:'c3', target:6},
      {id:'c4', target:100},
    ];
    const cr = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting||e.target.dataset.done) return;
        e.target.dataset.done=1;
        const d = counterData.find(c=>c.id===e.target.id);
        if(!d) return;
        let n=0; const step=d.target/40;
        const t=setInterval(()=>{
          n=Math.min(n+step,d.target);
          e.target.textContent=Math.round(n);
          if(n>=d.target) clearInterval(t);
        },30);
      });
    },{threshold:.5});
    ['c1','c2','c3','c4'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) cr.observe(el);
    });

    // ── FORM
    function handleForm(e){
      e.preventDefault();
      const btn=document.getElementById('submitBtn');
      btn.textContent='Message envoyé ✓';
      btn.style.background='#2D5240';
      btn.disabled=true;
      setTimeout(()=>{
        btn.textContent='Envoyer la demande';
        btn.style.background='';
        btn.disabled=false;
        e.target.reset();
      },3000);
    }