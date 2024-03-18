import './Strip.css'
import Bubble from '../Bubble/Bubble'
const Strip=(props)=>{
    return(
        <div className='strip'>
           { props.libsList.map((x)=>(
                <div><Bubble img={x.img} stat={x.stat}/></div>
            ))}
            </div>
         
            

        
    )
}
export default Strip