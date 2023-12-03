import './Card.css'
const Card=(props)=>{
    return(
        <div className='card'>
            <div className='card-img'>
                <img src='${props.img}'/>
            </div>
            <div className='card-p'>
            <h3>{props.title}</h3>
            <p>{props.discription}</p>
            
            </div>
        </div>
    )
}
export default Card