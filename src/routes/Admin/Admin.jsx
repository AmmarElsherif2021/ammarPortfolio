import Card from '../../components/Card/Card'
import Strip from '../../components/Strip/Strip'
import './Admin.css'
const Admin=()=>{
    return(
        <div className='admin'>
            <div>
               <h1>This is your admin dashboard</h1>
            </div>
            <div className='admin-grid1'>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
            </div>
            <div>
            <h1>This is your admin dashboard</h1>
            </div>
            <div>
            <Strip/>
            </div>
            
            <div className='admin-links'>
            <table>
           
            <tbody>
              <tr>
                <td>Row 1, Column 1</td>
                <td>Row 1, Column 2</td>
                <td>Row 1, Column 3</td>
              </tr>
              <tr>
                <td>Row 2, Column 1</td>
                <td>Row 2, Column 2</td>
                <td>Row 2, Column 3</td>
              </tr>
              <tr>
                <td>Row 3, Column 1</td>
                <td>Row 3, Column 2</td>
                <td>Row 3, Column 3</td>
              </tr>
            </tbody>
          </table>
            </div>

        </div>
    )
}
export default Admin