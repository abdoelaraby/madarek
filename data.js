/* Madarek data layer: reads the Supabase REST API (PostgREST) with the public publishable key.
   Row Level Security on the database allows read-only access for the demo, plus insert into teacher_applications. */
(function(){
  var C = window.MADAREK || {};
  var tables = {
    categories:'categories?select=*&order=position',
    centers:'centers?select=*&order=students_count.desc',
    studentSubs:'student_subscriptions?select=*',
    teachers:'teachers?select=*&order=id',
    courses:'courses?select=*&order=created_at.desc',
    sections:'course_sections?select=*&order=course_id,position',
    lessons:'lessons?select=*&order=course_id,position',
    files:'lesson_files?select=*',
    plans:'plans?select=*&order=position',
    faqs:'faqs?select=*&order=position',
    students:'students?select=*&order=id',
    testimonials:'testimonials?select=*,students(name)&order=id',
    enrollments:'enrollments?select=*&order=last_activity.desc',
    payments:'payments?select=*&order=paid_at.desc',
    refunds:'refunds?select=*&order=requested_at.desc',
    payouts:'payouts?select=*&order=requested_at.desc',
    subscriptions:'subscriptions?select=*',
    submissions:'submissions?select=*&order=submitted_at.desc',
    questions:'questions?select=*&order=asked_at.desc',
    coupons:'coupons?select=*',
    tickets:'tickets?select=*&order=created_at.desc',
    audit:'audit_log?select=*&order=created_at.desc',
    applications:'teacher_applications?select=*&order=submitted_at.desc',
    notifications:'notifications?select=*&order=created_at.desc',
    stats:'site_stats?select=*'
  };
  function get(path){
    return fetch(C.url+'/rest/v1/'+path,{headers:{apikey:C.key,Authorization:'Bearer '+C.key}})
      .then(function(r){ if(!r.ok) throw new Error(r.status+' '+path); return r.json(); });
  }
  var keys = Object.keys(tables);
  window.MadarekData = window.__TEST_FIXTURE ? Promise.resolve(window.__TEST_FIXTURE) : C.url ? Promise.all(keys.map(function(k){ return get(tables[k]).catch(function(e){ console.warn('[madarek] '+e.message); return null; }); }))
    .then(function(res){ var o={}; keys.forEach(function(k,i){ o[k]=res[i]; }); return o; }) : Promise.resolve(null);
  window.MadarekInsert = function(table, row){
    return fetch(C.url+'/rest/v1/'+table,{method:'POST',headers:{apikey:C.key,Authorization:'Bearer '+C.key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row)})
      .then(function(r){ if(!r.ok) throw new Error(r.status); return true; });
  };
})();

/* Boot: wait for data, then load the page runtime */
(function(){
  function boot(d){
    window.__MDATA=d||{};
    var s=document.createElement('script'); s.src='/vendor/dc-runtime.js';
    s.onload=function(){ var sp=document.getElementById('md-splash'); if(sp){ setTimeout(function(){ sp.classList.add('md-hide'); setTimeout(function(){ sp.remove(); },400); },150); } };
    document.head.appendChild(s);
  }
  window.MadarekData.then(function(d){
    if(!d||!d.courses||!d.courses.length){ var sp=document.getElementById('md-splash'); if(sp) sp.classList.add('md-err'); window.__mdRetry=function(){ location.reload(); }; return; }
    boot(d);
  });
})();
