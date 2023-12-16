import './ListOverview.css';
import Card from '../../components/Card/Card';
const ListOverview=(props)=>{
    return(
        <div className='list-overview'>
           
            {
                props.projectsList && props.projectsList.map((x) => {
                  return(
                    <Card key={x.pid} title={x.project_title} discription={x.discription} img={x.img} link={x.project_link} github={x.github}/>
                  )
                })
              }
           
            
        </div>
    )
}
export default ListOverview