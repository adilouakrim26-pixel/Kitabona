// sw.js — كتابنا ♡ : كيعرض إشعار عادي (بلا محتوى) ويفتح الرابط عند الضغط
// v2: النص دايما "وصلك ميساج"، ما كيبين لا الاسم ولا الرسالة لي جاية من السيرفر
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));

self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(x){d={}}
  e.waitUntil(self.registration.showNotification('وصلك ميساج',{
    body:'',
    tag:d.tag||'kitabna',
    icon:'icon-192.png',
    badge:'icon-192.png',
    data:{url:d.url||'./'}
  }));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const target=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of list){
      if(c.url.startsWith(self.registration.scope)){
        await c.focus();
        try{await c.navigate(target)}catch(x){}
        return;
      }
    }
    await self.clients.openWindow(target);
  })());
});
