// Preserve the visible page while a fixed dialog owns focus. A route change owns
// its own scroll position and must not receive the old dialog's restoration.
export function lockDocumentScroll(environment) {
  const root=environment.document.documentElement,overflow=root.style.overflow;
  const top=environment.scrollY,url=environment.location.href;
  root.style.overflow='hidden';
  environment.scrollTo({top,behavior:'instant'});
  let released=false;
  return()=>{
    if(released)return;released=true;root.style.overflow=overflow;
    if(environment.location.href===url)environment.scrollTo({top,behavior:'instant'});
  };
}
