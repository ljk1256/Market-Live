import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";


function MessageSideBar() {
    const navigate = useNavigate();

    // 버튼 누를 때 링크 이동
    const onMessage = () => {
        navigate('/message')
    }
    const onMessageWrite = () => {
        navigate('/message/write')
    }

    return(
        <div>
            <div style={{width: "150px"}} className="ms-3 d-none d-md-block">
                {/* <ul>
                    <li>
                        <Link to="/message">받은 쪽지</Link>
                    </li>
                    <li>
                        <Link to="/message/write">쪽지 쓰기</Link>
                    </li>
                </ul> */}

                <div className="d-flex" >
                    <Nav  className="flex-column" style={{width:"100%"}}>
                        {/* <hr className="mx-2 mb-0 mt-2"/> */}
                        <Nav.Link 
                            onClick={onMessage} 
                            className="text-dark fw-bold text-center border mt-3"
                        >
                            받은 쪽지
                        </Nav.Link>
                        {/* <hr className="mx-2 my-0"/> */}
                        <Nav.Link 
                            onClick={onMessageWrite} 
                            className="text-dark fw-bold text-center border"
                        >
                            쪽지 쓰기
                        </Nav.Link>
                        {/* <hr className="mx-2 my-0"/> */}
                    </Nav>
                </div>

            </div>

            <div className=" d-md-none mx-auto mt-2" style={{width:"90%", maxWidth:"600px"}}>
                <Nav  className="">
                    <Nav.Link 
                        onClick={onMessage} 
                        className="text-dark fw-bold text-center border"
                    >
                        받은 쪽지
                    </Nav.Link>
                    <Nav.Link 
                        onClick={onMessageWrite} 
                        className="text-dark fw-bold text-center border"
                    >
                        쪽지 쓰기
                    </Nav.Link>
                </Nav>
            </div>
        </div>
    )
}

export default MessageSideBar;