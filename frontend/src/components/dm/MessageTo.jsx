import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'
import MessageSideBar from './MessageSideBar';
import { Form, Button } from "react-bootstrap";

function MessageTo() {
    const navigate = useNavigate();
    
    // 동적 라우팅 저장
    const {to_nickname} = useParams()

    // pk값
    const [receiverId, setReceiverId] = useState('')
    const [senderId, setSenderId] = useState('')


    // 내용 저장
    const [inputs, setInputs] = useState({
        to: to_nickname,
        title: '',
        content: '',
    });
    const { to, title, content } = inputs; 
    const onChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs, 
            [name]: value 
        });
    };


    // pk 저장
    useEffect(() => {
        axios({     // 보내는 사람 pk 저장
            method: 'get',
            url: '/user/mypage/',
            headers: {Authorization: localStorage.getItem('jwt')}
        })
        .then(res => { 
            setSenderId(res.data.userid)
        })
        .catch(err => {
            console.log(err)
            // 토큰 만료되면 로그아웃
            localStorage.removeItem("jwt");
            navigate("/login");
        })

        axios({     // 받는 사람 pk 저장
            method: 'get',
            url: '/user/search?nickname='+to_nickname,
        })
        .then(res => {
            setReceiverId(res.data.userId)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])


    // 보내기 버튼 누를시
    const onSend = ()  => {
        if (title.trim() === '' || content.trim() === ''){
            alert('제목과 내용을 입력해주세요.')
        }
        else{
        axios({     // 쪽지 보내기
            method: 'post',
            url: '/dm/create',
            data: {
                "receiverId": receiverId,
                "senderId": senderId,
                "dm_title": title,
                "dm_msg": content,
            }
        })
        .then(res => {
            console.log(res)
            navigate('/message')
        })
        .catch(err => {
            console.log(err)
        })
        }
    }

    return(
        <div className="d-md-flex">
            <MessageSideBar></MessageSideBar>
            {/* <div>
                <div>
                    받는 사람: {to}
                </div>
                <div>
                    제목: 
                    <input name="title"
                    type="text" 
                    onChange={onChange}
                    value={title}
                    maxLength="30"
                    />
                </div>
                <div>
                    <textarea name="content" 
                    id="" cols="30" rows="10"
                    onChange={onChange}
                    value={content}
                    maxLength="100"
                    ></textarea>
                </div>
                <button onClick={onSend}>보내기</button>
            </div> */}

            <Form style={{ width: '90%', maxWidth:"600px" }} className="mx-auto border p-2 mt-3 mt-md-5">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>받는 사람</Form.Label>
                    <Form.Control 
                        disabled
                        maxLength={15} 
                        type="text" 
                        name="to"
                        onChange={onChange}
                        value={to}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>제목</Form.Label>
                    <Form.Control 
                        maxLength={30} 
                        type="text" 
                        name="title"
                        onChange={onChange}
                        value={title}
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>내용</Form.Label>
                    <Form.Control 
                        maxLength={300} 
                        as="textarea" 
                        rows={5} 
                        name="content"
                        onChange={onChange}
                        value={content}
                    />
                </Form.Group>
                <Button 
                    // variant="secondary"
                    variant="outline-secondary"
                    onClick={onSend}
                    className="d-flex ms-auto"
                >보내기</Button>
            </Form>
            <div className="ms-auto d-none d-md-block"></div>
        </div>
    )
}

export default MessageTo;