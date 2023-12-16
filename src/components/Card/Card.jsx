import './Card.css'
import unkownProj from '../../assets/unkownProj.png'
const Card=(props)=>{
   
    return(
        <div className='card'>
            <div className='card-img'>
                <img className='card-img' src={props.img?`${props.img}`:unkownProj}/>
            </div>
            <div className='card-p'>
            <h3>{props.title}</h3>
            <p>{props.discription}</p>
            <p><a href={props.link}>link</a><br/><a href={props.github}>github</a></p>
            </div>
        </div>
    )
}
export default Card