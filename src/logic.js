
class Component extends DCLogic {
  // ---- data from Supabase (loaded before boot into window.__MDATA) ----
  db = (function(){ const d=window.__MDATA||{}; const o={}; ['categories','centers','studentSubs','teachers','courses','sections','lessons','files','plans','faqs','students','testimonials','enrollments','payments','refunds','payouts','subscriptions','submissions','questions','coupons','tickets','audit','applications','notifications','stats'].forEach(k=>o[k]=d[k]||[]); return o; })();
  cfg = window.MADAREK||{};
  me = this.cfg.demoStudent||'s1';
  meT = this.cfg.demoTeacher||'t1';
  stat = (k,dflt)=>{ const r=this.db.stats.find(x=>x.key===k); return r?r.value:(dflt||''); };
  statJ = (k,dflt)=>{ try{ return JSON.parse(this.stat(k,'')); }catch(e){ return dflt; } };
  courses = this.db.courses.map(c=>({id:c.id,slug:c.slug,title:c.title,t:c.teacher_id,cat:c.category_id,level:c.level,grade:c.grade,track:c.track,subject:c.subject,center:c.center_id,term:c.term,chapterPrice:c.chapter_price,lessonPrice:c.lesson_price,audience:c.audience||'',price:c.price,old:c.old_price,rating:+c.rating,reviews:c.reviews_count,hours:c.hours,lessons:c.lessons_count,students:c.students_count,status:c.status,access:c.access_months,sum:c.summary||'',outcomes:c.outcomes||[],reqs:c.requirements||[],cover:c.cover,promo:c.promo_video,featured:c.featured,created:c.created_at}));
  cats = this.db.categories.map(c=>({id:c.id,name:c.name,c:c.color,bg:c.bg,art:c.art||c.id,n:this.db.courses.filter(x=>x.category_id===c.id&&x.status==='published').length}));
  GRADES = [{id:1,name:'أولى ثانوي',sub:'سنة تأسيسية — مواد مشتركة'},{id:2,name:'تانية ثانوي',sub:'بكالوريا — مشتركة + مادة المسار'},{id:3,name:'تالتة ثانوي',sub:'بكالوريا — مواد المسار المتقدمة'}];
  gradeName = (g)=>(this.GRADES.find(x=>x.id===+g)||{name:''}).name;
  centers = this.db.centers.map(c=>({id:c.id,slug:c.slug,name:c.name,city:c.city,gov:c.governorate,address:c.address||'',since:c.since_year,students:c.students_count,rating:+c.rating,desc:c.description||'',c:c.color,bg:c.bg,featured:c.featured}));
  centerOf = (id)=>this.centers.find(x=>x.id===id)||{id:'',slug:'',name:'',city:'',gov:'',c:'#4F46E5',bg:'#EEF2FF',rating:0,students:0,desc:'',address:''};
  bundleRules = (function(self){ try{ return JSON.parse((self.db.stats.find(x=>x.key==='bundle_rules')||{}).value||'[]'); }catch(e){ return []; } })(this);
  bundlePct = (n)=>this.bundleRules.filter(r=>n>=r.min).reduce((a,r)=>Math.max(a,r.pct),0);
  studentPlans = this.db.plans.filter(p=>p.audience==='student').map(p=>({id:p.id,name:p.name,price:p.monthly,months:p.months,best:p.is_best,desc:p.description,note:p.note||'',limits:p.limits||[]}));
  myPaid = this.db.payments.filter(p=>p.student_id===(window.MADAREK&&window.MADAREK.demoStudent||'s1')&&p.status==='مدفوع');
  teachers = this.db.teachers.map(t=>({id:t.id,slug:t.slug,name:t.name,title:t.title,cat:t.category_id,center:t.center_id,rating:+t.rating,students:t.students_count,years:t.years,bio:t.bio||'',city:t.city||''}));
  studentsById = this.db.students.reduce((a,s)=>(a[s.id]=s,a),{});
  sname = (id)=>(this.studentsById[id]||{name:'طالب'}).name;
  curOf = (cid)=>this.db.sections.filter(s=>s.course_id===cid).map(s=>({id:s.id,title:s.title,price:s.price,course:cid,lessons:this.db.lessons.filter(l=>l.section_id===s.id).map(l=>({id:l.id,title:l.title,min:l.minutes,free:l.is_free,video:l.video_url,poster:l.poster,kind:l.kind,price:l.price,section:s.id,course:cid}))}));
  plans = this.db.plans.filter(p=>p.audience!=='student').map(p=>({id:p.id,name:p.name,m:p.monthly,y:p.yearly,best:p.is_best,desc:p.description,limits:p.limits||[]}));
  faqData = this.db.faqs.map(f=>({q:f.q,a:f.a}));
  testimonialData = this.db.testimonials.map(t=>({name:(t.students&&t.students.name)||this.sname(t.student_id),role:t.role,text:t.text,rating:t.rating}));
  payments = this.db.payments.map(p=>({id:p.id,course:p.course_id,type:p.item_type,ref:p.item_ref,itemTitle:p.item_title,student:this.sname(p.student_id),sid:p.student_id,amount:p.amount,status:p.status,method:p.method,date:(p.paid_at||'').slice(0,10),ts:p.paid_at}));
  payouts = this.db.payouts.map(p=>({id:p.id,t:p.teacher_id,amount:p.amount,status:p.status,date:(p.requested_at||'').slice(0,10),method:p.method}));
  myEnroll = this.db.enrollments.filter(e=>e.student_id===this.me);
  MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  fmtDate = (ts)=>{ if(!ts) return ''; const d=new Date(ts); return d.getDate()+' '+this.MONTHS[d.getMonth()]+' '+d.getFullYear(); };
  ago = (ts)=>{ if(!ts) return ''; const m=Math.max(1,Math.round((Date.now()-new Date(ts).getTime())/60000));
    if(m<60) return m<=2?'دلوقتي':'قبل '+m+' دقيقة'; const h=Math.round(m/60); if(h<24) return h===1?'قبل ساعة':h===2?'قبل ساعتين':'قبل '+h+' ساعات';
    const d=Math.round(h/24); if(d===1) return 'امبارح'; if(d===2) return 'قبل يومين'; if(d<30) return 'قبل '+d+' أيام'; const mo=Math.round(d/30); return mo===1?'قبل شهر':'قبل '+mo+' شهور'; };
  coverUrl = (c)=>'/assets/'+((c&&c.cover)||'course-c1')+'.webp';
  initLearn = (function(self){ const e=self.myEnroll.find(x=>x.course_id==='c1')||self.myEnroll[0]; const cid=e?e.course_id:'c1';
    const all=self.db.lessons.filter(l=>l.course_id===cid); const n=Math.floor((e?e.progress:0)/100*all.length);
    const withVid=all.find(l=>l.video_url&&l.position>1)||all[0];
    return {cid:cid, done:all.slice(0,n).map(l=>l.id), lesson:withVid?withVid.id:''}; })(this);
  state = {
    route:'home', p:{}, role:'guest', w:1280, drawer:false, notif:false,
    q:'', cats:[], level:'', priceBand:'', minRating:0, sort:'الأكثر شعبية', filtersOpen:false,
    purchased:Array.from(new Set(this.myPaid.filter(p=>p.item_type==='subject'||p.item_type==='bundle').reduce((a,p)=>a.concat(String(p.item_ref||'').split(',')),[]).filter(Boolean))), ownedChapters:this.myPaid.filter(p=>p.item_type==='chapter').map(p=>p.item_ref), ownedLessons:this.myPaid.filter(p=>p.item_type==='lesson').map(p=>p.item_ref), subActive:this.db.studentSubs.some(x=>x.student_id===this.me&&x.status==='نشط'), subPlan:(this.db.studentSubs.find(x=>x.student_id===this.me&&x.status==='نشط')||{}).plan_id||'', cart:(function(){ try{ return JSON.parse(localStorage.getItem('md-cart')||'[]'); }catch(e){ return []; } })(), gradeF:0, trackF:'', centerF:'', pricingTab:'students', cf:{center:'',owner:'',phone:'',city:'',teachers:'',students:'',msg:''}, cfSent:false, cfSending:false, paidItems:[], progress:this.myEnroll.reduce((a,e)=>(a[e.course_id]=e.progress,a),{}), done:this.initLearn.done, lesson:this.initLearn.lesson, learnCourse:this.initLearn.cid, learnTab:'files', noteText:'',
    openSecs:this.db.sections.filter(x=>x.position===1||x.position===2).map(x=>x.id), faq:null, courseTab:'curriculum', myTab:'all', payTab:'payments',
    toasts:[], modal:null, refundReason:'', payMethod:'فودافون كاش', payState:'idle', payResult:'success', payCourse:'c2', menuOpen:false,
    teachStep:1, teachDraftSaved:false, editorStep:1, editorSaved:'محفوظ الآن', uploadPct:0, uploading:false, uploadFailed:false,
    yearly:false, adminReview:null, adminReason:'', audit:[], loginErr:false, email:'', pw:''
  };
  componentDidMount(){
    try{document.documentElement.dir='rtl';document.documentElement.lang='ar';}catch(e){}
    this.onR=()=>this.setState({w:window.innerWidth});
    this.onR(); window.addEventListener('resize',this.onR);
    this.onHash=()=>{ const r=this.parseHash(); if(r.route!==this.state.route||JSON.stringify(r.p)!==JSON.stringify(this.state.p)){ this.setState({route:r.route,p:r.p,drawer:false,notif:false,modal:null,menuOpen:false}); try{window.scrollTo({top:0})}catch(e){} } };
    window.addEventListener('hashchange',this.onHash);
    const r0=this.parseHash(); if(r0.route!=='home') this.setState({route:r0.route,p:r0.p,role:this.roleForRoute(r0.route)});
    else if(this.props.startRoute && this.props.startRoute!=='home') this.setState({route:this.props.startRoute});
  }
  roleForRoute(r){ return r.indexOf('teacher-')===0?'teacher':r.indexOf('admin')===0?'admin':(r.indexOf('student')===0||r==='learn')?'student':'guest'; }
  parseHash(){
    const h=(location.hash||'').replace(/^#\/?/,''); if(!h) return {route:'home',p:{}};
    const parts=h.split('/').map(x=>{try{return decodeURIComponent(x)}catch(e){return x}});
    const route=parts[0]; const p={};
    if((route==='course'||route==='teacher'||route==='center')&&parts[1]) p.slug=parts[1];
    if(route==='learn'&&parts[1]) p.course=parts[1];
    return {route:route,p:p};
  }
  hashFor(route,p){ p=p||{}; if(route==='home') return '#/'; if(p.slug) return '#/'+route+'/'+encodeURIComponent(p.slug); if(p.course) return '#/'+route+'/'+encodeURIComponent(p.course); return '#/'+route; }
  componentWillUnmount(){ window.removeEventListener('resize',this.onR); window.removeEventListener('hashchange',this.onHash); }

  go=(route,p)=>{ const h=this.hashFor(route,p); this.setState({route:route,p:p||{},drawer:false,notif:false,modal:null,menuOpen:false}); try{ if(location.hash!==h) history.pushState(null,'',h); window.scrollTo({top:0}); }catch(e){} };
  toast=(msg,kind)=>{ const id=Math.random(); this.setState(s=>({toasts:[...s.toasts.slice(-1),{id:id,msg:msg,kind:kind||'ok'}]}));
    setTimeout(()=>this.setState(s=>({toasts:s.toasts.filter(t=>t.id!==id)})),3400); };
  money=(n)=>n===0?'مجانًا':(+n).toLocaleString('en-US')+' ج.م';
  cat=(id)=>this.cats.find(c=>c.id===id)||this.cats[0];
  teacher=(id)=>this.teachers.find(t=>t.id===id)||this.teachers[0];
  course=(id)=>this.courses.find(c=>c.id===id)||this.courses[0];
  courseBySlug=(s)=>this.courses.find(c=>c.slug===s)||this.courses[0];
  statusMeta=(st)=>({published:{t:'منشورة',c:'#0F766E',bg:'#ECFDF5'},draft:{t:'مسودة',c:'#475569',bg:'#F1F5F9'},review:{t:'قيد المراجعة',c:'#B45309',bg:'#FFFBEB'},changes:{t:'تحتاج تعديلًا',c:'#B91C1C',bg:'#FEF2F2'},paused:{t:'موقوفة',c:'#475569',bg:'#F1F5F9'}}[st]||{t:st,c:'#475569',bg:'#F1F5F9'});

  btn=(kind,extra)=>{
    const base='display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 20px;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer;transition:all var(--dur);';
    const k={primary:'border:0;background:var(--primary);color:#fff;',secondary:'border:0;background:var(--primary-50);color:var(--primary-700);',outline:'border:1px solid var(--border-2);background:#fff;color:var(--ink);',ghost:'border:0;background:transparent;color:var(--ink-2);',destructive:'border:0;background:var(--danger);color:#fff;'}[kind]||'';
    return base+k+(extra||'');
  };
  navBtn=(active)=>'display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;border:0;border-radius:10px;cursor:pointer;font-size:14px;font-weight:'+(active?'600':'500')+';background:'+(active?'var(--primary-50)':'transparent')+';color:'+(active?'var(--primary-700)':'var(--ink-2)')+';transition:background var(--dur)';
  pill=(active)=>'height:34px;padding:0 14px;border-radius:999px;border:1px solid '+(active?'var(--primary)':'var(--border)')+';background:'+(active?'var(--primary-50)':'#fff')+';color:'+(active?'var(--primary-700)':'var(--ink-2)')+';font-size:14px;font-weight:'+(active?'600':'500')+';cursor:pointer';
  tabBtn=(active)=>'padding:10px 4px;margin-inline-end:18px;border:0;border-bottom:2px solid '+(active?'var(--primary)':'transparent')+';background:none;color:'+(active?'var(--primary-700)':'var(--muted)')+';font-weight:600;font-size:15px;cursor:pointer';
  ini=(n)=>String(n||'؟').replace(/^(مستر|أ\.|م\.|د\.)\s*/,'').trim()[0]||'؟';
  avatar=(seed,size)=>{const c=this.cats[seed%this.cats.length]||{bg:'#EEF2FF',c:'#4F46E5'};return 'width:'+size+'px;height:'+size+'px;border-radius:999px;background:'+c.bg+';color:'+c.c+';display:grid;place-items:center;font-weight:700;font-size:'+Math.round(size/2.4)+'px;flex:0 0 auto';};

  toggleCat=(id)=>this.setState(s=>({trackF:s.trackF===id?'':id}));
  clearFilters=()=>this.setState({cats:[],level:'',priceBand:'',minRating:0,q:'',gradeF:0,trackF:'',centerF:''});
  filteredCourses(){
    const s=this.state; let out=this.courses.filter(c=>c.status==='published');
    if(s.q.trim()){const q=s.q.trim();out=out.filter(c=>c.title.indexOf(q)>-1||this.teacher(c.t).name.indexOf(q)>-1||this.centerOf(c.center).name.indexOf(q)>-1||c.sum.indexOf(q)>-1);}
    if(s.gradeF) out=out.filter(c=>c.grade===s.gradeF);
    if(s.trackF) out=out.filter(c=>c.track===s.trackF);
    if(s.centerF) out=out.filter(c=>c.center===s.centerF);
    if(s.priceBand==='low') out=out.filter(c=>c.price<1000);
    if(s.priceBand==='high') out=out.filter(c=>c.price>=1000);
    if(s.minRating) out=out.filter(c=>c.rating>=s.minRating);
    if(s.sort==='الأعلى تقييمًا') out=out.slice().sort((a,b)=>b.rating-a.rating);
    if(s.sort==='الأقل سعرًا') out=out.slice().sort((a,b)=>a.price-b.price);
    if(s.sort==='الأحدث') out=out.slice().sort((a,b)=>String(b.created).localeCompare(String(a.created)));
    if(s.sort==='الأكثر شعبية') out=out.slice().sort((a,b)=>b.students-a.students);
    return out;
  }
  // ---- ownership ----
  hasSub=()=>!!this.state.subActive;
  ownsCourse=(cid)=>this.hasSub()||this.state.purchased.indexOf(cid)>-1;
  ownsChapter=(sid,cid)=>this.ownsCourse(cid)||this.state.ownedChapters.indexOf(sid)>-1;
  canWatch=(l)=>!!l&&(l.free||this.ownsChapter(l.section,l.course)||this.state.ownedLessons.indexOf(l.id)>-1);
  partialCourse=(cid)=>this.state.ownedChapters.some(x=>x.indexOf(cid+'-s')===0)||this.state.ownedLessons.some(x=>x.indexOf(cid+'-l')===0);
  // ---- cart ----
  saveCart=(cart)=>{ try{ localStorage.setItem('md-cart',JSON.stringify(cart)); }catch(e){} };
  addToCart=(item,goCheckout)=>{
    const s=this.state; let cart=s.cart.filter(x=>x.type!=='subscription');
    if(item.type==='subscription') cart=[];
    if(cart.some(x=>x.type===item.type&&x.ref===item.ref)){ this.toast('موجود في السلة بالفعل','warn'); if(goCheckout) this.go('checkout'); return; }
    if(item.type==='subject') cart=cart.filter(x=>x.course!==item.course);
    if(item.type==='lesson'&&cart.some(x=>(x.type==='chapter'&&x.ref===item.section)||(x.type==='subject'&&x.course===item.course))){ this.toast('الحصة دي موجودة ضمن باب أو مادة في السلة','warn'); return; }
    if(item.type==='chapter'){ if(cart.some(x=>x.type==='subject'&&x.course===item.course)){ this.toast('المادة كاملة موجودة في السلة','warn'); return; } cart=cart.filter(x=>!(x.type==='lesson'&&x.section===item.ref)); }
    cart=[...cart,item]; this.saveCart(cart); this.setState({cart:cart});
    if(goCheckout) this.go('checkout'); else this.toast('اتضاف للسلة: '+item.title);
  };
  removeFromCart=(i)=>{ const cart=this.state.cart.filter((x,j)=>j!==i); this.saveCart(cart); this.setState({cart:cart}); };
  cartTotals=()=>{
    const cart=this.state.cart; const sub=cart.reduce((a,x)=>a+x.price,0);
    const subjects=cart.filter(x=>x.type==='subject'); const pct=this.bundlePct(subjects.length);
    const disc=Math.round(subjects.reduce((a,x)=>a+x.price,0)*pct/100);
    return {sub:sub,pct:pct,disc:disc,total:sub-disc,count:cart.length,subjects:subjects.length};
  };
  itemSubject=(c)=>({type:'subject',ref:c.id,course:c.id,title:c.title,meta:'المادة كاملة · '+c.lessons+' حصة · وصول '+c.access+' شهور',price:c.price});
  itemChapter=(sec,c)=>({type:'chapter',ref:sec.id,course:c.id,title:sec.title,meta:c.title+' · '+sec.lessons.length+' حصص',price:sec.price});
  itemLesson=(l,c)=>({type:'lesson',ref:l.id,course:c.id,section:l.section,title:l.title,meta:c.title+' · حصة واحدة '+l.min+' د',price:l.price});
  itemPlan=(p)=>({type:'subscription',ref:p.id,course:'',title:p.name,meta:'كل المواد على المنصة لمدة '+(p.months===1?'شهر':p.months+' شهور'),price:p.price});
  buy=(cid)=>{ this.addToCart(this.itemSubject(this.course(cid)),true); };
  subscribe=(pid)=>{ const p=this.studentPlans.find(x=>x.id===pid)||this.studentPlans[0]; this.addToCart(this.itemPlan(p),true); };
  pay=()=>{
    if(this.state.payState==='processing'||!this.state.cart.length) return;
    this.setState({payState:'processing'});
    setTimeout(()=>{
      const pending=this.state.payMethod==='فوري';
      const res=pending?'pending':'success';
      const items=this.state.cart.slice();
      this.setState(s=>{
        const n={payState:'idle',payResult:res,route:'payment',paidItems:items,cart:[]};
        if(res==='success'){
          n.purchased=Array.from(new Set(s.purchased.concat(items.filter(x=>x.type==='subject').map(x=>x.ref))));
          n.ownedChapters=s.ownedChapters.concat(items.filter(x=>x.type==='chapter').map(x=>x.ref));
          n.ownedLessons=s.ownedLessons.concat(items.filter(x=>x.type==='lesson').map(x=>x.ref));
          const sp=items.find(x=>x.type==='subscription'); if(sp){ n.subActive=true; n.subPlan=sp.ref; }
        }
        return n; });
      this.saveCart([]);
      try{ history.pushState(null,'','#/payment'); window.scrollTo({top:0}); }catch(e){}
      this.toast(pending?'اتسجل طلبك — ادفع بكود فوري خلال 48 ساعة':'تم الدفع واتفتح المحتوى',pending?'warn':'ok');
    },1400);
  };
  art=(id)=>'background-image:url('+((window.__resources&&window.__resources['art_'+id])||('assets/art-'+id+'.png'))+');background-size:cover;background-position:center;background-repeat:no-repeat';
  card=(c)=>{
    const cat=this.cat(c.cat), t=this.teacher(c.t), ctr=this.centerOf(c.center), bought=this.ownsCourse(c.id), partial=!bought&&this.partialCourse(c.id), pr=this.state.progress[c.id]||0;
    return {
      id:c.id,slug:c.slug,title:c.title,teacherName:t.name,centerName:ctr.name,catName:cat.name,rating:c.rating?c.rating.toFixed(1):'جديدة',reviews:c.reviews,
      priceText:this.money(c.price),metaText:c.lessons+' حصة · '+c.hours+' ساعة',level:this.gradeName(c.grade),bought:bought,notBought:!bought,partial:partial,
      partsText:c.chapterPrice?('باب بـ'+this.money(c.chapterPrice)+' · حصة بـ'+this.money(c.lessonPrice)):'',
      progress:pr,progressText:pr+'%',
      progressBar:'display:block;height:100%;width:'+pr+'%;background:var(--teal);border-radius:999px',
      cover:'position:relative;height:150px;background-image:url('+this.coverUrl(c)+');background-size:cover;background-position:center;border-bottom:1px solid var(--border)',
      catChip:'position:absolute;top:10px;inset-inline-end:10px;padding:4px 10px;border-radius:999px;background:#fff;border:1px solid '+cat.c+'33;color:'+cat.c+';font-size:12px;font-weight:600',
      gradeChip:'position:absolute;top:10px;inset-inline-start:10px;padding:4px 10px;border-radius:999px;background:rgba(15,23,42,.78);color:#fff;font-size:12px;font-weight:600',
      open:()=>this.go('course',{slug:c.slug}),
      resume:()=>this.startLearn(c.id)
    };
  };
  startLearn=(cid,lid)=>{ const all=this.flatLessons(cid); const keep=all.find(l=>l.id===this.state.lesson); const first=all.find(l=>this.state.done.indexOf(l.id)<0)||all[0]; const target=lid||(keep?keep.id:(first?first.id:'')); this.setState({learnCourse:cid,route:'learn',p:{course:cid},lesson:target,drawer:false,menuOpen:false}); try{ history.pushState(null,'','#/learn/'+cid); window.scrollTo({top:0}); }catch(e){} };
  completeLesson=()=>{
    const s=this.state, all=this.flatLessons(), i=all.findIndex(l=>l.id===s.lesson);
    const done=s.done.indexOf(s.lesson)>-1?s.done:[...s.done,s.lesson];
    const pct=Math.round(done.filter(id=>all.some(l=>l.id===id)).length/Math.max(1,all.length)*100);
    const next=all[i+1];
    this.setState({done:done,progress:Object.assign({},s.progress,{[s.learnCourse]:pct}),lesson:next?next.id:s.lesson});
    this.toast(next?'أُكمل الدرس — انتقلنا إلى الدرس التالي':'أكملت كل دروس الدورة، شهادتك جاهزة');
  };
  flatLessons(cid){ return this.curOf(cid||this.state.learnCourse).reduce((a,s)=>a.concat(s.lessons.map(l=>Object.assign({},l,{sec:s.title}))),[]); }
  simulateUpload=()=>{
    if(this.state.uploading) return;
    this.setState({uploading:true,uploadPct:0,uploadFailed:false});
    const tick=()=>{
      const p=this.state.uploadPct+11;
      if(p>=68&&!this.state.uploadFailedOnce){ this.setState({uploading:false,uploadFailed:true,uploadFailedOnce:true,uploadPct:68}); this.toast('توقف الرفع عند 68% — تحقق من الاتصال ثم أعد المحاولة','danger'); return; }
      if(p>=100){ this.setState({uploadPct:100,uploading:false}); this.toast('تم رفع فيديو الدرس ومعالجته'); return; }
      this.setState({uploadPct:p}); setTimeout(tick,260);
    };
    setTimeout(tick,260);
  };
  adminAct=(kind)=>{
    const s=this.state;
    if(kind!=='approve'&&!s.adminReason.trim()){ this.toast('اكتب سبب الطلب — يُسجَّل في سجل التدقيق','danger'); return; }
    const c=this.course(s.adminReview);
    const entry={id:'AL-'+(3100+s.audit.length),who:'مراجعة المحتوى · سلمى',what:(kind==='approve'?'نشر دورة: ':'طلب تعديل على: ')+c.title,why:kind==='approve'?'مطابقة لمعايير النشر':s.adminReason,when:'قبل لحظات'};
    this.setState({audit:[entry,...s.audit],adminReview:null,adminReason:'',reviewed:[...(s.reviewed||[]),c.id]});
    this.toast(kind==='approve'?'تم نشر الدورة وإشعار المدرس':'أُرسل طلب التعديل للمدرس');
  };

  renderVals(){
    const s=this.state, R=s.route, self=this;
    const isMobile=s.w<900, isPhone=s.w<620;
    const roleOf={home:'guest',courses:'guest',course:'guest',teachers:'guest',teacher:'guest',pricing:'guest',help:'guest',login:'guest',register:'guest',teach:'guest',checkout:'guest',payment:'guest',ds:'guest'};
    const space = R.indexOf('teacher-')===0?'teacher':R.indexOf('admin')===0?'admin':(R.indexOf('student')===0||R==='learn')?'student':'public';
    const isPublic = space==='public';
    const mk=(label,route,extra)=>({label:label,go:()=>self.go(route),mstyle:'height:48px;padding:0 12px;border:0;border-radius:10px;text-align:start;font-weight:600;font-size:16px;cursor:pointer;background:'+(R===route?'var(--primary-50)':'transparent')+';color:'+(R===route?'var(--primary-700)':'var(--ink)'),style:extra||('height:38px;padding:0 14px;border:0;background:'+(R===route?'var(--primary-50)':'transparent')+';color:'+(R===route?'var(--primary-700)':'var(--ink-2)')+';border-radius:10px;font-weight:600;font-size:15px;cursor:pointer')});
    const navItem=(label,route,badge)=>{const a=R===route;return{label:label,badge:badge||'',go:()=>self.go(route),style:self.navBtn(a),
      dot:'width:7px;height:7px;border-radius:999px;flex:0 0 auto;background:'+(a?'var(--primary)':'var(--border-2)'),
      badgeStyle:badge?'padding:1px 8px;border-radius:999px;background:var(--coral-50);color:var(--coral);font-size:12px;font-weight:600':'display:none'};};

    const studentNav=[navItem('لوحتي','student'),navItem('دوراتي','student-courses'),navItem('الواجبات','student-assignments','2'),navItem('الشهادات','student-certificates'),navItem('مشترياتي','student-purchases'),navItem('الإشعارات','student-notifications','3'),navItem('الدعم','student-support'),navItem('الإعدادات','student-settings')];
    const teacherNav=[navItem('اللوحة','teacher-home'),navItem('دوراتي','teacher-courses'),navItem('الطلاب','teacher-students'),navItem('الواجبات','teacher-assignments','5'),navItem('الأسئلة','teacher-questions','3'),navItem('التحليلات','teacher-analytics'),navItem('الأرباح','teacher-earnings'),navItem('التحويلات','teacher-payouts'),navItem('الكوبونات','teacher-coupons'),navItem('الاشتراك','teacher-subscription'),navItem('ملفي العام','teacher-profile'),navItem('الإعدادات','teacher-settings')];
    const adminNav=[navItem('اللوحة','admin'),navItem('المستخدمون','admin-users'),navItem('المدرسون','admin-teachers','2'),navItem('مراجعة الدورات','admin-courses','2'),navItem('الباقات','admin-plans'),navItem('الاشتراكات','admin-subscriptions'),navItem('المدفوعات والاسترداد','admin-payments','1'),navItem('التحويلات','admin-payouts'),navItem('التقارير','admin-reports'),navItem('الدعم','admin-support','4'),navItem('سجل التدقيق','admin-audit'),navItem('الإعدادات','admin-settings')];
    const appNav = space==='teacher'?teacherNav:space==='admin'?adminNav:studentNav;

    const roles=[['guest','زائر','home'],['student','طالب','student'],['teacher','مدرس','teacher-home'],['admin','إدارة','admin']];
    const roleSwitch=roles.map(r=>({label:r[1],pick:()=>{self.setState({role:r[0]});self.go(r[2]);},
      style:'height:26px;padding:0 12px;border:0;border-radius:999px;font-size:12px;font-weight:600;cursor:pointer;background:'+(s.role===r[0]?'#fff':'transparent')+';color:'+(s.role===r[0]?'var(--ink)':'#94A3B8')}));

    const crumbSpec={
      course:[['المواد','courses'],[R==='course'?self.courseBySlug(s.p.slug).title:'','']],
      teacher:[['المدرسين','teachers'],[R==='teacher'?(self.teachers.find(t=>t.slug===s.p.slug)||self.teachers[0]).name:'','']],
      center:[['السناتر','centers'],[R==='center'?(self.centers.find(x=>x.slug===s.p.slug)||self.centers[0]||{name:''}).name:'','']],
      checkout:[['المواد','courses'],['السلة والدفع','']],
      'teacher-editor':[['دوراتي','teacher-courses'],['محرر الدورة','']],
      'admin-courses':[['الإدارة','admin'],['مراجعة الدورات','']]
    }[R]||[];
    const crumbs=crumbSpec.map((c,i)=>({label:c[0],go:()=>c[1]&&self.go(c[1]),
      style:'background:none;border:0;padding:0;cursor:'+(c[1]?'pointer':'default')+';color:'+(c[1]?'var(--primary)':'var(--muted)')+';font:inherit;font-size:13px',
      sep:i===crumbSpec.length-1?'display:none':'color:var(--border-2)'}));

    const faqs=self.faqData.map((f,i)=>({q:f.q,a:f.a,open:s.faq===i,expanded:s.faq===i?'true':'false',toggle:()=>self.setState({faq:s.faq===i?null:i}),
      icon:'width:26px;height:26px;border-radius:8px;background:var(--bg);color:var(--primary);display:grid;place-items:center;font-size:16px;transform:rotate('+(s.faq===i?'45deg':'0deg')+');transition:transform var(--dur)'}));

    return Object.assign(this.v2(s,R,self),{
      brand:self.props.platformName||'مدارك',
      isMobile:isMobile, isPhone:isPhone, notLearn:R!=='learn', isLearn:R==='learn',
      isPublic:isPublic, isAppUser:!isPublic, showSidebar:!isPublic&&!isMobile, isTeacherSpace:space==='teacher',
      showHeaderSearch:isPublic&&!isMobile,
      showPublicNav:isPublic&&!isMobile, showPublicCtas:isPublic&&!isMobile, showPublicBurger:isPublic&&isMobile,
      mobileMenuOpen:isPublic&&isMobile&&!!s.menuOpen, menuExpanded:s.menuOpen?'true':'false',
      toggleMenu:()=>self.setState({menuOpen:!s.menuOpen}),
      burger1:'display:block;width:18px;height:2px;background:var(--ink);border-radius:2px;transition:transform var(--dur);transform:'+(s.menuOpen?'translateY(6px) rotate(45deg)':'none'),
      burger2:'display:block;width:18px;height:2px;background:var(--ink);border-radius:2px;transition:opacity var(--dur);opacity:'+(s.menuOpen?'0':'1'),
      burger3:'display:block;width:18px;height:2px;background:var(--ink);border-radius:2px;transition:transform var(--dur);transform:'+(s.menuOpen?'translateY(-6px) rotate(-45deg)':'none'),
      heroStats:[{v:self.stat('learners','58,000+'),k:'طالب بيذاكر معانا'},{v:String(self.centers.length),k:'سناتر من 6 محافظات'},{v:String(self.courses.filter(c=>c.status==='published').length),k:'مادة بكالوريا وثانوي'}],
      heroCourse:(function(){const hc=self.courses.find(c=>c.promo)||self.courses[0]; const ht=self.teacher(hc.t); return {title:'برومو: '+hc.title, meta:ht.name+' · '+self.money(hc.price), open:()=>self.go('course',{slug:hc.slug})};})(),
      spaceLabel:space==='teacher'?'مساحة المدرس':space==='admin'?'لوحة الإدارة':'مساحة الطالب',
      userName:space==='teacher'?self.teacher(self.meT).name:space==='admin'?'سلمى — إدارة المحتوى':self.sname(self.me),
      userInitial:space==='teacher'?self.teacher(self.meT).name.replace(/^(مستر|أ\.|م\.|د\.)\s*/,'')[0]:space==='admin'?'س':self.sname(self.me)[0],
      userAvatarStyle:self.avatar(space==='teacher'?0:space==='admin'?2:3,30),
      roleSwitch:roleSwitch, publicNav:[mk('المواد','courses'),mk('السناتر','centers'),mk('المدرسين','teachers'),mk('الاشتراك والأسعار','pricing'),mk('للسناتر','for-centers')],
      cartCount:s.cart.length, hasCartItems:s.cart.length>0, goCart:()=>self.go('checkout'),
      appNav:appNav, crumbs:crumbs, q:s.q, setQ:e=>self.setState({q:e.target.value}),
      searchKey:e=>{if(e.key==='Enter')self.go('courses');},
      toggleDrawer:()=>self.setState({drawer:!s.drawer}), openNotif:()=>self.go(space==='student'?'student-notifications':'admin-support'),
      goHome:()=>self.go('home'), goCourses:()=>self.go('courses'), goTeach:()=>self.go('for-centers'), goPricing:()=>self.go('pricing'),
      goLogin:()=>self.go('login'), goSubscription:()=>self.go('teacher-subscription'),
      isHome:R==='home',
      gradeCards:self.GRADES.map((g,i)=>{ const n=self.courses.filter(c=>c.grade===g.id&&c.status==='published').length; return {name:g.name,sub:g.sub,count:n+(n>2&&n<11?' مواد':' مادة'),go:()=>{self.setState({gradeF:g.id,trackF:'',centerF:''});self.go('courses');},
        style:'text-align:start;display:flex;flex-direction:column;gap:6px;padding:18px;background:#fff;border:1px solid var(--border);border-radius:18px;cursor:pointer;transition:transform var(--dur),box-shadow var(--dur)',
        num:'width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-weight:700;font-size:18px;background:'+['var(--amber-50)','var(--primary-50)','var(--teal-50)'][i]+';color:'+['var(--amber)','var(--primary)','var(--teal)'][i], numText:String(g.id)}; }),
      homeCentersList:self.centers.slice(0,3).map(x=>({name:x.name,city:x.city,rating:x.rating.toFixed(1),n:self.courses.filter(c=>c.center===x.id&&c.status==='published').length+' مواد',initial:x.name.replace(/^(سنتر|أكاديمية)\s*/,'').replace(/^ال/,'')[0],logo:'width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-weight:700;font-size:20px;flex:0 0 auto;background:'+x.bg+';color:'+x.c,open:()=>self.go('center',{slug:x.slug})})),
      catCards:self.cats.map(c=>({name:c.name,count:c.n+(c.n>2&&c.n<11?' مواد':' مادة'),go:()=>{self.setState({trackF:c.id,gradeF:0,centerF:''});self.go('courses');},
        style:'text-align:start;display:flex;flex-direction:column;gap:6px;padding:16px;background:#fff;border:1px solid var(--border);border-radius:16px;cursor:pointer;transition:transform var(--dur),box-shadow var(--dur)',
        chip:'width:28px;height:28px;border-radius:9px;background:'+c.bg+';border:1px solid '+c.c+'33'})),
      featured:self.courses.filter(c=>c.featured&&c.status==='published').slice(0,4).map(c=>self.card(c)),
      topTeachers:self.teachers.slice().sort((a,b)=>b.students-a.students).slice(0,4).map((t,i)=>({name:t.name,title:t.title,rating:t.rating.toFixed(1),initial:self.ini(t.name),
        studentsText:t.students.toLocaleString('en-US')+' طالب',avatar:self.avatar(i,52),open:()=>self.go('teacher',{slug:t.slug})})),
      testimonials:self.testimonialData.slice(0,3).map((t,i)=>({text:t.text,name:t.name,role:t.role,initial:self.ini(t.name),avatar:self.avatar(i+2,36)})),
      faqs:faqs,
      footerCols:[
        {title:'للطلاب',links:[{label:'المواد',go:()=>self.go('courses')},{label:'السناتر',go:()=>self.go('centers')},{label:'مدارك بلس',go:()=>self.go('pricing')},{label:'مركز المساعدة',go:()=>self.go('help')}]},
        {title:'للسناتر والمدرسين',links:[{label:'سجّل سنترك',go:()=>self.go('for-centers')},{label:'باقات السناتر',go:()=>self.go('for-centers')},{label:'لوحة المدرس',go:()=>{self.setState({role:'teacher'});self.go('teacher-home');}},{label:'لوحة الإدارة',go:()=>{self.setState({role:'admin'});self.go('admin');}}]},
        {title:'عن مدارك',links:[{label:'من نحن',go:()=>self.go('about')},{label:'سياسة الاسترجاع',go:()=>self.go('legal')},{label:'الشروط والأحكام',go:()=>self.go('legal')},{label:'الخصوصية',go:()=>self.go('legal')}]}
      ],
      toasts:s.toasts.map(t=>({id:t.id,msg:t.msg,
        style:'display:flex;align-items:center;gap:10px;min-width:260px;max-width:min(92vw,420px);padding:12px 16px;border-radius:14px;background:var(--ink);color:#fff;font-size:14px;box-shadow:var(--sh-3);animation:slideIn var(--dur-2) ease both',
        dot:'width:9px;height:9px;border-radius:999px;flex:0 0 auto;background:'+(t.kind==='danger'?'#F87171':t.kind==='warn'?'#FBBF24':'#5EEAD4')}))
    });
  }

  v2(s,R,self){
    let o={};
    ['pubVals','authVals','studentVals','teacherVals','adminVals','dsVals','shellVals','extraVals'].forEach(k=>{ if(typeof this[k]==='function') o=Object.assign(o,this[k](s,R,self)); });
    return o;
  }

  teacherVals(s,R,self){
    const T=self.teacher(self.meT);
    const mine=self.courses.filter(c=>c.t===self.meT);
    const mineIds=mine.map(c=>c.id);
    const tPays=self.payments.filter(p=>mineIds.indexOf(p.course)>-1);
    const gross=+self.stat(self.meT+'_gross','0'), rate=+self.stat(self.meT+'_rate','10'), commission=Math.round(gross*rate/100), net=gross-commission;
    const settling=+self.stat(self.meT+'_settling','0'), transferred=self.payouts.filter(p=>p.t===self.meT&&p.status==='محوّل').reduce((a,p)=>a+p.amount,0);
    const inTransfer=self.payouts.filter(p=>p.t===self.meT&&p.status!=='محوّل').reduce((a,p)=>a+p.amount,0);
    const available=Math.max(0,net-settling-transferred-inTransfer);
    const sub=self.db.subscriptions.find(x=>x.center_id===T.center)||{}; const plan=self.plans.find(p=>p.id===sub.plan_id)||self.plans[1]||{name:'',m:0,limits:[]}; const TC=self.centerOf(T.center);
    const pendingSubs=self.db.submissions.filter(x=>mineIds.indexOf(x.course_id)>-1&&x.status.indexOf('بانتظار')>-1).length;
    const openQs=self.db.questions.filter(x=>mineIds.indexOf(x.course_id)>-1&&!x.answer).length;
    const inReview=mine.filter(c=>c.status==='review');
    const firstCourse=mine.find(c=>c.status==='published')||mine[0]||self.courses[0];
    const eSteps=['المعلومات الأساسية','النتائج والمتطلبات','الأقسام والدروس','الفيديو والملفات','الاختبارات والواجبات','السعر ومدة الوصول','المعاينة والإرسال'];
    const myEnr=self.db.enrollments.filter(e=>mineIds.indexOf(e.course_id)>-1);
    return {
      isTeacherHome:R==='teacher-home', isTeacherCourses:R==='teacher-courses', isEditor:R==='teacher-editor',
      isTeacherStudents:R==='teacher-students', isEarnings:R==='teacher-earnings', isPayouts:R==='teacher-payouts', isSubscription:R==='teacher-subscription',
      tc:{
        stats:[{k:'مبيعات الشهر ده',v:self.money(+self.stat(self.meT+'_month_sales','0')),c:'var(--primary)'},{k:'صافي المستحقات',v:self.money(Math.round(+self.stat(self.meT+'_month_sales','0')*(100-rate)/100)),c:'var(--teal)'},{k:'طلاب جداد الشهر ده',v:self.stat(self.meT+'_new_students','0'),c:'var(--sky)'},{k:'متوسط التقييم',v:T.rating.toFixed(1),c:'var(--amber)'}],
        tasks:[{t:pendingSubs+' واجبات/امتحانات مستنية التصحيح',k:'warn',go:()=>self.go('teacher-assignments')},
               {t:openQs+' أسئلة طلاب من غير رد',k:'warn',go:()=>self.go('teacher-questions')}]
               .concat(inReview.map(c=>({t:'كورس «'+c.title+'» قيد المراجعة',k:'info',go:()=>self.go('teacher-courses')}))).map(x=>({t:x.t,go:x.go,
                 dot:'width:8px;height:8px;border-radius:999px;flex:0 0 auto;background:'+(x.k==='warn'?'var(--amber)':'var(--primary)')})),
        recent:tPays.filter(p=>p.status==='مدفوع').slice(0,4).map((x,i)=>({n:x.student,c:self.course(x.course).title,a:self.money(x.amount),w:self.ago(x.ts),initial:x.student[0],avatar:self.avatar(i,36)})),
        newCourse:()=>{self.setState({editorStep:1});self.go('teacher-editor');},
        courses:mine.map(c=>{const m=self.statusMeta(c.status);return{
          title:c.title, statusText:m.t, badge:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+m.bg+';color:'+m.c,
          metaText:c.students.toLocaleString('en-US')+' طالب · '+self.money(c.price)+' · '+c.lessons+' درس',
          needsFix:c.status==='changes', inReview:c.status==='review', isDraft:c.status==='draft',
          fixNote:'المراجعة طلبت توضيح النتائج المتوقعة في وصف الكورس وتحسين صوت الدروس 3–5.',
          edit:()=>{self.setState({editorStep:1});self.go('teacher-editor');},
          preview:()=>self.go('course',{slug:c.slug})};}),
        students:myEnr.slice(0,8).map((x,i)=>({n:self.sname(x.student_id),c:self.course(x.course_id).title,l:self.ago(x.last_activity),pText:x.progress+'%',initial:self.sname(x.student_id)[0],avatar:self.avatar(i,36),
          bar:'display:block;height:100%;width:'+x.progress+'%;background:var(--teal);border-radius:999px'})),
        fin:[{k:'إجمالي المبيعات',v:self.money(gross),n:'من أول ما انضميت'},{k:'عمولة المنصة ('+rate+'%)',v:'- '+self.money(commission),n:'حسب باقة '+plan.name},{k:'صافي المستحقات',v:self.money(net),n:'بعد العمولة'},{k:'قيد التسوية',v:self.money(settling),n:'بيتاح بعد 14 يوم من البيع'},{k:'المتاح للسحب',v:self.money(available),n:'تقدر تطلب تحويله دلوقتي'},{k:'اللي اتحوّل',v:self.money(transferred),n:'على حسابك البنكي'}],
        payouts:self.payouts.filter(p=>p.t===self.meT).map(p=>({id:p.id,amountText:self.money(p.amount),date:self.fmtDate(p.date),method:p.method,statusText:p.status,
          badge:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+(p.status==='محوّل'?'var(--teal-50)':'var(--amber-50)')+';color:'+(p.status==='محوّل'?'var(--teal)':'var(--amber)')})),
        requestPayout:()=>self.toast('طلب التحويل محتاج ربط بوابة الدفع — مش متاح في النسخة التجريبية','warn'),
        sub:{plan:plan.name+' — '+TC.name,priceText:self.money(plan.m)+' شهريًا',renew:(sub.status==='نشط'?'بيتجدد في ':'انتهى في ')+self.fmtDate(sub.period_end),
          usage:[{k:'مدرسين السنتر',v:self.teachers.filter(t=>t.center===T.center).length+' من 10',p:self.teachers.filter(t=>t.center===T.center).length*10},{k:'مواد السنتر',v:String(self.courses.filter(c=>c.center===T.center).length),p:40},{k:'ساعات الفيديو',v:self.courses.filter(c=>c.center===T.center).reduce((a,c)=>a+c.hours,0)+' من 500',p:Math.min(100,Math.round(self.courses.filter(c=>c.center===T.center).reduce((a,c)=>a+c.hours,0)/5))}].map(u=>({k:u.k,v:u.v,bar:'display:block;height:100%;width:'+u.p+'%;background:var(--primary);border-radius:999px'})),
          upgrade:()=>self.go('pricing'), cancel:()=>self.toast('الإلغاء بيوقف البيع الجديد بعد آخر المدة، واللي اشترى قبل كده وصوله مستمر','warn')}
      },
      ed:{
        steps:eSteps.map((l,i)=>({label:l,style:'display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:10px;border:1px solid '+(s.editorStep===i+1?'var(--primary)':'var(--border)')+';background:'+(s.editorStep===i+1?'var(--primary-50)':'#fff')+';font-size:13px;font-weight:600;color:'+(s.editorStep===i+1?'var(--primary-700)':'var(--ink-2)')+';cursor:pointer;text-align:start',
          num:'width:20px;height:20px;border-radius:999px;display:grid;place-items:center;font-size:11px;flex:0 0 auto;background:'+(s.editorStep===i+1?'var(--primary)':'var(--bg)')+';color:'+(s.editorStep===i+1?'#fff':'var(--muted)'),
          numText:String(i+1), pick:()=>self.setState({editorStep:i+1})})),
        stepTitle:eSteps[s.editorStep-1], step:s.editorStep,
        is1:s.editorStep===1,is3:s.editorStep===3,is4:s.editorStep===4,is6:s.editorStep===6,is7:s.editorStep===7,
        isOther:[2,5].indexOf(s.editorStep)>-1,
        savedText:s.editorSaved,
        back:()=>self.setState({editorStep:Math.max(1,s.editorStep-1)}), next:()=>self.setState({editorStep:Math.min(7,s.editorStep+1)}),
        notFirst:s.editorStep>1, notLast:s.editorStep<7,
        sections:self.curOf(firstCourse.id).map((sec,i)=>({title:sec.title,count:sec.lessons.length+' دروس',
          lessons:sec.lessons.map(l=>({title:l.title,minText:l.min+' د'})),
          up:()=>self.toast('اتحرك القسم لفوق'), down:()=>self.toast('اتحرك القسم لتحت')})),
        addSection:()=>self.toast('اتضاف قسم جديد — اكتب عنوانه'),
        uploading:s.uploading, failed:s.uploadFailed, pctText:s.uploadPct+'%', done:s.uploadPct===100&&!s.uploading,
        bar:'display:block;height:100%;width:'+s.uploadPct+'%;background:'+(s.uploadFailed?'var(--danger)':'var(--primary)')+';border-radius:999px',
        upload:self.simulateUpload, retry:self.simulateUpload,
        missing:[{t:'ضيف نتائج التعلم (4 على الأقل)',ok:false},{t:'ارفع فيديو الدرس الأول',ok:false},{t:'حدد السعر ومدة الوصول',ok:true},{t:'اكتب وصف الكورس',ok:true}].map(m=>({t:m.t,
          mark:'width:20px;height:20px;border-radius:999px;display:grid;place-items:center;font-size:11px;flex:0 0 auto;background:'+(m.ok?'var(--teal-50)':'var(--amber-50)')+';color:'+(m.ok?'var(--teal)':'var(--amber)'),
          markText:m.ok?'✓':'!'})),
        submit:()=>{self.toast('الكورس اتبعت للمراجعة — بيتراجع خلال يومين عمل');self.go('teacher-courses');},
        preview:()=>self.go('course',{slug:firstCourse.slug})
      }
    };
  }

  adminVals(s,R,self){
    const q=self.courses.filter(c=>c.status==='review'&&(s.reviewed||[]).indexOf(c.id)<0);
    const rev=s.adminReview?self.course(s.adminReview):null;
    const payCol=(st)=>st==='مدفوع'?['var(--teal-50)','var(--teal)']:st==='معلق'?['var(--amber-50)','var(--amber)']:st==='فاشل'?['var(--danger-50)','var(--danger)']:['#F1F5F9','var(--muted)'];
    const pendRefunds=self.db.refunds.filter(r=>r.status==='بانتظار القرار');
    const users=self.db.students.slice(0,5).map(u=>({n:u.name,r:u.grade==='تالتة ثانوي'?'طالب ثانوي':u.grade==='موظف'?'طالب — موظف':'طالب جامعي',e:u.email,s:u.status}))
      .concat(self.teachers.slice(0,2).map(t=>({n:t.name,r:'مدرس',e:t.slug+'@example.com',s:'نشط'})))
      .concat(self.db.students.filter(u=>u.status!=='نشط').slice(0,2).map(u=>({n:u.name,r:'طالب',e:u.email,s:u.status})));
    return {
      isAdminHome:R==='admin', isAdminUsers:R==='admin-users', isAdminCourses:R==='admin-courses',
      isAdminPayments:R==='admin-payments', isAdminAudit:R==='admin-audit',
      ad:{
        stats:[{k:'مستخدمين',v:self.stat('users','0')},{k:'سناتر نشطة',v:String(self.centers.length)},{k:'مواد منشورة',v:String(self.courses.filter(c=>c.status==='published').length)},{k:'مشتركين مدارك بلس',v:String(self.db.studentSubs.filter(x=>x.status==='نشط').length)},{k:'إيراد الشهر',v:self.money(+self.stat('month_revenue','0').replace(/,/g,''))}],
        queues:[{t:q.length+' كورسات مستنية المراجعة',go:()=>self.go('admin-courses')},{t:pendRefunds.length+' طلب استرجاع مستني قرار',go:()=>self.go('admin-payments')},{t:'طلبات سناتر جديدة من صفحة «للسناتر»',go:()=>self.go('admin-teachers')}],
        reviewRows:q.map(c=>({title:c.title,teacherName:self.teacher(c.t).name,catName:self.cat(c.cat).name,
          metaText:c.lessons+' درس · '+c.hours+' ساعة · '+self.money(c.price),
          open:()=>self.setState({adminReview:c.id,adminReason:''})})),
        noQueue:q.length===0,
        drawerOpen:!!rev, drawerTitle:rev?rev.title:'', drawerTeacher:rev?self.teacher(rev.t).name:'',
        drawerMeta:rev?(rev.lessons+' درس · '+rev.hours+' ساعة · '+self.money(rev.price)+' · وصول '+rev.access+' شهور'):'',
        drawerSum:rev?rev.sum:'',
        closeDrawer:()=>self.setState({adminReview:null,adminReason:''}),
        reason:s.adminReason, setReason:e=>self.setState({adminReason:e.target.value}),
        approve:()=>self.adminAct('approve'), requestChanges:()=>self.adminAct('changes'),
        users:users.map((u,i)=>({n:u.n,r:u.r,e:u.e,sText:u.s,initial:self.ini(u.n),avatar:self.avatar(i,36),
          badge:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+(u.s==='نشط'?'var(--teal-50)':'var(--amber-50)')+';color:'+(u.s==='نشط'?'var(--teal)':'var(--amber)'),
          view:()=>self.toast('ملف المستخدم التفصيلي مش متاح في النسخة التجريبية','warn')})),
        payTabs:[['payments','المدفوعات'],['refunds','طلبات الاسترجاع']].map(t=>({label:t[1],style:self.tabBtn(s.payTab===t[0]),pick:()=>self.setState({payTab:t[0]})})),
        tabPayments:s.payTab==='payments', tabRefunds:s.payTab==='refunds',
        payments:self.payments.slice(0,10).map(p=>{const col=payCol(p.status),c=self.course(p.course);
          return{id:p.id,title:c.title,student:p.student,amountText:self.money(p.amount),method:p.method,date:p.date,statusText:p.status,
            badge:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+col[0]+';color:'+col[1]};}),
        refunds:pendRefunds.map(r=>{const p=self.payments.find(x=>x.id===r.payment_id)||{};return{id:r.id,title:self.course(p.course).title,student:p.student||'',amountText:self.money(p.amount||0),why:r.reason,progress:r.progress_note,
          approve:()=>{self.toast('تمت الموافقة — اتلغى الوصول واتسجل قيد مالي عكسي');},
          reject:()=>{self.toast('اترفض الطلب واتبعت السبب للطالب','warn');}};}),
        audit:[...s.audit,...self.db.audit.map(a=>({id:a.id,who:a.actor,what:a.action,why:a.reason,when:self.ago(a.created_at)}))],
        roles:[{r:'الإدارة العامة',p:'كل الصلاحيات، ومنها الباقات والإعدادات'},{r:'مراجعة المحتوى',p:'مراجعة ونشر الكورسات وملفات المدرسين'},{r:'الدعم',p:'التذاكر وبيانات المستخدم من غير الماليات'},{r:'المالية',p:'المدفوعات والاسترجاع والتحويلات من غير تعديل المحتوى'}]
      }
    };
  }

  dsVals(s,R,self){
    const swatch=(n,v,txt)=>({name:n,value:v,box:'height:56px;border-radius:12px;border:1px solid var(--border);background:'+v,label:v,fg:txt||''});
    return {
      isDS:R==='ds',
      ds:{
        colors:[swatch('primary','#4F46E5'),swatch('primary-50','#EEF2FF'),swatch('success / teal','#0F766E'),swatch('warning / amber','#B45309'),swatch('danger','#B91C1C'),swatch('accent coral','#DC5B48'),swatch('accent sky','#0369A1'),swatch('surface','#FFFFFF'),swatch('background','#F8FAFC'),swatch('border','#E2E8F0'),swatch('ink','#0F172A'),swatch('muted','#64748B')],
        type:[{n:'Display / 34px',st:'font-size:34px;font-weight:700;line-height:1.3'},{n:'H1 / 26px',st:'font-size:26px;font-weight:700'},{n:'H2 / 20px',st:'font-size:20px;font-weight:600'},{n:'Body / 16px',st:'font-size:16px'},{n:'Small / 14px',st:'font-size:14px;color:var(--muted)'},{n:'Mono / 13px',st:"font-family:'IBM Plex Mono',monospace;font-size:13px;color:var(--muted)"}],
        buttons:[{l:'Primary',st:self.btn('primary')},{l:'Secondary',st:self.btn('secondary')},{l:'Outline',st:self.btn('outline')},{l:'Ghost',st:self.btn('ghost')},{l:'Destructive',st:self.btn('destructive')},{l:'Disabled',st:self.btn('primary','opacity:.45;cursor:not-allowed')}],
        badges:[{l:'منشورة',st:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:var(--teal-50);color:var(--teal)'},{l:'قيد المراجعة',st:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:var(--amber-50);color:var(--amber)'},{l:'تحتاج تعديلًا',st:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:var(--danger-50);color:var(--danger)'},{l:'مسودة',st:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:#F1F5F9;color:var(--muted)'}],
        toastDemo:()=>self.toast('هذه رسالة Toast من نظام التصميم'),
        modalDemo:()=>self.setState({modal:'graded'})
      }
    };
  }

  extraVals(s,R,self){
    const bar=(p,c)=>'display:block;height:100%;width:'+p+'%;background:'+c+';border-radius:999px';
    const colBar=(p,c)=>'width:100%;height:'+p+'%;background:'+c+';border-radius:6px 6px 0 0;display:block';
    const mineIds=self.courses.filter(c=>c.t===self.meT).map(c=>c.id);
    const subsRows=self.db.submissions.filter(x=>mineIds.indexOf(x.course_id)>-1);
    const qRows=self.db.questions.filter(x=>mineIds.indexOf(x.course_id)>-1&&!x.answer);
    const months=self.statJ('monthly_enrollments',[]), revs=self.statJ('monthly_revenue',[]);
    const maxE=Math.max(1,...months.map(m=>m.v)), maxR=Math.max(1,...revs.map(m=>m.v));
    const tStats=self.db.courses.filter(c=>c.teacher_id===self.meT&&c.status==='published');
    return {
      isTAssign:R==='teacher-assignments', isTQuestions:R==='teacher-questions', isTAnalytics:R==='teacher-analytics',
      isTCoupons:R==='teacher-coupons', isTProfile:R==='teacher-profile', isTSettings:R==='teacher-settings',
      isATeachers:R==='admin-teachers', isAPlans:R==='admin-plans', isASubs:R==='admin-subscriptions',
      isAPayouts:R==='admin-payouts', isAReports:R==='admin-reports', isASupport:R==='admin-support', isASettings:R==='admin-settings',
      ex:{
        submissions:subsRows.map((x,i)=>({n:self.sname(x.student_id),a:x.title,w:self.ago(x.submitted_at),stText:x.status+(x.grade?' '+x.grade:''),initial:self.sname(x.student_id)[0],avatar:self.avatar(i,36),
          pending:x.status.indexOf('بانتظار')>-1,
          badge:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+(x.status.indexOf('بانتظار')>-1?'var(--amber-50)':'var(--teal-50)')+';color:'+(x.status.indexOf('بانتظار')>-1?'var(--amber)':'var(--teal)'),
          grade:()=>self.toast('الدرجة اتحفظت والطالب اتبعتله إشعار')})),
        questions:qRows.map((x,i)=>({n:self.sname(x.student_id),c:self.course(x.course_id).title,q:x.question,w:self.ago(x.asked_at),initial:self.sname(x.student_id)[0],avatar:self.avatar(i+1,36),
          reply:()=>self.toast('ردك اتبعت للطالب وظهر في صفحة الدرس')})),
        kpis:[{k:'التسجيلات الشهر ده',v:self.stat(self.meT+'_new_students','0')},{k:'معدل الإكمال',v:self.stat(self.meT+'_completion','0%')},{k:'متوسط دقايق المشاهدة',v:self.stat(self.meT+'_watch_min','0')},{k:'معدل الاسترجاع',v:self.stat(self.meT+'_refund_rate','0%')}],
        months:months.map(x=>({m:x.m,col:colBar(Math.round(x.v/maxE*95),'var(--primary)'),v:x.v+' تسجيل'})),
        topCourses:tStats.map(c=>({t:c.title,bar:bar(Math.min(100,Math.round(c.students_count/Math.max(1,...tStats.map(z=>z.students_count))*100)),'var(--teal)'),pText:c.students_count.toLocaleString('en-US')+' طالب'})),
        coupons:self.db.coupons.filter(x=>x.teacher_id===self.meT).map(x=>({c:x.code,d:x.description,u:'اتستخدم '+x.used+' من '+x.max_uses,e:x.active?'بينتهي '+self.fmtDate(x.expires_at):'منتهي',
          badge:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+(x.active?'var(--teal-50)':'#F1F5F9')+';color:'+(x.active?'var(--teal)':'var(--muted)'),
          stText:x.active?'شغّال':'منتهي', toggle:()=>self.toast(x.active?'اتوقف الكوبون '+x.code:'الكوبون منتهي — اعمل كوبون جديد','warn')})),
        createCoupon:()=>self.toast('أُنشئ الكوبون — يظهر للطلاب عند الشراء'),
        saveProfile:()=>self.toast('حُفظ ملفك العام — التغييرات ظاهرة للطلاب'),
        viewProfile:()=>self.go('teacher',{slug:self.teacher(self.meT).slug}),
        saveSettings:()=>self.toast('حُفظت الإعدادات'),
        pendingTeachers:self.db.applications.filter(a=>a.status==='قيد المراجعة').map((x,i)=>({n:x.name,t:x.title,y:x.experience||'',w:'اتقدم '+self.ago(x.submitted_at),initial:self.ini(x.name),avatar:self.avatar(i+3,44),
          approve:()=>self.toast('المدرس اتوثق وأدوات الإنشاء اتفعلت'),
          reject:()=>self.toast('اتطلبت مستندات إضافية والسبب اتسجل في سجل التدقيق','warn')})),
        plans:self.plans.map(p=>({name:p.name,priceText:self.money(p.m)+' شهريًا',limits:p.limits.join(' · '),
          subs:self.db.subscriptions.filter(x=>x.plan_id===p.id&&x.status==='نشط').length+' سناتر مشتركة',
          edit:()=>self.toast('تعديل الباقات يؤثر على المشتركين الحاليين — يحتاج تأكيدًا في الإنتاج','warn')})),
        subs:self.db.subscriptions.map((x,i)=>({n:x.center_id?self.centerOf(x.center_id).name:self.teacher(x.teacher_id).name,p:(self.plans.find(p=>p.id===x.plan_id)||{}).name,d:(x.status==='نشط'?'بيتجدد ':'انتهى ')+self.fmtDate(x.period_end),stText:x.status,initial:(x.center_id?self.centerOf(x.center_id).name.replace(/^(سنتر|أكاديمية)\s*/,'').replace(/^ال/,''):self.ini(self.teacher(x.teacher_id).name))[0],avatar:self.avatar(i,36),
          badge:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+(x.status==='نشط'?'var(--teal-50)':'var(--danger-50)')+';color:'+(x.status==='نشط'?'var(--teal)':'var(--danger)'),
          expired:x.status!=='نشط'})),
        payoutReqs:self.payouts.filter(p=>p.status!=='محوّل').map(x=>({id:x.id,n:self.teacher(x.t).name,d:'طلب في '+self.fmtDate(x.date),acc:x.method,amountText:self.money(x.amount),
          approve:()=>self.toast('التحويل اتعتمد واتسجل في القيود وسجل التدقيق'),
          hold:()=>self.toast('الطلب اتوقف مؤقتًا مع ذكر السبب','warn')})),
        reportKpis:[{k:'إيراد الشهر',v:self.money(+self.stat('month_revenue','0').replace(/,/g,''))},{k:'عمولة المنصة',v:self.money(+self.stat('month_commission','0'))},{k:'مستحقات المدرسين',v:self.money(+self.stat('month_revenue','0').replace(/,/g,'')-(+self.stat('month_commission','0')))},{k:'طلبات استرجاع',v:String(self.db.refunds.length)}],
        reportBars:revs.map(x=>({m:x.m,col:colBar(Math.round(x.v/maxR*95),'var(--teal)')})),
        exportReport:()=>self.toast('تصدير التقارير يحتاج خدمة توليد الملفات على الخادم','warn'),
        tickets:self.db.tickets.map(x=>({id:x.id,s:x.subject,n:self.sname(x.student_id),w:self.ago(x.created_at),pText:x.priority,
          badge:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+(x.priority==='عالية'?'var(--danger-50)':x.priority==='متوسطة'?'var(--amber-50)':'#F1F5F9')+';color:'+(x.priority==='عالية'?'var(--danger)':x.priority==='متوسطة'?'var(--amber)':'var(--muted)'),
          assign:()=>self.toast('التذكرة اتسندت ليك واتحولت لـ«قيد المعالجة»')})),
        savePlatform:()=>self.toast('حُفظت إعدادات المنصة وسُجّل التغيير في سجل التدقيق')
      }
    };
  }

  shellVals(s,R,self){
    const isMobile=s.w<900;
    const space = R.indexOf('teacher-')===0?'teacher':R.indexOf('admin')===0?'admin':(R.indexOf('student')===0||R==='learn')?'student':'public';
    const bn=[['student','لوحتي'],['student-courses','دوراتي'],['student-assignments','واجباتي'],['student-purchases','مشترياتي']];
    return {
      drawerOpen:isMobile&&s.drawer&&space!=='public'&&R!=='learn',
      closeDrawer:()=>self.setState({drawer:false}),
      showBottomNav:isMobile&&space==='student'&&R!=='learn',
      bottomNav:bn.map(b=>({label:b[1],go:()=>self.go(b[0]),
        style:'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:56px;justify-content:center;border:0;background:none;cursor:pointer;font-size:12px;font-weight:600;color:'+(R===b[0]?'var(--primary-700)':'var(--muted)'),
        dot:'width:6px;height:6px;border-radius:999px;background:'+(R===b[0]?'var(--primary)':'transparent')})),
      learnAside:!isMobile, learnSheet:isMobile&&s.drawer, learnMobile:isMobile,
      openConfirm:()=>self.setState({modal:'deactivate'}),
      sendTicket:()=>self.toast('تذكرتك اتبعتت — رقمها #T-2191، هنرد خلال يوم عمل'),
      modalRefund:s.modal==='refund', modalDeactivate:s.modal==='deactivate', modalSubmit:s.modal==='submit', modalGraded:s.modal==='graded',
      anyModal:!!s.modal, closeModal:()=>self.setState({modal:null,refundReason:''}),
      refundReason:s.refundReason, setRefundReason:e=>self.setState({refundReason:e.target.value}),
      submitRefund:()=>{ if(!s.refundReason.trim()){ self.toast('اذكر سبب الاسترداد لإكمال الطلب','danger'); return; }
        self.setState({modal:null,refundReason:''}); self.toast('أُرسل طلب الاسترداد — تُراجعه الإدارة خلال 3 أيام عمل'); },
      confirmDeactivate:()=>{ self.setState({modal:null}); self.toast('في هذه النسخة التجريبية لا يُنفَّذ التعطيل فعليًا','warn'); },
      submitAssignment:()=>{ self.setState({modal:null}); self.toast('سُلّم الواجب — سيصلك التقييم من المدرس'); }
    };
  }

  studentVals(s,R,self){
    const all=self.flatLessons();
    const cur=all.find(l=>l.id===s.lesson)||all[0]||{id:'',title:'',sec:'',min:0};
    const ci=all.indexOf(cur);
    const lc=self.course(s.learnCourse);
    const doneHere=s.done.filter(id=>all.some(l=>l.id===id)).length;
    const pct=all.length?Math.round(doneHere/all.length*100):0;
    const myIds=Array.from(new Set(s.purchased.concat(self.courses.filter(c=>self.partialCourse(c.id)).map(c=>c.id)))); const my=myIds.map(id=>self.card(self.course(id)));
    const myPays=self.payments.filter(p=>p.sid===self.me);
    const tn={subject:'مادة كاملة',chapter:'باب',lesson:'حصة',subscription:'اشتراك',bundle:'باقة مواد'};
    const orders=myPays.map(p=>({id:p.id.replace('PAY','ORD'),cid:p.course,title:(p.itemTitle||'')+' · '+(tn[p.type]||''),date:self.fmtDate(p.ts),amount:p.amount,status:p.status==='مدفوع'?'مكتمل':p.status,method:p.method}));
    const mySubs=self.db.submissions.filter(x=>x.student_id===self.me);
    const pendingQuizzes=self.db.lessons.filter(l=>s.purchased.indexOf(l.course_id)>-1&&l.kind!=='video'&&!mySubs.some(x=>x.title===l.title)).slice(0,3);
    const certCourses=self.myEnroll.filter(e=>e.progress>=100);
    const vid=cur.video||'', isHls=/\.m3u8$/.test(vid);
    const tabs=[['all','الكل'],['active','قيد التعلم'],['done','مكتملة']];
    const myFiltered=my.filter(c=>s.myTab==='all'?true:s.myTab==='done'?c.progress>=100:c.progress<100);
    const stMeta=(t)=>({'مكتمل':{c:'var(--teal)',bg:'var(--teal-50)'},'معلق':{c:'var(--amber)',bg:'var(--amber-50)'},'مسترد':{c:'var(--muted)',bg:'#F1F5F9'},'فاشل':{c:'var(--danger)',bg:'var(--danger-50)'}}[t]||{c:'var(--muted)',bg:'#F1F5F9'});
    return {
      isStudentHome:R==='student', isMyCourses:R==='student-courses', isAssignments:R==='student-assignments',
      isCertificates:R==='student-certificates', isPurchases:R==='student-purchases', isNotifs:R==='student-notifications',
      isStudentSettings:R==='student-settings', isStudentSupport:R==='student-support',
      st:{
        firstName:self.sname(self.me).split(' ')[0], greetLine:'ذاكرت '+self.stat(self.me+'_hours','0')+' ساعة الشهر ده'+(pendingQuizzes.length?' · عندك '+pendingQuizzes.length+' امتحانات/واجبات مستنياك.':'. كمّل كده 💪'),
        resumeThumb:'width:132px;height:80px;border-radius:12px;background-image:url('+self.coverUrl(lc)+');background-size:cover;background-position:center;border:1px solid var(--border);display:grid;place-items:center;flex:0 0 auto',
        resumeTitle:lc.title, resumeLesson:cur.sec+' · '+cur.title, pctText:pct+'%',
        bar:'display:block;height:100%;width:'+pct+'%;background:var(--teal);border-radius:999px',
        cont:()=>self.startLearn(lc.id),
        stats:[{k:'موادي',v:String(myIds.length)},{k:'ساعات مذاكرة الشهر ده',v:self.stat(self.me+'_hours','0')},{k:'واجبات وامتحانات مطلوبة',v:String(pendingQuizzes.length)},{k:'شهادات',v:String(certCourses.length)}],
        courses:my, tabsList:tabs.map(t=>({label:t[1],style:self.tabBtn(s.myTab===t[0]),pick:()=>self.setState({myTab:t[0]})})),
        filtered:myFiltered, noneInTab:myFiltered.length===0,
        recs:self.courses.filter(c=>c.status==='published'&&myIds.indexOf(c.id)<0&&c.grade===2).slice(0,2).map(c=>self.card(c)),
        subText:s.subActive?'مشترك في '+((self.studentPlans.find(p=>p.id===s.subPlan)||{}).name||'مدارك بلس')+' — كل المواد مفتوحة':'مش مشترك — افتح كل المواد بـ'+self.money((self.studentPlans[0]||{price:0}).price)+' في الشهر', subActive:!!s.subActive, notSub:!s.subActive, goSub:()=>self.go('pricing'),
        notifs:self.db.notifications.filter(n=>n.student_id===self.me).map(n=>({t:n.title+(n.body?' — '+n.body:''),w:self.ago(n.created_at),dot:'width:8px;height:8px;border-radius:999px;flex:0 0 auto;margin-top:7px;background:'+(n.kind==='warn'?'var(--amber)':n.kind==='ok'?'var(--teal)':'var(--primary)')})),
        assignments:pendingQuizzes.map(l=>({t:l.title,c:self.course(l.course_id).title,due:l.kind==='quiz'?'بابل شيت · 30 دقيقة':'سلّم قبل آخر الأسبوع',st:'مطلوب',k:'warn'}))
          .concat(mySubs.map(x=>({t:x.title,c:self.course(x.course_id).title,due:'اتسلّم '+self.ago(x.submitted_at),st:x.status+(x.grade?' '+x.grade:''),k:x.grade?'ok':'wait'}))).map(a=>({t:a.t,c:a.c,due:a.due,stText:a.st,
          badge:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+(a.k==='warn'?'var(--amber-50)':a.k==='wait'?'var(--primary-50)':'var(--teal-50)')+';color:'+(a.k==='warn'?'var(--amber)':a.k==='wait'?'var(--primary-700)':'var(--teal)'),
          open:()=>a.k==='warn'?self.setState({modal:'submit'}):a.k==='ok'?self.setState({modal:'graded'}):self.toast('التسليم مستني تصحيح المدرس')})),
        certs:certCourses.map(e=>({t:self.course(e.course_id).title,d:'اتصدرت في '+self.fmtDate(e.last_activity),id:'MDK-'+e.course_id.toUpperCase()+'-'+String(e.id).padStart(4,'0')})).map(c=>Object.assign({},c,{download:()=>self.toast('تحميل الشهادة PDF محتاج خدمة على السيرفر — مش متاحة في النسخة التجريبية','warn')})),
        orders:orders.map(o=>{const c=self.course(o.cid),m=stMeta(o.status);return{
          id:o.id,title:o.title||c.title,date:o.date,amountText:self.money(o.amount),method:o.method,statusText:o.status,
          badge:'padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+m.bg+';color:'+m.c,
          canRefund:o.status==='مكتمل', pending:o.status==='معلق',
          refund:()=>self.setState({modal:'refund'}),
          invoice:()=>self.toast('فاتورة '+o.id+' — التصدير يحتاج خدمة الفواتير على الخادم','warn')};})
      },
      learn:{
        courseTitle:lc.title, lessonTitle:cur.title, sectionTitle:cur.sec,
        pctText:pct+'%', bar:'display:block;height:100%;width:'+pct+'%;background:var(--teal);border-radius:999px',
        exit:()=>{self.setState({role:'student'});self.go('student-courses');},
        video:vid, hasVideo:!!vid, noVideo:!vid, isHls:isHls, isMp4:!!vid&&!isHls, poster:cur.poster||'', videoKey:cur.id,
        lessonKind:cur.kind==='quiz'?'امتحان':cur.kind==='assignment'?'واجب':'فيديو',
        sections:self.curOf(s.learnCourse).map(sec=>({title:sec.title,
          lessons:sec.lessons.map(l=>{const done=s.done.indexOf(l.id)>-1,active=l.id===s.lesson;return{
            title:l.title,minText:(l.video?'▶ ':'')+l.min+' د',
            style:'display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border:0;border-radius:10px;cursor:pointer;text-align:start;font-size:14px;background:'+(active?'var(--primary-50)':'transparent')+';color:'+(active?'var(--primary-700)':'var(--ink-2)')+';font-weight:'+(active?'600':'500'),
            mark:'width:20px;height:20px;border-radius:999px;flex:0 0 auto;display:grid;place-items:center;font-size:11px;background:'+(done?'var(--teal)':active?'var(--primary)':'#F1F5F9')+';color:'+(done||active?'#fff':'var(--muted)'),
            markText:done?'✓':active?'▶':'',
            pick:()=>self.setState({lesson:l.id,drawer:false})};})})),
        prev:()=>{const p=all[ci-1];if(p)self.setState({lesson:p.id});}, next:()=>{const n=all[ci+1];if(n)self.setState({lesson:n.id});},
        hasPrev:ci>0, hasNext:ci<all.length-1,
        complete:self.completeLesson, isDone:s.done.indexOf(s.lesson)>-1,
        completeText:s.done.indexOf(s.lesson)>-1?'✓ أُكمل هذا الدرس':'علّم كمكتمل وانتقل',
        completeStyle:'height:44px;padding:0 20px;border:0;border-radius:12px;font-weight:600;cursor:pointer;background:'+(s.done.indexOf(s.lesson)>-1?'var(--teal-50)':'var(--teal)')+';color:'+(s.done.indexOf(s.lesson)>-1?'var(--teal)':'#fff'),
        tabs:[['files','الملفات'],['notes','ملاحظاتي'],['qa','الأسئلة']].map(t=>({label:t[1],style:self.tabBtn(s.learnTab===t[0]),pick:()=>self.setState({learnTab:t[0]})})),
        tabFiles:s.learnTab==='files', tabNotes:s.learnTab==='notes', tabQa:s.learnTab==='qa',
        files:self.db.files.filter(f=>f.lesson_id===cur.id).map(f=>({n:f.name,s:f.size_label,dl:()=>self.toast('تنزيل الملفات محتاج ربط التخزين المحمي — مش متاح في النسخة التجريبية','warn')})),
        noFiles:!self.db.files.some(f=>f.lesson_id===cur.id),
        noteText:s.noteText, setNote:e=>self.setState({noteText:e.target.value}),
        saveNote:()=>self.toast('حُفظت ملاحظتك مع توقيت الفيديو'),
        qa:self.db.questions.filter(x=>x.lesson_id===cur.id&&x.answer).map((x,i)=>({n:self.sname(x.student_id),q:x.question,a:x.answer,initial:self.sname(x.student_id)[0],avatar:self.avatar(i,34)})),
        ask:()=>self.toast('سؤالك اتبعت للمدرس — بيرد عادةً خلال يوم'),
        panelOpen:s.drawer, togglePanel:()=>self.setState({drawer:!s.drawer})
      }
    };
  }

  authVals(s,R,self){
    const steps=['المعلومات الأساسية','التخصص والخبرة','الملف الشخصي','اختيار الباقة','حالة المراجعة'];
    const T=self.cartTotals(), typeName={subject:'مادة كاملة',chapter:'باب',lesson:'حصة',subscription:'اشتراك',bundle:'باقة'};
    const firstPaid=(s.paidItems||[])[0]||{};
    const methods=['فودافون كاش','إنستاباي','بطاقة بنكية (ميزة / فيزا)','فوري'];
    const res=s.payResult;
    return {
      isLogin:R==='login', isRegister:R==='register', isForgot:R==='forgot', isVerify:R==='verify',
      isTeach:R==='teach', isCheckout:R==='checkout', isPayment:R==='payment',
      goLegal:e=>{if(e&&e.preventDefault)e.preventDefault();self.go('legal');},
      goSupport:()=>{self.setState({role:'student'});self.go('student-support');},
      goRegister:()=>self.go('register'), goForgot:()=>self.go('forgot'),
      email:s.email, pw:s.pw, setEmail:e=>self.setState({email:e.target.value,loginErr:false}), setPw:e=>self.setState({pw:e.target.value,loginErr:false}),
      loginErr:s.loginErr,
      emailFieldStyle:'width:100%;height:46px;padding:0 14px;border:1px solid '+(s.loginErr?'var(--danger)':'var(--border-2)')+';border-radius:12px;outline:none;background:#fff',
      submitLogin:e=>{ if(e&&e.preventDefault)e.preventDefault();
        if(!s.email.trim()){ self.setState({loginErr:true}); self.toast('أدخل بريدك الإلكتروني للمتابعة','danger'); return; }
        self.setState({role:'student'}); self.go('student'); self.toast('أهلًا بيك — دخلت كطالب (وضع تجريبي)'); },
      submitRegister:e=>{ if(e&&e.preventDefault)e.preventDefault(); self.setState({role:'student'}); self.go('verify'); },
      verifyDone:()=>{ self.setState({role:'student'}); self.go('student'); self.toast('تم تأكيد البريد — حسابك جاهز'); },
      resend:()=>self.toast('أُعيد إرسال رسالة التأكيد إلى بريدك'),
      teach:{
        step:s.teachStep, saved:s.teachDraftSaved,
        steps:steps.map((l,i)=>({label:l,num:i+1,
          style:'display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;border:1px solid '+(s.teachStep===i+1?'var(--primary)':'var(--border)')+';background:'+(s.teachStep===i+1?'var(--primary-50)':'#fff')+';font-size:13px;font-weight:600;color:'+(s.teachStep>=i+1?'var(--primary-700)':'var(--muted)'),
          numStyle:'width:22px;height:22px;border-radius:999px;display:grid;place-items:center;font-size:12px;background:'+(s.teachStep>i+1?'var(--teal)':s.teachStep===i+1?'var(--primary)':'var(--bg)')+';color:'+(s.teachStep>=i+1?'#fff':'var(--muted)'),
          numText:s.teachStep>i+1?'✓':String(i+1),
          pick:()=>self.setState({teachStep:i+1})})),
        is1:s.teachStep===1,is2:s.teachStep===2,is3:s.teachStep===3,is4:s.teachStep===4,is5:s.teachStep===5,
        notFirst:s.teachStep>1, notLast:s.teachStep<5,
        next:()=>{ if(s.teachStep===4){ self.setState({teachStep:5,role:'teacher'}); self.toast('ملفك اتبعت للمراجعة — هنبلغك بالنتيجة'); try{ window.MadarekInsert&&window.MadarekInsert('teacher_applications',{name:(s.email||'مدرس جديد').slice(0,80)||'مدرس جديد',title:'طلب انضمام من الموقع',experience:null}).catch(()=>{}); }catch(e){} } else self.setState({teachStep:s.teachStep+1}); },
        back:()=>self.setState({teachStep:Math.max(1,s.teachStep-1)}),
        saveDraft:()=>{ self.setState({teachDraftSaved:true}); self.toast('حُفظ تقدمك — يمكنك العودة لاحقًا لإكماله'); },
        planPills:self.plans.map(p=>({label:p.name+' · '+self.money(p.m)+' شهريًا',style:self.pill(p.best),pick:()=>self.toast('اخترت باقة «'+p.name+'» — تُفعَّل بعد قبول الملف')})),
        toDashboard:()=>{ self.setState({role:'teacher'}); self.go('teacher-home'); }
      },
      co:{
        empty:s.cart.length===0, notEmpty:s.cart.length>0,
        items:s.cart.map((x,i)=>{ const cc=x.course?self.course(x.course):null; return {title:x.title,meta:x.meta,priceText:self.money(x.price),typeText:typeName[x.type]||'',
          thumb:'width:64px;height:44px;border-radius:10px;flex:0 0 auto;border:1px solid var(--border);background-size:cover;background-position:center;background-image:url('+(cc?self.coverUrl(cc):'/assets/art-hero.webp')+')',
          remove:()=>self.removeFromCart(i)}; }),
        subText:self.money(T.sub), hasDisc:T.disc>0, discText:'- '+self.money(T.disc), discLabel:'خصم '+T.subjects+' مواد ('+T.pct+'%)',
        totalText:self.money(T.total), countText:T.count+(T.count>2&&T.count<11?' عناصر':' عنصر'),
        bundleNudge:T.subjects===1?'ضيف مادة كمان وخد خصم '+self.bundlePct(2)+'% على المواد':T.subjects===2?'ضيف مادة تالتة والخصم يبقى '+self.bundlePct(3)+'%':'',
        hasNudge:T.subjects===1||T.subjects===2, browse:()=>self.go('courses'),
        methods:methods.map(m=>({label:m,style:'display:flex;align-items:center;gap:10px;padding:14px;border:1px solid '+(s.payMethod===m?'var(--primary)':'var(--border)')+';background:'+(s.payMethod===m?'var(--primary-50)':'#fff')+';border-radius:12px;cursor:pointer;text-align:start;width:100%;font-size:15px;font-weight:600;color:var(--ink)',
          radio:'width:18px;height:18px;border-radius:999px;border:'+(s.payMethod===m?'6px solid var(--primary)':'2px solid var(--border-2)')+';flex:0 0 auto',
          pick:()=>self.setState({payMethod:m})})),
        processing:s.payState==='processing', idle:s.payState!=='processing', mobileBar:s.w<900&&R==='checkout'&&s.cart.length>0,
        pay:self.pay, payText:s.payState==='processing'?'جاري تنفيذ الدفع…':'ادفع '+self.money(T.total),
        payStyle:'width:100%;height:52px;margin-top:16px;border:0;border-radius:14px;background:'+(s.payState==='processing'?'#A5B4FC':'var(--primary)')+';color:#fff;font-weight:700;font-size:16px;cursor:'+(s.payState==='processing'?'progress':'pointer')+';display:flex;align-items:center;justify-content:center;gap:10px'
      },
      pr:{
        isSuccess:res==='success', isPending:res==='pending', isFailed:res==='failed',
        courseTitle:(s.paidItems||[]).map(x=>x.title).join(' + '),
        badge:'width:64px;height:64px;border-radius:999px;display:grid;place-items:center;font-size:26px;margin:0 auto 16px;background:'+(res==='success'?'var(--teal-50)':res==='pending'?'var(--amber-50)':'var(--danger-50)')+';color:'+(res==='success'?'var(--teal)':res==='pending'?'var(--amber)':'var(--danger)'),
        badgeText:res==='success'?'✓':res==='pending'?'⋯':'✕',
        title:res==='success'?'تم الدفع':res==='pending'?'مستنيين دفعتك من فوري':'الدفع ما تمش',
        msg:res==='success'?(firstPaid.type==='subscription'?'اشتراك مدارك بلس اتفعّل — كل المواد مفتوحة ليك دلوقتي.':'المحتوى اتضاف لـ«كورساتي». تقدر تبدأ دلوقتي.'):res==='pending'?'كود فوري بتاعك: 7291 4406 — ادفعه في أي منفذ فوري خلال 48 ساعة، وهيتفتح الكورس أوتوماتيك أول ما الدفع يتأكد.':'مفيش أي مبلغ اتخصم. اتأكد من بيانات الكارت أو جرّب وسيلة دفع تانية.',
        startLearn:()=>{ const f=firstPaid; if(f.type==='subscription'||!f.course){ self.go('courses'); } else if(f.type==='lesson'){ self.startLearn(f.course,f.ref); } else if(f.type==='chapter'){ const l=self.db.lessons.find(x=>x.section_id===f.ref); self.startLearn(f.course,l?l.id:undefined); } else self.startLearn(f.course); }, toPurchases:()=>{self.setState({role:'student'});self.go('student-purchases');},
        retry:()=>self.go('checkout'), toCourses:()=>self.go('courses'),
        note:'في النسخة الحقيقية الدفع بيتأكد من السيرفر عن طريق بوابة الدفع (Paymob / Fawry) بس، والشاشة دي مش بتفتح أي وصول لوحدها.'
      }
    };
  }

  pubVals(s,R,self){
    const isMobile=s.w<900;
    const list=self.filteredCourses();
    const chips=[];
    if(s.gradeF) chips.push({label:self.gradeName(s.gradeF),clear:()=>self.setState({gradeF:0})});
    if(s.trackF) chips.push({label:self.cat(s.trackF).name,clear:()=>self.setState({trackF:''})});
    if(s.centerF) chips.push({label:self.centerOf(s.centerF).name,clear:()=>self.setState({centerF:''})});
    if(s.priceBand) chips.push({label:{low:'أقل من 1000 ج.م',high:'1000 ج.م وأكتر'}[s.priceBand],clear:()=>self.setState({priceBand:''})});
    if(s.minRating) chips.push({label:'تقييم 4.8+',clear:()=>self.setState({minRating:0})});
    if(s.q.trim()) chips.push({label:'بحث: '+s.q.trim(),clear:()=>self.setState({q:''})});

    const c=R==='course'?self.courseBySlug(s.p.slug):self.course('c1');
    const ct=self.teacher(c.t), ccat=self.cat(c.cat), cctr=self.centerOf(c.center), bought=self.ownsCourse(c.id);
    const cReviews=self.db.testimonials.filter(t=>t.course_id===c.id);
    const inCart=(type,ref)=>s.cart.some(x=>x.type===type&&x.ref===ref);
    const secs=self.curOf(c.id).map((sec,si)=>{
      const open=s.openSecs.indexOf(sec.id)>-1, ownSec=self.ownsChapter(sec.id,c.id), secCart=inCart('chapter',sec.id);
      return {title:sec.title,open:open,metaText:sec.lessons.length+' حصص · '+sec.lessons.reduce((a,l)=>a+l.min,0)+' دقيقة',
        canBuy:!ownSec&&sec.price>0, owned:ownSec&&!bought, priceText:self.money(sec.price),
        buyText:secCart?'في السلة ✓':'اشتري الباب · '+self.money(sec.price),
        buyStyle:'height:34px;padding:0 12px;border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap;border:1px solid var(--primary);background:'+(secCart?'var(--primary)':'var(--primary-50)')+';color:'+(secCart?'#fff':'var(--primary-700)'),
        buy:()=>secCart?self.go('checkout'):self.addToCart(self.itemChapter(sec,c)),
        toggle:()=>self.setState(st=>({openSecs:open?st.openSecs.filter(x=>x!==sec.id):[...st.openSecs,sec.id]})),
        icon:'width:24px;height:24px;border-radius:7px;background:var(--bg);color:var(--primary);display:grid;place-items:center;flex:0 0 auto;transform:rotate('+(open?'45deg':'0')+');transition:transform var(--dur)',
        lessons:sec.lessons.map(l=>{ const can=self.canWatch(l), lc=inCart('lesson',l.id); return {title:l.title,minText:l.min+' د',
          tagText:l.free?'مجانًا':can?'متاحة':lc?'في السلة':'حصة '+self.money(l.price),
          tag:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap;background:'+(l.free?'var(--teal-50)':can?'var(--primary-50)':lc?'var(--primary)':'var(--amber-50)')+';color:'+(l.free?'var(--teal)':can?'var(--primary-700)':lc?'#fff':'var(--amber)'),
          mark:'width:22px;height:22px;border-radius:999px;flex:0 0 auto;display:grid;place-items:center;font-size:11px;background:'+(can?'var(--primary-50)':'#F1F5F9')+';color:'+(can?'var(--primary-700)':'var(--muted)'),
          markText:can?'▶':'🔒',
          click:()=>{ if(can){ self.startLearn(c.id,l.id); } else if(lc){ self.go('checkout'); } else { self.addToCart(self.itemLesson(l,c)); } }};})};
    });
    const baseRev=[{n:'سارة إبراهيم',r:5,txt:'الشرح منظم جدًا وكل درس بيبني على اللي قبله. أحسن فلوس صرفتها على كورس.',when:'قبل أسبوعين'},{n:'عمر حسن',r:4,txt:'المحتوى ممتاز، بس كنت أتمنى تمارين أكتر في آخر وحدة.',when:'قبل شهر'},{n:'جنى مصطفى',r:5,txt:'المدرس بيرد على الأسئلة بسرعة والملفات المرفقة مفيدة جدًا.',when:'قبل شهرين'}];
    const reviews=cReviews.map(t=>({n:self.sname(t.student_id),r:t.rating,txt:t.text,when:t.role||''})).concat(baseRev).slice(0,3).map((x,i)=>({name:x.n,text:x.txt,when:x.when,stars:'★★★★★'.slice(0,x.r)+'☆☆☆☆☆'.slice(0,5-x.r),initial:x.n[0],avatar:self.avatar(i+1,38)}));

    const tp=R==='teacher'?(self.teachers.find(t=>t.slug===s.p.slug)||self.teachers[0]):self.teachers[0];
    const ctrP=R==='center'?(self.centers.find(x=>x.slug===s.p.slug)||self.centers[0]):self.centers[0];
    const tpi=self.teachers.indexOf(tp);

    const compare=[
      ['عدد المدرسين','1','حتى 10','بلا حدود'],
      ['عدد المواد','5','بلا حدود','بلا حدود'],
      ['ساعات الفيديو','100','500','2000'],
      ['عمولة المنصة','12%','8%','5%'],
      ['أكواد لطلاب السنتر','—','نعم','نعم'],
      ['تقارير لولي الأمر','—','نعم','نعم'],
      ['فروع متعددة ودومين خاص','—','—','نعم'],
      ['الدعم','واتساب','بأولوية','مدير حساب']
    ].map(r=>({label:r[0],a:r[1],b:r[2],c:r[3]}));

    const infoPages={
      help:{title:'مركز المساعدة',lead:'أجوبة سريعة لأكثر ما يُسأل عنه، ثم تواصل مباشر إن احتجت.',blocks:[
        {h:'للطلاب',p:'إزاي أشتري كورس، أدفع بفودافون كاش أو فوري، أتابع تقدمي، وأخد الشهادة.'},
        {h:'للمدرسين',p:'إزاي أعمل كورس، إيه شروط النشر، وإزاي مستحقاتي بتتحسب وبتتحول.'},
        {h:'المدفوعات',p:'فودافون كاش، إنستاباي، فوري، والكروت البنكية — والفواتير وحالات الدفع المعلق.'},
        {h:'الحساب والأمان',p:'تغيير كلمة المرور، تأكيد البريد، وتعطيل الحساب.'}]},
      about:{title:'عن مدارك',lead:'مدارك منصة تعليم مصرية بتجمع الطلاب والمدرسين في مكان واحد — من الثانوية العامة لمهارات سوق العمل.',blocks:[
        {h:'مهمتنا',p:'أن يجد كل متعلّم عربي شرحًا موثوقًا بلغته، وأن يجد كل مدرس أدوات تكفيه للبيع والإدارة.'},
        {h:'كيف نعمل',p:'يشترك المدرس في باقة لاستخدام الأدوات، ويشتري الطالب الدورة التي يحتاجها فقط.'},
        {h:'ملاحظة',p:'دي نسخة تجريبية: الأسماء والأرقام بيانات توضيحية، والفيديوهات في كورس التاريخ حقيقية.'}]},
      legal:{title:'السياسات والشروط',lead:'مسودات تحتاج مراجعة قانونية قبل الإطلاق.',blocks:[
        {h:'سياسة الاسترداد (مسودة)',p:'تقدر تطلب استرجاع خلال 7 أيام من الشراء لو تقدمك في الكورس ما عداش 20%. تُراجع الطلبات يدويًا، وعند الموافقة يُلغى حق الوصول ويُحدَّث السجل المالي.'},
        {h:'الشروط والأحكام (مسودة)',p:'يلتزم المدرس بحقوق الملكية للمحتوى الذي ينشره، وللمنصة حق إيقاف أي دورة تخالف معايير النشر. اشتراك المدرس مستقل عن مشتريات الطلاب.'},
        {h:'الخصوصية (مسودة)',p:'نجمع البيانات اللازمة لتشغيل الحساب والدفع وقياس التقدم فقط، ولا نبيع بيانات المستخدمين لأطراف ثالثة.'}]}
    };
    const ip=infoPages[R]||infoPages.help;

    return {
      isCourses:R==='courses', isCourseDetail:R==='course', isTeachers:R==='teachers', isTeacherProfile:R==='teacher',
      isPricing:R==='pricing', isInfo:R==='help'||R==='about'||R==='legal',
      resultText:list.length+(list.length>2&&list.length<11?' مواد':' مادة'), hasChips:chips.length>0, noResults:list.length===0,
      filteredCards:list.map(x=>self.card(x)),
      showFilters:!isMobile||s.filtersOpen, filtersToggleVisible:isMobile,
      toggleFilters:()=>self.setState({filtersOpen:!s.filtersOpen}),
      filterCatPills:self.cats.map(c=>({label:c.name,style:self.pill(s.trackF===c.id),pick:()=>self.toggleCat(c.id)})),
      gradePills:self.GRADES.map(g=>({label:g.name,style:self.pill(s.gradeF===g.id),pick:()=>self.setState({gradeF:s.gradeF===g.id?0:g.id})})),
      centerPills:self.centers.map(x=>({label:x.name+' · '+x.city,style:self.pill(s.centerF===x.id),pick:()=>self.setState({centerF:s.centerF===x.id?'':x.id})})),

      pricePills:[['low','أقل من 1000'],['high','1000 وأكتر']].map(p=>({label:p[1],style:self.pill(s.priceBand===p[0]),pick:()=>self.setState({priceBand:s.priceBand===p[0]?'':p[0]})})),
      ratingPills:[{label:'4.8 وأعلى',style:self.pill(s.minRating===4.8),pick:()=>self.setState({minRating:s.minRating?0:4.8})}],
      activeChips:chips.map(c=>({label:c.label,clear:c.clear})),
      clearFilters:self.clearFilters,
      sortValue:s.sort, setSort:e=>self.setState({sort:e.target.value}),
      sortOptions:['الأكثر شعبية','الأعلى تقييمًا','الأقل سعرًا','الأحدث'],
      cd:{
        title:c.title, sum:c.sum, level:self.gradeName(c.grade)+' · '+c.term, catName:ccat.name,
        centerName:cctr.name, centerCity:cctr.city, openCenter:()=>self.go('center',{slug:cctr.slug}),
        chapterFrom:self.money(c.chapterPrice), lessonFrom:self.money(c.lessonPrice), hasParts:c.chapterPrice>0,
        subFrom:self.money((self.studentPlans[0]||{price:0}).price), hasSub:self.hasSub(),
        inCartSubject:inCart('subject',c.id), cartCount:s.cart.length, hasCart:s.cart.length>0,
        addSubject:()=>inCart('subject',c.id)?self.go('checkout'):self.addToCart(self.itemSubject(c)),
        addSubjectText:inCart('subject',c.id)?'في السلة — كمّل الدفع':'أضف للسلة (وضيف مواد تانية بخصم)',
        subscribe:()=>self.go('pricing'),
        goCurriculum:()=>{ self.setState({courseTab:'curriculum'}); try{ const el=document.getElementById('md-curr'); el&&el.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){} },
        bundleHint:'اشتري مادتين وخد خصم '+self.bundlePct(2)+'% — 3 مواد '+self.bundlePct(3)+'%',
        mobileBar:isMobile&&!bought&&R==='course', goCheckout:()=>self.go('checkout'),
        catChip:'padding:5px 12px;border-radius:999px;background:'+ccat.bg+';color:'+ccat.c+';font-size:13px;font-weight:600',
        cover:'position:relative;height:clamp(200px,32vw,340px);border-radius:18px;border:1px solid var(--border);background-image:url('+self.coverUrl(c)+');background-size:cover;background-position:center;display:grid;place-items:center;overflow:hidden',
        promo:c.promo||'', hasPromo:!!c.promo, noPromo:!c.promo, promoPoster:'/assets/poster-promo.webp', playPromo:()=>self.setState({promoPlay:true}), promoPlaying:!!s.promoPlay&&!!c.promo, promoIdle:!s.promoPlay&&!!c.promo,
        ratingText:c.rating?c.rating.toFixed(1):'كورس جديد', reviewsText:'('+c.reviews.toLocaleString('en-US')+' تقييم)',
        studentsText:c.students.toLocaleString('en-US')+' طالب', metaText:c.hours+' ساعة · '+c.lessons+' درس',
        priceText:self.money(c.price), oldText:c.old?self.money(c.old):'', hasOld:!!c.old,
        accessText:'المادة كاملة · وصول '+c.access+' شهور',
        bought:bought, notBought:!bought,
        buy:()=>self.buy(c.id), cont:()=>self.startLearn(c.id),
        teacherName:ct.name, teacherTitle:ct.title, teacherBio:ct.bio, teacherInitial:self.ini(ct.name),
        teacherAvatar:self.avatar(self.teachers.indexOf(ct),64),
        teacherStats:'★ '+ct.rating.toFixed(1)+' · '+ct.students.toLocaleString('en-US')+' طالب · '+ct.years+' سنة خبرة · '+cctr.name+' — '+cctr.city,
        openTeacher:()=>self.go('teacher',{slug:ct.slug}),
        outcomes:c.outcomes.map(x=>({t:x})),
        reqs:c.reqs.map(x=>({t:x})),
        audience:[c.audience].concat(c.cat==='thanaweya'?['اللي عايز يقفل المادة ويجيب الدرجة النهائية','اللي محتاج يراجع قبل الامتحان بطريقة منظمة']:['اللي عايز يطبق عملي مش نظري بس','اللي بيدور على شرح عربي موثوق']).filter(Boolean).map(x=>({t:x})),
        sections:secs, reviews:reviews,
        tabs:[['overview','نظرة عامة'],['curriculum','المنهج'],['teacher','المدرس'],['reviews','التقييمات']].map(t=>({label:t[1],style:self.tabBtn(s.courseTab===t[0]),pick:()=>self.setState({courseTab:t[0]})})),
        tabOverview:s.courseTab==='overview', tabCurriculum:s.courseTab==='curriculum', tabTeacher:s.courseTab==='teacher', tabReviews:s.courseTab==='reviews',
        related:self.courses.filter(x=>x.grade===c.grade&&x.id!==c.id&&x.status==='published').slice(0,3).map(x=>self.card(x))
      },
      teacherCards:self.teachers.map((t,i)=>({name:t.name,title:t.title,initial:self.ini(t.name),avatar:self.avatar(i,58),
        rating:t.rating.toFixed(1),studentsText:t.students.toLocaleString('en-US')+' طالب',
        coursesText:self.courses.filter(c=>c.t===t.id&&c.status==='published').length+' مادة · '+self.centerOf(t.center).name+' — '+t.city,
        catName:self.cat(t.cat).name,catChip:'padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:'+self.cat(t.cat).bg+';color:'+self.cat(t.cat).c,
        open:()=>self.go('teacher',{slug:t.slug})})),
      tp:{name:tp.name,title:tp.title,bio:tp.bio,initial:self.ini(tp.name),avatar:self.avatar(tpi,84),
        rating:tp.rating.toFixed(1),studentsText:tp.students.toLocaleString('en-US')+' طالب',yearsText:tp.years+' سنة خبرة',centerName:self.centerOf(tp.center).name,openCenter:()=>self.go('center',{slug:self.centerOf(tp.center).slug}),
        catName:self.cat(tp.cat).name,
        specialties:[self.cat(tp.cat).name,'نظام البكالوريا','متابعة الطلاب','مراجعات نهائية'].map(x=>({t:x})),
        courses:self.courses.filter(c=>c.t===tp.id&&c.status==='published').map(x=>self.card(x)),
        reviews:reviews.slice(0,2)},
      yearly:s.yearly, toggleYearly:()=>self.setState({yearly:!s.yearly}),
      yearlyStyle:'position:relative;width:52px;height:28px;border-radius:999px;border:1px solid var(--border-2);background:'+(s.yearly?'var(--primary)':'#fff')+';cursor:pointer;transition:background var(--dur)',
      knobStyle:'position:absolute;top:3px;'+(s.yearly?'left:4px':'right:4px')+';width:20px;height:20px;border-radius:999px;background:'+(s.yearly?'#fff':'var(--border-2)')+';transition:all var(--dur)',
      planCards:self.plans.map(p=>({name:p.name,desc:p.desc,best:p.best,
        priceText:s.yearly?self.money(p.y):self.money(p.m),
        cycleText:s.yearly?'سنويًا — شهرين هدية':'شهريًا',
        limits:p.limits.map(l=>({t:l})),
        style:'display:flex;flex-direction:column;gap:12px;padding:24px;background:#fff;border:'+(p.best?'2px solid var(--primary)':'1px solid var(--border)')+';border-radius:20px;box-shadow:'+(p.best?'var(--sh-2)':'var(--sh-1)'),
        btnStyle:self.btn(p.best?'primary':'outline','width:100%'),
        pick:()=>{self.setState({cf:Object.assign({},s.cf,{msg:'مهتمين بباقة «'+p.name+'»'})});self.toast('اخترت باقة «'+p.name+'» — كمّل بيانات السنتر');try{const el=document.getElementById('md-cform');el&&el.scrollIntoView({behavior:'smooth'});}catch(e){}}})),
      compareRows:compare,
      isCenters:R==='centers', isCenter:R==='center', isForCenters:R==='for-centers',
      studentPlanCards:self.studentPlans.map(p=>({name:p.name,desc:p.desc,note:p.note,best:p.best,priceText:self.money(p.price),cycle:p.months===1?'شهريًا':'لمدة '+p.months+' شهور',
        limits:p.limits.map(l=>({t:l})), current:s.subActive&&s.subPlan===p.id,
        style:'display:flex;flex-direction:column;gap:12px;padding:22px;background:#fff;border:'+(p.best?'2px solid var(--primary)':'1px solid var(--border)')+';border-radius:20px;box-shadow:'+(p.best?'var(--sh-2)':'var(--sh-1)'),
        btnStyle:self.btn(p.best?'primary':'outline','width:100%'), btnText:(s.subActive&&s.subPlan===p.id)?'اشتراكك الحالي':'اشترك دلوقتي',
        pick:()=>self.subscribe(p.id)})),
      buyWays:[
        {k:'حصة واحدة',v:'من '+self.money(Math.min(...self.courses.filter(c=>c.lessonPrice>0).map(c=>c.lessonPrice))),d:'غبت عن حصة في السنتر؟ اشتريها لوحدها وعوّضها.'},
        {k:'باب (شابتر)',v:'من '+self.money(Math.min(...self.courses.filter(c=>c.chapterPrice>0).map(c=>c.chapterPrice))),d:'قبل الامتحان الشهري: خد الباب اللي محتاجه بس.'},
        {k:'مادة كاملة',v:'من '+self.money(Math.min(...self.courses.filter(c=>c.status==='published').map(c=>c.price))),d:'المنهج كله مع امتحانات وملفات لآخر السنة.'},
        {k:'أكتر من مادة',v:'خصم لحد '+Math.max(0,...self.bundleRules.map(r=>r.pct))+'%',d:'حط موادك في السلة والخصم بيتحسب لوحده.'},
        {k:'اشتراك شهري',v:self.money((self.studentPlans[0]||{price:0}).price)+' / شهر',d:'مدارك بلس بيفتحلك كل المواد من كل السناتر.'}
      ].map((x,i)=>({k:x.k,v:x.v,d:x.d,num:String(i+1),hl:i===4,style:'display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:16px;border:1px solid '+(i===4?'var(--primary)':'var(--border)')+';background:'+(i===4?'var(--primary-50)':'#fff')})),
      goSubscribe:()=>self.go('pricing'), goCenters:()=>self.go('centers'), goForCenters:()=>self.go('for-centers'),
      bundleRows:self.bundleRules.map(r=>({k:r.min+' مواد أو أكتر',v:'خصم '+r.pct+'%'})),
      centerCards:self.centers.map((x,i)=>{ const tch=self.teachers.filter(t=>t.center===x.id); const subs=self.courses.filter(c=>c.center===x.id&&c.status==='published');
        return {name:x.name,city:x.city+' — '+x.gov,rating:x.rating.toFixed(1),students:x.students.toLocaleString('en-US')+' طالب',since:'من '+x.since,
          teachersText:tch.length+' مدرسين',subjectsText:subs.length+' مواد',desc:x.desc,initial:x.name.replace(/^(سنتر|أكاديمية)\s*/,'').replace(/^ال/,'')[0],
          logo:'width:52px;height:52px;border-radius:14px;display:grid;place-items:center;font-weight:700;font-size:22px;flex:0 0 auto;background:'+x.bg+';color:'+x.c+';border:1px solid '+x.c+'33',
          subjects:Array.from(new Set(subs.map(c=>c.subject))).slice(0,4).map(t=>({t:t})),
          open:()=>self.go('center',{slug:x.slug})}; }),
      homeCenters:[],
      ctr:{name:ctrP?ctrP.name:'',city:ctrP?ctrP.city+' — '+ctrP.gov:'',address:ctrP?ctrP.address:'',desc:ctrP?ctrP.desc:'',rating:ctrP?ctrP.rating.toFixed(1):'',
        students:ctrP?ctrP.students.toLocaleString('en-US')+' طالب':'',since:ctrP?'شغال من '+ctrP.since:'',
        initial:ctrP?ctrP.name.replace(/^(سنتر|أكاديمية)\s*/,'').replace(/^ال/,'')[0]:'',
        logo:ctrP?'box-shadow:var(--sh-2);width:72px;height:72px;border-radius:18px;display:grid;place-items:center;font-weight:700;font-size:30px;flex:0 0 auto;background:'+ctrP.bg+';color:'+ctrP.c+';border:1px solid '+ctrP.c+'33':'',
        band:ctrP?'height:120px;border-radius:20px;background:linear-gradient(120deg,'+ctrP.bg+','+ctrP.c+'22),url(/assets/art-hero.webp);background-size:cover;background-position:center;border:1px solid var(--border)':'',
        teachers:ctrP?self.teachers.filter(t=>t.center===ctrP.id).map((t,i)=>({name:t.name,title:t.title,initial:self.ini(t.name),avatar:self.avatar(i,52),rating:t.rating.toFixed(1),open:()=>self.go('teacher',{slug:t.slug})})):[],
        courses:ctrP?self.courses.filter(c=>c.center===ctrP.id&&c.status==='published').map(x=>self.card(x)):[],
        filter:()=>{ if(ctrP){ self.setState({centerF:ctrP.id,gradeF:0,trackF:''}); self.go('courses'); } }},
      cf:{center:s.cf.center,owner:s.cf.owner,phone:s.cf.phone,city:s.cf.city,teachers:s.cf.teachers,students:s.cf.students,msg:s.cf.msg,sent:s.cfSent,notSent:!s.cfSent,
        sendText:s.cfSending?'جاري الإرسال…':'ابعت الطلب',
        setCenter:(e)=>self.setState({cf:Object.assign({},self.state.cf,{center:e.target.value})}), setOwner:(e)=>self.setState({cf:Object.assign({},self.state.cf,{owner:e.target.value})}),
        setPhone:(e)=>self.setState({cf:Object.assign({},self.state.cf,{phone:e.target.value})}), setCity:(e)=>self.setState({cf:Object.assign({},self.state.cf,{city:e.target.value})}),
        setTeachers:(e)=>self.setState({cf:Object.assign({},self.state.cf,{teachers:e.target.value})}), setStudents:(e)=>self.setState({cf:Object.assign({},self.state.cf,{students:e.target.value})}),
        setMsg:(e)=>self.setState({cf:Object.assign({},self.state.cf,{msg:e.target.value})}),
        send:(e)=>{ if(e&&e.preventDefault) e.preventDefault(); const f=self.state.cf;
          if(!f.center.trim()||!f.phone.trim()){ self.toast('اكتب اسم السنتر ورقم الموبايل','danger'); return; }
          self.setState({cfSending:true});
          const row={center_name:f.center.trim().slice(0,100),owner_name:f.owner.trim().slice(0,80)||null,phone:f.phone.trim().slice(0,20),city:f.city.trim().slice(0,60)||null,teachers_count:parseInt(f.teachers)||null,students_count:parseInt(f.students)||null,message:f.msg.trim().slice(0,1000)||null};
          (window.MadarekInsert?window.MadarekInsert('center_applications',row):Promise.resolve()).then(()=>{ self.setState({cfSent:true,cfSending:false}); self.toast('وصلنا طلبك — فريق الشراكات هيكلمك خلال يوم عمل'); })
            .catch(()=>{ self.setState({cfSending:false}); self.toast('حصلت مشكلة في الإرسال — جرّب تاني','danger'); }); }},
      b2b:{
        stats:[{v:String(self.centers.length),k:'سناتر شغالة على مدارك'},{v:self.stat('learners','58,000+'),k:'طالب بيذاكر أونلاين'},{v:String(self.teachers.length),k:'مدرس موثّق'}],
        props:[['بيع أونلاين من غير ما تبني منصة','ارفع حصص السنتر المسجلة، ومدارك بتتولى الدفع والتشغيل وحماية الفيديو.'],['كل طريقة شراء','الطالب يشتري حصة أو باب أو مادة، أو يدخل من اشتراك مدارك بلس — وإنت بتاخد نصيبك من كل ده.'],['أكواد لطلاب السنتر','طلابك اللي بيحضروا عندك ياخدوا أكواد تفتحلهم الأونلاين من غير دفع إضافي.'],['حصص التعويض','الطالب اللي غاب يعوّض الحصة أونلاين، وإنت تكسب بدل ما تخسره.'],['تقارير لولي الأمر','حضور ومشاهدة ودرجات الامتحانات بتتبعت أسبوعيًا على واتساب.'],['تحويلات شهرية','مستحقاتك بتتحول أول كل شهر على حسابك البنكي أو إنستاباي.']].map((x,i)=>({h:x[0],p:x[1],num:String(i+1)})),
        steps:[['سجّل السنتر','ابعت البيانات وفريقنا يكلمك خلال يوم عمل.'],['ضيف المدرسين والمواد','كل مدرس ليه صفحة، وكل مادة مقسمة أبواب وحصص بأسعارك.'],['ارفع الحصص','من الموبايل أو الكمبيوتر، والمنصة بتجهز الفيديو للنت الضعيف.'],['ابدأ البيع','الطلاب بيلاقوا سنترك على مدارك، وإنت بتتابع المبيعات لحظة بلحظة.']].map((x,i)=>({h:x[0],p:x[1],num:String(i+1)}))
      },
      ip:{title:ip.title,lead:ip.lead,blocks:ip.blocks.map(b=>({h:b.h,p:b.p}))}
    };
  }
}
