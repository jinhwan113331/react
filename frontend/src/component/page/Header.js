import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../style/Header.css';
import SearchBox from './SearchBox';


export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const key = location;

    const handleHomeClick = () => {
        navigate('/'); 
    };
    return (
        <div className="Header">
            <div className="header1">
                <button onClick={handleHomeClick} 
                        style={{ color: '#B3C7F9', textDecoration: 'none', background: 'none', border: 'none', lineHeight: '30px' , width: '50px'
                        , height: '50px' }}>
                    <p>홈</p>
                </button>
            </div>
            <div className="header2">
                <p style={{ color: '#B3C7F9' }}>챔피언 분석</p>
            </div>
            <div className="header3">
                <p style={{ color: '#B3C7F9' }}>통계</p>
            </div>
            <div className="header4">
                <p style={{ color: '#B3C7F9' }}>랭킹</p>
            </div>
            <div style={{ textAlign: 'center', margin: '20px' }}>
                {key.pathname === '/' && <img src={process.env.PUBLIC_URL + '/logo.png'} style={{ maxWidth: '60vh' }} />}
            </div>
            <div>                
                {key.pathname === '/' ? null : <SearchBox />}
            </div>
        </div>
    );
}