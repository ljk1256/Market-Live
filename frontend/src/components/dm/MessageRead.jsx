import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MessageSideBar from './MessageSideBar';
import { Spinner, Button } from 'react-bootstrap'



function MessageRead() {
    const navigate = useNavigate();

    // 동적 라우팅 저장
    const {dm_id} = useParams()

    const [msg, setMsg] = useState('')
    const [id, setId] = useState('')
    const [date, setDate] = useState('')

    
    useEffect(() => {
        axios({     // 유저 pk 받아오기
            method: 'get',
            url: '/user/mypage/',
            headers: {Authorization: localStorage.getItem('jwt')}
        })
        .then(res => { 
            // console.log(res.data.userid)
            setId(res.data.userid)
        })
        .catch(err => {
            console.log(err)
            // 토큰 만료되면 로그아웃
            localStorage.removeItem("jwt");
            navigate("/login");
        })
        axios({     // 메시지 받아오기
            method: 'get',
            url: '/dm/'+dm_id,
        })
        .then(res => {
            console.log(res)
            setMsg(res.data)
            console.log(new Date(res.data.dm_time))
            const date_ = new Date(res.data.dm_time)
            setDate(date_.getFullYear()+'년 '
            +(date_.getMonth()+1)+'월 '
            +date_.getDate()+'일 '
            +date_.getHours()+'시 '
            +date_.getMinutes()+'분')
        })
        .catch(err => {
            console.log(err)
        })
        axios({     // 읽은 표시
            method: 'patch',
            url: '/dm/read/'+dm_id,
            data: {
                "dm_read": true,
            }
        })
        .then(res => {
            // console.log(res)
        })
        .catch(err => {

            console.log(err)
        })
    }, [])



    // axios 받아오기 전에 key값 오류 방지
    if (msg === ''){
        return(
            <div className="d-md-flex">
                <MessageSideBar></MessageSideBar>
                <Spinner animation="border" className="d-none d-md-block" style={{marginTop:"30vh", marginLeft:"35vw"}}/>
                <Spinner animation="border" className='d-md-none d-flex mx-auto' style={{marginTop:"30vh"}}/>
            </div>
        )
    }
    else{   // 로그인한 유저와 메시지 받는 유저가 다르면 홈으로 이동
        if(id && id !== msg.receiverId.userId){
            navigate("/")
        }
    }

    const onMessage = () => {
        navigate(`/messageto/${msg.senderId.user_nickname}`)
    }

    // const date = new Date(msg.dm_time)
    // console.log(date)


    return(
        <div className='d-md-flex'>
            <MessageSideBar></MessageSideBar>
            <div style={{width: '90%', maxWidth:"600px"}} className='mx-auto mt-3 mt-md-5'>
                <div className=' border p-2'>
                    <div className=''>
                        {msg.dm_title}
                    </div>
                    <hr className='my-2' />

                    <pre style={{whiteSpace: "pre-wrap"}}>{msg.dm_msg}</pre>
                    
                    <span>보낸이: </span>
                    <Link 
                        to={`/profile/${msg.senderId.user_nickname}`}
                        className='text-dark'
                        style={{ textDecoration: 'none' }}
                    >
                        {msg.senderId.user_nickname} 
                    </Link>
                    <br />
                    <span>날짜: </span>
                    {/* {msg.dm_time} */}
                    {date}
    
                </div>
                <Button 
                    // variant="secondary"
                    variant="outline-secondary"
                    onClick={onMessage} 
                    className='d-flex ms-auto mt-2'
                >
                    답장
                </Button>
            </div>
            <div className="ms-auto d-none d-md-block"></div>
            
        </div>
    )
}

export default MessageRead;