import './Card.css'
import unkownProj from '../../assets/folder.svg'
import unkownGif from '../../assets/unknownGif.gif'

import { useState } from 'react'
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
        </div>
    )
}
export default Card