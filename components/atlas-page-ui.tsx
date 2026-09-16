import type {ReactNode} from "react";

export function PageHero({eyebrow,title,description,summary}:{eyebrow:string;title:string;description:string;summary?:ReactNode}){
 return <header className="atlas-page-hero"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="atlas-page-intro">{description}</p></div>{summary}</header>;
}

export function ProgressSummary({value,total,label,icon}:{value:number;total:number;label:string;icon:ReactNode}){
 const percentage=total?Math.min(100,Math.round(value/total*100)):0;
 return <div className="atlas-summary"><span className="atlas-summary-seal">{icon}</span><span className="atlas-summary-copy"><small>{label}</small><strong>{value}<em> / {total}</em></strong><i className="atlas-summary-line"><b style={{width:`${percentage}%`}}/></i></span></div>;
}

export function SectionPanel({eyebrow,title,action,children,className=""}:{eyebrow?:string;title:string;action?:ReactNode;children:ReactNode;className?:string}){
 return <section className={`atlas-section-panel ${className}`}><header>{<div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>}{action}</header>{children}</section>;
}
