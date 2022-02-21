import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MessageSideBar from './MessageSideBar';
import { Spinner, Table } from 'react-bootstrap'

function Message() {
    const navigate = useNavigate();

    const [myId, setMyId] = useState('')
    const [msgs, setMsgs] = useState('')
    const date_ = new Date()
    const today = String(date_.getFullYear()*10000+
    +(date_.getMonth()+1)*100
    +date_.getDate())


    // 나의 pk 저장
    useEffect(() => {
        axios({
            method: 'get',
            url: '/user/mypage/',
            headers: {Authorization: localStorage.getItem('jwt')}
        })
        .then(res => { 
            // console.log(res)
            setMyId(res.data.userid)
        })
        .catch(err => {
            console.log(err)
            // 토큰 만료되면 로그아웃
            localStorage.removeItem("jwt");
            navigate("/login");
        })
    }, [])


    // 받은 쪽지 불러오기
    useEffect(() => {
        if (myId !==''){
            axios({
                method: 'get',
                url: '/dm/all/'+myId
            })
            .then(res => {
                console.log(res.data)
                setMsgs(res.data.reverse().map(e => {
                    const date_ = new Date(e.dm_time)
                    const date = String(
                        date_.getFullYear()*100000000
                        +(date_.getMonth()+1)*1000000
                        +date_.getDate()*10000
                        +date_.getHours()*100
                        +date_.getMinutes()
                    )
                    if (date.slice(0,8) === today){
                        e.dm_time = date.slice(8,10)+':'+date.slice(10,12)
                    } else {
                        e.dm_time = date.slice(4,6)+'/'+date.slice(6,8)
                    }
                    return e
                }))
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [myId])


    // axios에서 데이터를 받아오기 전에 key값 오류 방지
    if (msgs === ''){
        return(
            <div className="d-md-flex">
                <MessageSideBar></MessageSideBar>
                <Spinner animation="border" className="d-none d-md-block" style={{marginTop:"30vh", marginLeft:"35vw"}}/>
                <Spinner animation="border" className='d-md-none d-flex mx-auto' style={{marginTop:"30vh"}}/>
            </div>
        )
    }


    return(
        <div className="d-md-flex">
            <MessageSideBar></MessageSideBar>

            {/* <table style={{border: '1px solid #444444', width: '70%'}}>
                <thead>
                    <tr>
                    <th>제목</th><th>보낸이</th><th>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {msgs.map((msg) => (
                        <tr key={msg.dm_id}>
                            <td>
                                <Link to={`/message/read/${msg.dm_id}`}>
                                    {msg.dm_title}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/profile/${msg.senderId.user_nickname}`}>
                                    {msg.senderId.user_nickname}
                                </Link> 
                            </td>
                            <td>{msg.dm_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        
            <Table style={{ width: '90%', maxWidth:"600px" }} className="mx-auto mt-3 mt-md-5">
                <thead>
                    <tr>
                    <th style={{ width: '40%' }}>제목</th>
                    <th style={{ width: '20%' }}>보낸이</th>
                    <th style={{ width: '10%' }}>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {msgs.map((msg) => (
                        <tr key={msg.dm_id}>
                            <td>
                                {msg.dm_read ?(
                                    <Link 
                                    className='text-dark'
                                    style={{ textDecoration: 'none' }}
                                    to={`/messageread/${msg.dm_id}`}
                                    >
                                        {msg.dm_title}
                                    </Link>
                                ) : (
                                    <Link 
                                    className='text-dark fw-bold'
                                    style={{ textDecoration: 'none' }}
                                    to={`/messageread/${msg.dm_id}`}
                                    >
                                        {msg.dm_title}
                                    </Link>
                                )}
                            </td>
                            <td>
                                {msg.dm_read ?(
                                    <Link 
                                    className='text-dark'
                                    style={{ textDecoration: 'none' }}
                                    to={`/profile/${msg.senderId.user_nickname}`}
                                    >
                                        {msg.senderId.user_nickname}
                                    </Link> 
                                ) : (
                                    <Link 
                                    className='text-dark fw-bold'
                                    style={{ textDecoration: 'none' }}
                                    to={`/profile/${msg.senderId.user_nickname}`}
                                    >
                                        {msg.senderId.user_nickname}
                                    </Link> 
                                )}  
                            </td>
                            <td>
                                {msg.dm_read ?(
                                    <div className=''>
                                        {msg.dm_time}
                                    </div>
                                ) : (
                                    <div className='fw-bold'>
                                        {msg.dm_time}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="ms-auto d-none d-md-block"></div>

        </div>
    )
}

export default Message;