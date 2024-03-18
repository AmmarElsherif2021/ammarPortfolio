import './Card.css'
import unkownProj from '../../assets/folder.svg'
import unkownGif from '../../assets/unknownGif.gif'

import { useState } from 'react'
<<<<<<< HEAD
const Card = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleHover = () => {

    }
    return (
        <div className='card'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div>
                <img className='card-img' src={props.gif ? `${props.gif}` : unkownGif} />
            </div>
            {isHovered ? <div className='card-p'>
                <h3>{props.title}</h3>
                <p>{props.discription}</p>
                <p><a href={props.link}>link</a><br /><a href={props.github}>github</a></p>
            </div> : <div></div>}
=======
const Card=(props)=>{
    const [isHovered,setIsHovered]=useState(false);
    const handleHover =()=>{
        
    }
    return(
        <div className='card'  
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
            <div className='card-img'>
                {  isHovered? <img className='card-img' src={props.gif?`${props.gif}`:unkownGif}/>
                    :
                    <img className='card-img' src={props.img?`${props.img}`:unkownProj}/>
                }
            </div>
            <div className='card-p'>
            <h3>{props.title}</h3>
            <p>{props.discription}</p>
            <p><a href={props.link}>link</a><br/><a href={props.github}>github</a></p>
            </div>
>>>>>>> 89d6d93dc339359dac1cdd0c06145a4c98440a7e
        </div>
    )
}
export default Card