/*
 * RISE | Interactive Customer Solutions Presentation
 * Content and demo URLs are editable here. Keep public-site information approved.
 */
const SITE = {
  chapters: [
    {id:"home", title:"Welcome"},
    {id:"theme1", title:"AI & Self-Service"},
    {id:"theme2", title:"AI, Automation & Excellence"},
    {id:"demo-qa", title:"QA.MAFer.AI"},
    {id:"demo-service360", title:"SHARE Service360"},
    {id:"closing", title:"Closing"}
  ],
  demos: {
    qa: {
      title:"QA.MAFer.AI",
      url:"https://expert-adventure-7z351g7.pages.github.io/"
    },
    service360: {
      title:"SHARE Service360",
      url:"https://expert-adventure-7z351g7.pages.github.io/share-service360/"
    }
  },
  deliveries: [
    {
      id:"ksa",category:"SHARE ASSISTIVE AI / KSA",title:"SHARE Assistive AI — KSA",
      description:"AI-supported SHARE customer service launched for the Kingdom of Saudi Arabia on 6 September 2026.",
      points:["Customer-facing assistive AI capability introduced", "Designed to handle appropriate enquiries through an automated journey", "Human assistance remains important for cases needing advisor support"]
    },
    {
      id:"oman",category:"SHARE ASSISTIVE AI / OMAN",title:"SHARE Assistive AI — Oman",
      description:"The SHARE AI customer service capability expanded to Oman on 16 September 2026.",
      points:["Extended the assistive AI journey into a second market", "Built on a common approach while enabling market rollout", "Continued focus on seamless escalation and resolution"]
    },
    {
      id:"ivr",category:"VOICE & CONTACT CENTRE",title:"Voice & IVR modernization",
      description:"The contact-centre environment underwent a voice and IVR migration, including reconfiguration and integration validation.",
      points:["Genesys organizational migration and IVR changes", "Connected service integrations and authentication reconfigured", "Core interaction and service flows validated during migration"]
    }
  ]
};
(() => {
  "use strict";
  const el=id=>document.getElementById(id);
  const sections=SITE.chapters.map(x=>x.id);
  const views=[...document.querySelectorAll("[data-view]")];
  const dialogs=[el("detail-dialog"),el("jump-dialog")];
  let current="home", returnFocus=null;
  const loaded={qa:false,service360:false};
  function dialogOpen(){return dialogs.some(d=>!d.hidden);}
  function closeDialogs(){
    let changed=false;
    for(const d of dialogs)if(!d.hidden){d.hidden=true;changed=true;}
    if(changed&&returnFocus&&document.contains(returnFocus))returnFocus.focus();
    returnFocus=null;
  }
  function openDialog(dialog){
    closeDialogs();
    returnFocus=document.activeElement;
    dialog.hidden=false;
    const first=dialog.querySelector("button");
    if(first)first.focus();
  }
  function navigate(id,replace=false){
    if(!sections.includes(id))return;
    closeDialogs();
    current=id;
    for(const view of views){const active=view.dataset.view===id;view.hidden=!active;view.classList.toggle("is-active",active);view.setAttribute("aria-hidden",String(!active));}
    const i=sections.indexOf(id);
    el("current-number").textContent=String(i).padStart(2,"0");
    el("total-number").textContent=String(sections.length-1).padStart(2,"0");
    el("current-name").textContent=SITE.chapters[i].title;
    el("dock-progress-fill").style.width=(100*i/(sections.length-1))+"%";
    el("prev-screen").disabled=i===0;el("next-screen").disabled=i===sections.length-1;
    document.querySelectorAll(".topnav [data-go]").forEach(btn=>{
      const selected=btn.dataset.go===id;
      btn.classList.toggle("is-current",selected);
      if(selected)btn.setAttribute("aria-current","page");else btn.removeAttribute("aria-current");
    });
    document.title="RISE | "+SITE.chapters[i].title;
    if(replace)history.replaceState(null,"","#"+id);
    else if(location.hash!=="#"+id)history.pushState(null,"","#"+id);
    if(id==="demo-qa")loadDemo("qa");
    if(id==="demo-service360")loadDemo("service360");
    window.scrollTo(0,0);
  }
  function move(n){const i=Math.max(0,Math.min(sections.length-1,sections.indexOf(current)+n));navigate(sections[i]);}
  function loadDemo(key,force=false){
    const demo=SITE.demos[key];if(!demo)return;
    const frame=el("frame-"+key);
    const placeholder=el("placeholder-"+key);
    if(force){loaded[key]=false;frame.removeAttribute("src");placeholder.hidden=false;}
    if(!loaded[key]){
      loaded[key]=true;
      frame.src=demo.url;
      // The iframe load event does not prove embedding is permitted: browsers
      // can block a framed page because of CSP or X-Frame-Options.
      frame.addEventListener("load",()=>{placeholder.hidden=true;},{once:true});
    }
  }
  function zoomDemo(key){
    const shell=el("shell-"+key);
    if(!shell)return;
    try{
      if(document.fullscreenElement)document.exitFullscreen();
      else if(shell.requestFullscreen)shell.requestFullscreen();
    }catch(e){console.warn("Fullscreen not available",e);}
  }
  function detail(id){
    const info=SITE.deliveries.find(x=>x.id===id);
    if(!info)return;
    el("detail-category").textContent="RISE / "+info.category;
    el("detail-title").textContent=info.title;
    el("detail-description").textContent=info.description;
    const list=el("detail-facts");list.replaceChildren();
    for(const item of info.points){
      const row=document.createElement("div");row.className="fact-row";
      const marker=document.createElement("span");marker.className="fact-check";marker.textContent="✦";
      const text=document.createElement("span");text.textContent=item;
      row.append(marker,text);list.append(row);
    }
    openDialog(el("detail-dialog"));
  }
  function jumpMenu(){
    const target=el("jump-links");target.replaceChildren();
    SITE.chapters.forEach((x,i)=>{
      const btn=document.createElement("button");btn.type="button";btn.className="jump-link";btn.dataset.go=x.id;
      const num=document.createElement("span");num.textContent=String(i).padStart(2,"0");
      const title=document.createElement("span");title.textContent=x.title;
      const arrow=document.createElement("span");arrow.textContent="↗";
      btn.append(num,title,arrow);target.append(btn);
    });
    openDialog(el("jump-dialog"));
  }
  document.querySelectorAll("[data-external]").forEach(link=>{
    const key=link.dataset.external;
    if(SITE.demos[key])link.href=SITE.demos[key].url;
  });
  document.addEventListener("click",e=>{
    const button=e.target.closest("button");
    if(!button){if(e.target.classList.contains("dialog-backdrop"))closeDialogs();return;}
    if(button.hasAttribute("data-close")){closeDialogs();return;}
    if(button.dataset.go){navigate(button.dataset.go);return;}
    if(button.dataset.delivery){detail(button.dataset.delivery);return;}
    if(button.dataset.reload){loadDemo(button.dataset.reload,true);return;}
    if(button.dataset.zoom){zoomDemo(button.dataset.zoom);return;}
  });
  el("prev-screen").addEventListener("click",()=>move(-1));
  el("next-screen").addEventListener("click",()=>move(1));
  ["jump-open","dock-jump"].forEach(id=>el(id).addEventListener("click",jumpMenu));
  el("fullscreen").addEventListener("click",()=>{
    try{
      if(document.fullscreenElement)document.exitFullscreen();
      else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen();
    }catch(e){console.warn("Fullscreen not available",e);}
  });
  document.addEventListener("keydown",e=>{
    if(e.target&&(e.target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName)))return;
    if(e.key==="Escape"&&dialogOpen()){e.preventDefault();closeDialogs();return;}
    if(dialogOpen()){
      if(e.key==="Tab"){
        const dialog=dialogs.find(x=>!x.hidden);
        const nodes=[...dialog.querySelectorAll("button:not([disabled]),a[href]")];
        if(nodes.length){
          if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus();}
          else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus();}
        }
      }
      return;
    }
    // An embedded demo owns its own keyboard inputs while it is focused.
    if(e.key==="ArrowRight"||e.key==="PageDown"){e.preventDefault();move(1);}
    else if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();move(-1);}
    else if(e.key.toLowerCase()==="f"&&!e.altKey&&!e.ctrlKey&&!e.metaKey){e.preventDefault();el("fullscreen").click();}
    else if(e.key.toLowerCase()==="g"&&!e.altKey&&!e.ctrlKey&&!e.metaKey){e.preventDefault();jumpMenu();}
  });
  window.addEventListener("popstate",()=>navigate(location.hash.slice(1)||"home",true));
  navigate(location.hash.slice(1)||"home",true);
})();