import {useLayoutEffect,useRef} from 'react';
import {useLocation,useNavigate,useNavigationType} from 'react-router-dom';
import {decodeFragment} from '../../utils/scroll';
import {createScrollRestoration} from '../../services/scrollRestoration';

export default function ScrollToTop() {
  const {pathname,hash,key}=useLocation();
  const navigationType=useNavigationType(),navigate=useNavigate(),restoration=useRef(null);
  useLayoutEffect(()=>{
    restoration.current=createScrollRestoration(window);
    return()=>{restoration.current.dispose();restoration.current=null;};
  },[]);
  useLayoutEffect(()=>{
    if(pathname==='/'&&decodeFragment(hash)==='faq'){navigate('/faq',{replace:true});return;}
    restoration.current.navigate({key,hash,navigationType});
  },[pathname,hash,key,navigationType,navigate]);
  return null;
}
