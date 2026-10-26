document.addEventListener('DOMContentLoaded',()=>{
 const stats=document.querySelector('.stats');
 if(stats){
  const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countStats=()=>{
   if(prefersReducedMotion)return;
   stats.querySelectorAll('.stat strong').forEach((counter,index)=>{
    const finalText=counter.textContent.trim();
    const finalValue=Number(finalText);
    if(!Number.isFinite(finalValue))return;
    counter.setAttribute('aria-label',finalText);
    const duration=900;
    const startTime=performance.now()+index*100;
    const updateCount=(now)=>{
     const progress=Math.min(1,Math.max(0,(now-startTime)/duration));
     const easedProgress=1-Math.pow(1-progress,3);
     const currentValue=Math.round(finalValue*easedProgress);
     counter.textContent=String(currentValue).padStart(finalText.length,'0');
     if(progress<1)requestAnimationFrame(updateCount);
    };
    requestAnimationFrame(updateCount);
   });
  };
  const revealStats=()=>{
   stats.classList.add('is-visible');
   countStats();
  };
  if(prefersReducedMotion){
   stats.classList.add('is-visible');
  }else if('IntersectionObserver' in window){
   stats.classList.add('is-observed');
   const statsObserver=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
     revealStats();
     statsObserver.disconnect();
    }
   },{threshold:0.25});
   statsObserver.observe(stats);
  }else{
   revealStats();
  }
 }
 const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('header nav');
 if(toggle&&nav){
  const closeMenu=()=>{
   nav.classList.remove('open');
   toggle.setAttribute('aria-expanded','false');
  };
  toggle.addEventListener('click',()=>{
   const open=nav.classList.toggle('open');
   toggle.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&nav.classList.contains('open')){
    closeMenu();
    toggle.focus();
   }
  });
  document.addEventListener('click',event=>{
   if(nav.classList.contains('open')&&!nav.contains(event.target)&&!toggle.contains(event.target))closeMenu();
  });
 }
 document.querySelectorAll('.faq-q').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item');item.classList.toggle('open');btn.setAttribute('aria-expanded',String(item.classList.contains('open')))}));
 const filters=document.querySelectorAll('.filter'), tiles=document.querySelectorAll('[data-category]');
 filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const category=btn.dataset.filter;tiles.forEach(tile=>tile.hidden=category!=='all'&&tile.dataset.category!==category)}));
 const form=document.querySelector('#contact-form'), notice=document.querySelector('.notice');
 if(form) form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(notice){notice.style.display='block';notice.textContent='Thank you. This demo form has validated successfully. Connect a backend or email service to deliver messages.';}form.reset()});
 const articleImage=document.querySelector('.article-cover');
 if(articleImage){
  const stories={
   process:{
    image:'assets/1.JPG',
    alt:'A voter placing a ballot in a ballot box',
    title:'Understanding the electoral process',
    category:'Public information',
    summary:'Clear, accessible information helps citizens understand how to take part in the electoral process. Use this space to share verified guidance, important announcements, and links to official resources.'
   },
   participation:{
    image:'assets/educat.jpg',
    alt:'A community civic education session',
    title:'Encouraging informed participation',
    category:'Civic education',
    summary:'Civic education gives people the knowledge to participate confidently. Share verified learning resources and practical guidance that support informed public participation.'
   },
   notices:{
    image:'assets/web-lc.jpg',
    alt:'Illustrated electoral information and public notices',
    title:'Public notices and resources',
    category:'Announcements',
    summary:'Use the public information area to share verified notices, approved publications, and helpful resources. Keep each item current and link readers to its official source.'
   }
  };
  const story=stories[new URLSearchParams(window.location.search).get('story')]||stories.process;
  articleImage.src=story.image;
  articleImage.alt=story.alt;
  const title=articleImage.closest('.news-article')?.querySelector('.article-heading h2');
  if(title)title.textContent=story.title;
  const category=articleImage.closest('.news-article')?.querySelector('.article-meta span');
  if(category)category.textContent=story.category;
  const summary=articleImage.closest('.news-article')?.querySelector('.article-lead');
  if(summary)summary.textContent=story.summary;
  document.title=`${story.title} | Electoral Commission Uganda — Concept`;
 }
});
