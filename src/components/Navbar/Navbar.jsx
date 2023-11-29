import './Navbar.css'

const Navbar=()=>{
    return(
        <div className = 'nav'>
            <div className='left-nav'>
              <h3>Logo</h3>
            </div>
            <div></div>
            <div className='right-nav'>
                <div>
                <h4>Browse</h4>
                </div>
                <div>
                <h4>About me</h4>
                </div>
                <div>
                <h4>Contact</h4>
                </div>
            </div>

        </div>
    )
}
export default Navbar