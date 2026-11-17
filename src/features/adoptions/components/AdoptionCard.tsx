import type { ReactNode } from 'react';
import { AnimalImage } from '../../pets/components/AnimalImage';
import type { AdoptionPublication } from '../types/adoption.types';
export function AdoptionCard({publication,children}:{publication:AdoptionPublication;children:ReactNode}) {
  return <article className="panel rescue-card"><AnimalImage url={publication.mascota.fotos[0]?.url} name={publication.mascota.nombre}/><div className="rescue-card-body"><span className={'status-pill '+(publication.estado==='PUBLICADA' ? 'enabled' : 'disabled')}>{publication.estado==='PUBLICADA' ? 'En adopción' : publication.estado==='ADOPTADA' ? 'Adoptado' : 'Publicación retirada'}</span><h2>{publication.mascota.nombre}</h2><p>{publication.mascota.especie?.nombre}{publication.mascota.razaNombre && ' / '+publication.mascota.razaNombre}</p><p className="rescue-description">{publication.descripcion}</p><p className="api-muted">{publication.establecimiento.nombre}</p><div className="rescue-actions">{children}</div></div></article>;
}
