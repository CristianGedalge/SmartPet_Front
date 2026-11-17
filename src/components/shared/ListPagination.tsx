import { Button } from '../ui/button';
export function ListPagination({page,hasNext,loading,onPage}:{page:number;hasNext:boolean;loading:boolean;onPage:(page:number)=>void}) {
  return <div className="directory-pagination"><span>Página {page+1}</span><div><Button variant="outline" disabled={loading || page===0} onClick={()=>onPage(page-1)}>Anterior</Button><Button variant="outline" disabled={loading || !hasNext} onClick={()=>onPage(page+1)}>Siguiente</Button></div></div>;
}
