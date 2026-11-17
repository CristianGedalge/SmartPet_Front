import { PawPrint } from 'lucide-react';
export function AnimalImage({url,name}:{url?:string;name:string}) {
  return <div className="rescue-image"><PawPrint aria-hidden="true" size={42}/>{url && <img src={url} alt={'Foto de '+name} loading="lazy" onError={event=>{event.currentTarget.hidden=true;}}/>}</div>;
}
