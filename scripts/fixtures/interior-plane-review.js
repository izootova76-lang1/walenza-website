(()=>{
 const tools=document.getElementById('plane-review-tools');
 function read(){const fragment=location.hash.slice(1)||'/';const [pathAndQuery,...anchors]=fragment.split('#');const [pathname,search='']=pathAndQuery.split('?');return{pathname,params:new URLSearchParams(search),anchor:anchors.join('#')}}
 function route(pathname,enabled,anchor=''){const params=new URLSearchParams();if(enabled)params.set('design','planes');return '#'+pathname+(params.size?'?'+params:'')+(anchor?'#'+anchor:'')}
 function update(){const enabled=read().params.get('design')==='planes';tools.querySelectorAll('[data-plane-mode]').forEach(button=>button.setAttribute('aria-pressed',String((button.dataset.planeMode==='planes')===enabled)));tools.querySelectorAll('[data-plane-route]').forEach(link=>link.href=route(link.dataset.planeRoute,enabled,link.dataset.planeRoute.includes('customers')?'order':''))}
 tools.addEventListener('click',event=>{const button=event.target.closest('[data-plane-mode]');if(!button)return;const {pathname,params,anchor}=read();if(button.dataset.planeMode==='planes')params.set('design','planes');else params.delete('design');location.hash=pathname+(params.size?'?'+params:'')+(anchor?'#'+anchor:'');});
 addEventListener('hashchange',update);update();
})();
