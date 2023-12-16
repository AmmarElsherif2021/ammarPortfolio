import './Hero.css'
import heroImg from '../../assets/hero.png'
const Hero=()=>{
    return(
        
            <div className='hero'>
                
                <div >
                <img className='hero-img' src={heroImg}/>
                </div>
                <div className='hero-text'>
                <h1>Hero text </h1>
                    <div className="typewriter" style={{animationDelay: "0s"}}>The purpose of using Lorem  Ipsum is that it has a more </div>
                    <div className="typewriter" style={{animationDelay: "3.5s"}}>ibution of leng Content</div>
                    <div className="typewriter" style={{animationDelay: "7s"}}>k like readable English1. Many desktop pu </div>
                    <div className="typewriter" style={{animationDelay: "10.5s"}}>s and web page editors now use Lorem Ipsum as th</div>
                    <div className="typewriter" style={{animationDelay: "14s"}}>There are many variations of passages of Lorem Ips t</div>
                    <div className="typewriter" style={{animationDelay: "17.5s"}}>e majority have suffered alteration in some form, by i </div>
                    <div className="typewriter" style={{animationDelay: "21s"}}>words which dont look even slightly</div>
                    </div>

                </div>
        
    )
}
export default Hero